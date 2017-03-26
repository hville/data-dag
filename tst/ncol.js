var t = require('cotest'),
		DAG = require('../index')
/*
Requirements
- add an node column
- node operations: has, get, set, add, del, forEach
*/
t('node-set', function() {
	var graph = new DAG(),
			node0 = graph.addNodeData('0', function() { return this.size }),
			nodeA = graph.addNodeData('A', function() { return 'A' })

	t('===', node0.size, 0)
	t('===', node0.add(0, 0), true)
	t('===', nodeA.size, 1, 'adding to one column changes all columns')
	t('===', nodeA.get(0), 'A', 'other columns get default values')
	t('===', nodeA.set(0, 'AA'), true)
	t('===', nodeA.set(1, 'B'), true)
	t('===', nodeA.size, 2)
	t('===', node0.size, 2, 'adding to one column changes all columns')
	t('===', node0.get(1), 1, 'other columns get default values')

	t('===', nodeA.get(0), 'AA')
	t('===', node0.get(0), 0)
	t('===', nodeA.get(2), undefined)
	t('===', node0.get(2), undefined)

	t('===', nodeA.data.reduce(function(str, k){return str+=k}, ''), 'AAB')
	t('===', node0.data.reduce(function(str, k){return str+=k}, ''), '01')

	t('===', node0.del(5), false)
	t('===', node0.size, 2)
	t('===', nodeA.get(0), 'AA')
	t('===', node0.size, 2)
	t('===', node0.del(0), true)
	t('===', node0.size, 1)

	t('===', graph.delNodeData('x'), null)
	t('===', graph.delNodeData(node0.name), node0)
	t('===', graph.delNodeData(nodeA.name), nodeA)
})
