var IDAG = require('./idag'),
		orderLike = require('./order-i'),
		flipRanks = require('./invert-i'),
		reduce = require('./reduce')

var proto = IDAG.prototype

module.exports = KDAG

function KDAG() {
	IDAG.call(this)
	this._mapK = new Map()
	this._arrK = []
}

KDAG.prototype = {
	constructor: KDAG,
	// GETTERS
	get E() { return this.edges.length },
	get N() { return this.nodes.length },

	// EDGES
	hasEdge: wrapKeys(proto.hasEdge),
	indexOfEdge: wrapKeys(proto.getEdge),
	addEdge: wrapKeys(proto.addEdge),
	delEdge: wrapKeys(proto.delEdge),

	// NODES
	hasNode: function(nk) {
		return this._mapK.has(nk)
	},
	indexOfNode: function(nk) {
		return this._mapK.get(nk)
	},
	addNode: function(nk) {
		var arrK = this._arrK,
				mapK = this._mapK
		if (mapK.has(nk)) return false
		proto.addNode.call(this)
		var len = arrK.length
		mapK.set(nk, len)
		arrK[len] = nk
		return true
	},
	delNode: function(nk) {
		var arrK = this._arrK,
				mapK = this._mapK,
				ni = mapK.get(nk)
		if (ni === undefined || !proto.delNode.call(this, ni)) return false
		mapK.delete(nk)
		arrK.splice(ni, 1)
		for (var i=ni; i<arrK.length; ++i) mapK.set(arrK[i], i)
		return true
	},
	// COLUMNS
	addNodeData: proto.addNodeData,
	delNodeData: proto.delNodeData,
	addEdgeData: proto.addEdgeData,
	delEdgeData: proto.delEdgeData,
	// TOPOSORT
	topoSort: function() {
		var nodes = this.nodes,
				edges = this.edges,
				arrK = this._arrK,
				mapK = this._mapK

		// flip nodes: old:new => new:old and reorder keys and nodeColumns
		flipRanks(nodes)
		reduce(this.nodeData, reorder, nodes)
		orderLike(arrK, nodes)
		for (var ki=0; ki<arrK.length; ++ki) mapK.set(arrK[ki], ki)

		// rank edges
		var ei = 0
		for (var i=0; i<nodes.length; ++i) {
			var wells = nodes[i].wells
			for (var j=0; j<wells.length; ++j) {
				edges[wells[j].i].i = ei++ //O:N
			}
		}
		// flip edges: old:new => new:old and reorder edgeColumns
		flipRanks(edges)
		reduce(this.edgeData, reorder, edges)

		// renumber
		nodes.forEach(resetIndex)
		edges.forEach(resetIndex)
		return true
	}
}
function wrapKeys(method) {
	return function(wk, sk) {
		var mapK = this._mapK
		return method.call(this, mapK.get(wk), mapK.get(sk))
	}
}
function reorder(nodes, set) {
	console.log('REORDER', nodes.length, set.data.length)
	orderLike(set.data, nodes)
	return nodes
}
function resetIndex(v,i) {
	v.i = i
}
