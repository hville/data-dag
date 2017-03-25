var t = require('cotest'),
		IDAG = require('../src/idag')
/*
Requirements
- add an node column
- node operations: has, get, set, add, del, forEach
*/
t('node-set', function() {
	var graph = new IDAG(),
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

	t('===', nodeA.has(0), true)
	t('===', node0.has(0), true)
	t('===', nodeA.has(2), false)
	t('===', node0.has(2), false)

	t('===', nodeA.data.reduce(function(str, k){return str+=k}, ''), 'AAB')
	t('===', node0.data.reduce(function(str, k){return str+=k}, ''), '01')

	t('===', node0.del(5), false)
	t('===', node0.size, 2)
	t('===', nodeA.has(0), true)
	t('===', node0.size, 2)
	t('===', node0.del(0), true)
	t('===', node0.size, 1)

	t('===', graph.delNodeData('x'), null)
	t('===', graph.delNodeData(node0.name), node0)
	t('===', graph.delNodeData(nodeA.name), nodeA)
})
