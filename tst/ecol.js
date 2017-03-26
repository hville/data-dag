var t = require('cotest'),
		DAG = require('../index')

t('eCol', function() {
	var graph = new DAG(),
			edge0 = graph.addEdgeData('0', function() { return graph.E-1 }),
			edgeA = graph.addEdgeData('A', function() { return 'A' })
	for (var i=0; i<4; ++i) graph.addNode(i)

	t('===', graph.addEdge(0,1), true)
	t('===', graph.addEdge(0,2), true)
	t('===', edgeA.get(0,1), 'A', 'other columns get default values')
	t('===', edgeA.set(0,1, 'AA'), true)
	t('===', edgeA.set(0,2, 'B'), true)
	t('===', edge0.get(0,1), 0, 'other columns get default values')

	t('===', edgeA.get(0,2), 'B')
	t('===', edge0.get(0,2), 1)
	t('===', edgeA.get(1,2), undefined)
	t('===', edge0.get(1,2), undefined)

	t('===', edgeA.data.reduce(function(str, k){return str+=k}, ''), 'AAB')
	t('===', edge0.data.reduce(function(str, k){return str+=k}, ''), '01')

	t('===', edgeA.get(0,1), 'AA')
	t('===', edge0.get(0,1), 0)

	t('===', graph.delEdgeData({}), null)
	t('===', graph.delEdgeData('0'), edge0)
	t('===', graph.delEdgeData('A'), edgeA)
})
