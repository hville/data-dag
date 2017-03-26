module.exports = function topoRank(nodes) {
	var ranks = {n:0, e:0} // last topoRank of edges and nodes

	// Prep. Convention: Initial:-1; Temp:-2; Final: >=0
	nodes.forEach(unsetSort)
	for (var j=0; j<nodes.length; ++j) if (nodes[j].s < 0) { // not visited
		ranks = visit(nodes[j], ranks)
		if (!ranks) return false
	}
	return true
}
function unsetSort(v) {         // mark for topoRank
	v.s = -1
}
function visit(node, ranks) {
	if (node.s === -2) return null // not a DAG
	if (node.s === -1) {           // not visited
		node.s = -2                  // temp mark
		var wells = node.wells
		for (var i=0; i<wells.length; ++i) {
			var edge = wells[i]
			ranks = visit(edge.well, ranks)
			if (!ranks) return null
			edge.s = ranks.e++
		}
		node.s = ranks.n++
	}
	return ranks
}
