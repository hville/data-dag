var reduce = require('./reduce'),
		NCol = require('./ncol'),
		ECol = require('./ecol')

module.exports = Core
/*
BASIC DAG
- topological ranks
- no resorting (fixed order)
*/
function Core() {
	this.nodes = [] //...of wells (ie array of incomming edges)
	this.edges = [] //...of pairs [wi, si]
	this.nodeData = {}
	this.edgeData = {}
}
Core.prototype = {
	constructor: Core,

	// EDGES
	hasEdge: function(wi, si) { //(N,N) => B
		if (wellIndex(this.nodes, wi, si) === -1) return false
		return true
	},
	indexOfEdge: function(wi, si) { //(N,N) => {i,well,sink}
		var nodes = this.nodes,
				idx = wellIndex(nodes, wi, si)
		return idx === -1 ? -1 : nodes[si].wells[idx].i
	},
	addEdge: function(wi, si) { //(N,N) => N
		var nodes = this.nodes,
				edges = this.edges,
				node = nodes[si]

		if (!node) throw Error('invalid sink: ' + si)
		if (!(wi >= 0 && wi < nodes.length)) throw Error('invalid well: ' + wi)
		if (wi === si) return false //no cycles
		if (wellIndex(nodes, wi, si) !== -1) return false //existing
		if (wellIndex(nodes, si, wi) !== -1) return false //existing

		var ei = edges.length
		edges[ei] = {i:ei, well:nodes[wi], sink:nodes[si]}
		node.wells.push(edges[ei])

		// undo on cycles
		if (!rankNodes(nodes)) {
			node.wells.pop()
			edges.pop()
			if (rankNodes(nodes)) return false
			throw Error('corrupted graph')
		}

		// fix columns
		reduce(this.edgeData, addRow, ei)
		return true
	},
	delEdge: function(wi, si) { //(N,N) => N
		var nodes = this.nodes,
				edges = this.edges,
				wells = nodes[si].wells
		var w = wellIndex(nodes, wi, si)
		if (w === -1) return false
		var e = nodes[si].wells[w].i
		wells.splice(w, 1)
		edges.splice(e, 1)

		// fixes edge indices & columns
		for (var i=e; i<edges.length; ++i) --edges[i].i
		reduce(this.edgeData, delRow, e)
		return true
	},

	// NODES
	hasNode: function(ni) {
		return ni >= 0 && ni < this.nodes.length
	},
	indexOfNode: function(ni) {
		return ni >= 0 && ni < this.nodes.length ? ni : -1
	},
	addNode: function() { // () => N
		//accept an optional arguments for symetry with keyed API
		var N = arguments.length ? arguments[0] : this.nodes.length
		this.nodes[N] = {i:N, wells:[]}
		// fix columns
		reduce(this.nodeData, addRow, N)
		return true
	},
	delNode: function(ni) { // (N) => N
		var edges = this.edges,
				nodes = this.nodes,
				node = nodes[ni]
		// fail is not a node or if is a sink (has wells)
		if (!node || node.wells.length) return false
		// fail if is a well
		for (var i=0; i<edges.length; ++i) if (edges[i].well === node) return false
		// delete node and fix rankings
		var r = node.i
		nodes.splice(ni,1)
		for (var j=0; j<nodes.length; ++j) if (nodes[i].i > r) --nodes[i].i
		reduce(this.nodeData, delRow, ni)
		return true
	},
	// COLUMNS
	addNodeData: function(name, getter) {
		return addData(this, this.nodeData, name, NCol, getter)
	},
	addEdgeData: function(name, getter) {
		return addData(this, this.edgeData, name, ECol, getter)
	},
	delNodeData: function(name) {
		return delData(this, this.nodeData, name)
	},
	delEdgeData: function(name) {
		return delData(this, this.edgeData, name)
	}
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
function wellIndex(nodes, wi, si) {
	if (!nodes[si]) return -1
	var wells = nodes[si].wells
	if (!wells) return -1
	for (var i=0, well = nodes[wi]; i<wells.length; ++i) if (wells[i].well === well) return i
	return -1
}
function rankNodes(nodes) {
	var rank = 0
	// Prep. Convention: Initial:-1; Temp:-2; Final: >=0
	nodes.forEach(unsetIndex)
	for (var j=0; j<nodes.length; ++j) if (nodes[j].i < 0) { // not visited
		rank = visit(nodes, nodes[j], rank)
		if (rank === -1) return false
	}
	return true
}
function visit(nodes, node, rank) {
	if (node.i === -2) return -1 // not a DAG
	if (node.i === -1) {         // not visited
		node.i = -2                // temp mark
		var wells = node.wells
		for (var i=0; i<wells.length; ++i) {
			rank = visit(nodes, wells[i].well, rank)
			if (rank === -1) return -1
		}
		node.i = rank++
	}
	return rank
}
function unsetIndex(v) {
	v.i = -1
}
function addRow(r, set) {
	set.data[r] = set.init()
	return r
}
function delRow(r, set) {
	set.data.splice(r, 1)
	return r
}
