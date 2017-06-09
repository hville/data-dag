import {sortTo} from './sort-to'
import {reduce} from './reduce'

export function topoSort() {
	sortAll(this.nodes, this.nData)
	sortAll(this.edges, this.eData)
	return 0 //DAG.DONE
}
function sortAll(list, data) {
	list.forEach(setRank)
	list.forEach(setFrom)
	// flip nodes: old:new => new:old and reorder keys and nodeColumns
	reduce(data, sortTo, list)
	sortTo(list, list)
}
function setRank(v) {
	v.i = v.s
}
function setFrom(v,i,a) {
	a[v.i].s = i
}
