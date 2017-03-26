module.exports = NCol

function NCol(graph, name, getter) {
	this.graph = graph
	this.init = getter
	this.data = []
}
NCol.prototype = {
	constructor: NCol,
	get: function get(nk) {
		var node = this.graph.getNode(nk)
		if (node) return this.data[node.i]
	},
	set: function set(nk, val) {
		var node = this.graph.getNode(nk)
		if (!node) return false
		else this.data[node.i] = val
		return true
	}
}
