module.exports = ECol

function ECol(graph, name, getter) {
	this.graph = graph
	this.init = getter
	this.data = []
}
ECol.prototype = {
	constructor: ECol,
	get: function get(wk, sk) {
		var edge = this.graph.getEdge(wk, sk)
		if (edge) return this.data[edge.i]
	},
	set: function set(wk, sk, val) {
		var edge = this.graph.getEdge(wk, sk)
		if (!edge) return false
		else this.data[edge.i] = val
		return true
	}
}

