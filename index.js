var topoSort = require('./src/topo'),
		reduce = require('./src/reduce'),
		topoRank = require('./src/rank')

module.exports = DAG

function DAG() {
	this.nodes = [] //...of wells (ie array of incomming edges)
	this.edges = [] //...of pairs [wi, si]
	this.nKeys = new Map() // nodeKeys

	this.nData = {}
	this.eData = {}
	this.rInit = new Map()
}
DAG.prototype = {
	constructor: DAG,
	get E() { return this.edges.length },
	get N() { return this.nodes.length },

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
		reduce(this.eData, addRow, this)
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
		reduce(this.eData, delRow, ie)
		return true
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
		reduce(this.nData, addRow, this)
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
		reduce(this.nData, delRow, r)
		return true
	},
	// COLUMNS
	addNData: function addNData(name, setter) {
		var rInit = this.rInit
		if (rInit.has(name)) return false
		var nCol = this.nData[name] = []
		var init = setter || noop
		rInit.set(name, init)
		for (var i=0; i<this.nodes.length; ++i) nCol[i] = init.call(this,i)
		return true
	},
	delNData: function delNData(name) {
		var nData = this.nData
		if (!nData[name]) return false
		delete nData[name]
		delete this.nInit[name]
		return true
	},
	addEData: function addEData(name, setter) {
		var rInit = this.rInit
		if (rInit.has(name)) return false
		var eCol = this.eData[name] = []
		var init = setter || noop
		rInit.set(name, init)
		for (var i=0; i<this.edges.length; ++i) eCol[i] = init.call(this,i)
		return true
	},
	delEData: function delECol(name) {
		var eData = this.eData
		if (!eData[name]) return false
		delete eData[name]
		delete this.eInit[name]
		return true
	},
	topoSort: topoSort
}
function wellIndex(wn, sn) {
	for (var i=0, wells=sn.wells; i<wells.length; ++i) if (wells[i].well === wn) return i
	return -1
}
function noop(){}
function delRow(r, col) {
	col.splice(r, 1)
	return r
}
function addRow(ctx, col, name) {
	col.push(ctx.rInit.get(name).call(ctx, name, col.length))
	return ctx
}
