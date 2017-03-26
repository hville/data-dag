var sort = require('./src/sort'),
		reduce = require('./src/reduce'),
		NCol = require('./src/ncol'),
		ECol = require('./src/ecol'),
		topoRank = require('./src/topo')

module.exports = DAG

function DAG() {
	this.nodes = [] //...of wells (ie array of incomming edges)
	this.edges = [] //...of pairs [wi, si]
	this.nKeys = new Map() // nodeKeys

	this.nodeData = {}
	this.edgeData = {}
}
DAG.prototype = {
	constructor: DAG,
	get E() { return this.edges.length },
	get N() { return this.nodes.length },

	/**
	* @function hasEdge
	* @param  {*} wk well node key
	* @param  {*} sk sink well key
	* @return {boolean} exists
	*/
	hasEdge: function hasEdge(wk, sk) {
		var mapK = this.nKeys,
				wn = mapK.get(wk),
				sn = mapK.get(sk)
		if (!wn || !sn || wellIndex(wn, sn) === -1) return false
		return true
	},

	/**
	* @function getEdge
	* @param  {*} wk well node key
	* @param  {*} sk sink well key
	* @return {Object} edge
	*/
	getEdge: function getEdge(wk, sk) {
		var nKeys = this.nKeys,
				wn = nKeys.get(wk),
				sn = nKeys.get(sk)
		if (!wn || !sn) return null
		var idx = wellIndex(wn, sn)
		return idx === -1 ? null : sn.wells[idx]
	},

	/**
	* @function addEdge
	* @param  {*} wk well node key
	* @param  {*} sk sink well key
	* @return {boolean} changed
	*/
	addEdge: function addEdge(wk, sk) {
		var nodes = this.nodes,
				edges = this.edges,
				nKeys = this.nKeys,
				sn = nKeys.get(sk),
				wn = nKeys.get(wk)
		if (!sn || !wn) throw Error('invalid node keys')
		if (wn === sn) return false //no cycles
		if (wellIndex(wn, sn) !== -1) return false //existing

		var ei = edges.length
		edges[ei] = {i:ei, s:ei, well:wn, sink:sn}
		sn.wells.push(edges[ei])

		// undo if cycles
		if (!topoRank(nodes)) {
			sn.wells.pop()
			edges.pop()
			topoRank(nodes)
			return false
		}

		// fix columns
		reduce(this.edgeData, addRow, ei)
		return true
	},

	/**
	* @function delEdge
	* @param  {*} wk well node key
	* @param  {*} sk sink well key
	* @return {boolean} changed
	*/
	delEdge: function delEdge(wk, sk) {
		var edges = this.edges,
				nKeys = this.nKeys,
				sn = nKeys.get(sk),
				wn = nKeys.get(wk)
		if (!wn || !sn) return false
		var iw = wellIndex(wn, sn)
		if (iw === -1) return false
		var ie = sn.wells[iw].i
		sn.wells.splice(iw, 1)
		edges.splice(ie, 1)

		// fixes edge indices & columns
		for (var i=ie; i<edges.length; ++i) --edges[i].i
		reduce(this.edgeData, delRow, ie)
		return true
	},

	/**
	* @function hasNode
	* @param  {*} nk node key
	* @return {boolean} exists
	*/
	hasNode: function hasNode(nk) {
		return this.nKeys.has(nk)
	},
	/**
	* @function getNode
	* @param  {*} nk node key
	* @return {Object} node
	*/
	getNode: function getNode(nk) {
		return this.nKeys.get(nk)
	},
	/**
	* @function addNode
	* @param  {*} nk node key
	* @return {boolean} changed
	*/
	addNode: function addNode(nk) {
		var nKeys = this.nKeys,
				N = this.nodes.length
		if (nKeys.has(nk)) return false
		// add node
		var node = {i:N, s:N, k:nk, wells:[]}
		nKeys.set(nk, node)
		this.nodes[N] = node
		// fix columns
		reduce(this.nodeData, addRow, N)
		return true
	},
	/**
	* @function delNode
	* @param  {*} nk node key
	* @return {boolean} changed
	*/
	delNode: function delNode(nk) {
		var edges = this.edges,
				nodes = this.nodes,
				nKeys = this.nKeys,
				node = nKeys.get(nk)
		// fail does not exist or has edges
		if (!node || node.wells.length) return false
		for (var ie=0; ie<edges.length; ++ie) if (edges[ie].well === node) return false

		// delete node and fix rankings
		nKeys.delete(nk)
		var r = node.i
		nodes.splice(r,1)
		for (var j=0; j<nodes.length; ++j) if (nodes[j].i > r) --nodes[j].i
		reduce(this.nodeData, delRow, r)
		return true
	},
	// COLUMNS
	addNodeData: addNodeData,
	delNodeData: delNodeData,
	addEdgeData: addEdgeData,
	delEdgeData: delEdgeData,
	// TOPOSORT
	topoSort: function() {
		var nodes = this.nodes,
				edges = this.edges
		// flip nodes: old:new => new:old and reorder keys and nodeColumns
		nodes.forEach(setRank)
		edges.forEach(setRank)
		nodes.forEach(setFrom)
		edges.forEach(setFrom)

		// flip nodes: old:new => new:old and reorder keys and nodeColumns
		reduce(this.nodeData, reorder, nodes)
		sort(nodes, nodes)

		// rank edges
		reduce(this.edgeData, reorder, edges)
		sort(edges, edges)

		return true
	}
}
function reorder(nodes, set) {
	sort(set.data, nodes)
	return nodes
}
// METHODS
function addNodeData(name, getter) {
	return addData(this, this.nodeData, name, NCol, getter)
}
function addEdgeData(name, getter) {
	return addData(this, this.edgeData, name, ECol, getter)
}
function delNodeData(name) {
	return delData(this, this.nodeData, name)
}
function delEdgeData(name) {
	return delData(this, this.edgeData, name)
}
// INTERNALS
function addData(graph, dataSet, name, Constructor, getter) {
	if (dataSet[name]) return null
	return dataSet[name] = new Constructor(graph, name, getter)
}
function delData(graph, dataSet, name) {
	var col = dataSet[name]
	if (!col) return null
	delete dataSet[name]
	col.graph = null
	return col
}
function wellIndex(wn, sn) {
	for (var i=0, wells=sn.wells; i<wells.length; ++i) if (wells[i].well === wn) return i
	return -1
}
function addRow(r, set) {
	set.data[r] = set.init()
	return r
}
function delRow(r, set) {
	set.data.splice(r, 1)
	return r
}
function setRank(v) {
	v.i = v.s
}
function setFrom(v,i,a) {
	a[v.i].s = i
}

