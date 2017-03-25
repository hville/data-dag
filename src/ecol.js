module.exports = ECol

function ECol(graph, name, getter) {
	this.graph = graph
	this.name = name
	this.init = getter
	this.data = []
}
ECol.prototype = {
	constructor: ECol,
	get size() { return this.data.length },
	has: function has(wk, sk) {
		return this.graph.hasEdge(wk, sk)
	},
	get: function get(wk, sk) {
		return this.data[this.graph.indexOfEdge(wk, sk)]
	},
	add: function add(wk, sk, val) {
		var graph = this.graph,
				data = this.data
		if (!graph.addEdge(wk, sk)) return false
		data[data.length-1] = val
		return true
	},
	set: function set(wk, sk, val) {
		var idx = this.graph.indexOfEdge(wk, sk)
		if (idx === -1) return this.add(wk, sk, val)
		else this.data[idx] = val
		return true
	},
	del: function del(wk, sk) {
		return this.graph.delEdge(wk, sk)
	}
}
//TODO add forEach and reduce once well index and rank are split
