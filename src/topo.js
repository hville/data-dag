var sort = require('./sort'),
		reduce = require('./reduce')

module.exports = function topoSort() {
	sortAll(this.nodes, this.nData)
	sortAll(this.edges, this.eData)
	return true
}
function sortAll(list, data) {
	list.forEach(setRank)
	list.forEach(setFrom)
	// flip nodes: old:new => new:old and reorder keys and nodeColumns
	reduce(data, sort, list)
	sort(list, list)
}
function setRank(v) {
	v.i = v.s
}
function setFrom(v,i,a) {
	a[v.i].s = i
}
