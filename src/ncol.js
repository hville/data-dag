module.exports = NCol

function NCol(graph, name, getter) {
	this.graph = graph
	this.name = name
	this.init = getter
	this.data = []
}
NCol.prototype = {
	constructor: NCol,
	get size() { return this.data.length },
	has: function has(nk) {
		return this.graph.hasNode(nk)
	},
	get: function get(nk) {
		return this.data[this.graph.getNode(nk).i]
	},
	add: function add(nk, val) {
		var graph = this.graph,
				data = this.data
		if (!graph.addNode(nk)) return false
		data[data.length-1] = val
		return true
	},
	set: function set(nk, val) {
		var node = this.graph.getNode(nk)
		if (!node) return this.add(nk, val)
		else this.data[node.i] = val
		return true
	},
	del: function del(nk) {
		return this.graph.delNode(nk)
	}
	//TODO consider forEach((v,w,s)=>void)
	//TODO consider reduce((r,v,w,s)=>r)
}
