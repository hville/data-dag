module.exports = NCol

function NCol(graph, name, getter) {
	this.graph = graph
	this.init = getter
	this.data = []
}
NCol.prototype = {
	constructor: NCol,
	get size() { return this.data.length },
	get: function get(nk) {
		var node = this.graph.getNode(nk)
		if (node) return this.data[node.i]
	},
	set: function set(nk, val) {
		var node = this.graph.getNode(nk)
		if (!node) return false
		else this.data[node.i] = val
		return true
	},
	del: function del(nk) {
		return this.graph.delNode(nk)
	}
	//TODO consider forEach((v,w,s)=>void)
	//TODO consider reduce((r,v,w,s)=>r)
}
