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
		return this.data[this.graph.indexOfNode(nk)]
	},
	add: function add(nk, val) {
		var graph = this.graph,
				data = this.data
		if (!graph.addNode(nk)) return false
		data[data.length-1] = val
		return true
	},
	set: function set(nk, val) {
		var idx = this.graph.indexOfNode(nk)
		if (idx === -1) return this.add(nk, val)
		else this.data[idx] = val
		return true
	},
	del: function del(nk) {
		return this.graph.delNode(nk)
	},
	reduce: function(fcn, res) {
		var data = this.data,
				arrK = this.graph._arrK
		for (var ki=0; ki<arrK.length; ++ki) res = fcn.call(this, res, data[ki], arrK[ki])
		return res
	}
}
