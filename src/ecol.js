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
	get: function get(wk, sk) {
		var edge = this.graph.getEdge(wk, sk)
		if (edge) return this.data[edge.i]
	},
	add: function add(wk, sk, val) {
		var graph = this.graph,
				data = this.data
		if (!graph.addEdge(wk, sk)) return false
		data[data.length-1] = val
		return true
	},
	set: function set(wk, sk, val) {
		var edge = this.graph.getEdge(wk, sk)
		if (!edge) return this.add(wk, sk, val)
		else this.data[edge.i] = val
		return true
	},
	del: function del(wk, sk) {
		return this.graph.delEdge(wk, sk)
	}
	//TODO consider forEach((v,w,s)=>void)
	//TODO consider reduce((r,v,w,s)=>r)
}

