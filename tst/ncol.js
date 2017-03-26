var t = require('cotest'),
		DAG = require('../index')
/*
Requirements
- add an node column
- node operations: has, get, set, add, del, forEach
*/
t('nCol', function() {
	var graph = new DAG(),
			node0 = graph.addNodeData('0', function() { return graph.N-1 }),
			nodeA = graph.addNodeData('A', function() { return 'A' })

	t('===', graph.addNode(0), true)
	t('===', graph.addNode(1), true)
	t('===', nodeA.get(0), 'A', 'other columns get default values')
	t('===', nodeA.set(0, 'AA'), true)
	t('===', nodeA.set(1, 'B'), true)
	t('===', node0.get(1), 1, 'other columns get default values')

	t('===', nodeA.get(0), 'AA')
	t('===', node0.get(0), 0)
	t('===', nodeA.get(2), undefined)
	t('===', node0.get(2), undefined)

	t('===', nodeA.data.reduce(function(str, k){return str+=k}, ''), 'AAB')
	t('===', node0.data.reduce(function(str, k){return str+=k}, ''), '01')

	t('===', nodeA.get(0), 'AA')

	t('===', graph.delNodeData('x'), null)
	t('===', graph.delNodeData('0'), node0)
	t('===', graph.delNodeData('A'), nodeA)
})
