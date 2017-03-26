var t = require('cotest'),
		DAG = require('../index')

t('ECol', function() {
	var graph = new DAG(),
			edge0 = graph.addEdgeData('0', function() { return this.size }),
			edgeA = graph.addEdgeData('A', function() { return 'A' })
	for (var i=0; i<4; ++i) graph.addNode(i)

	t('===', edge0.size, 0)
	t('===', edge0.add(0,1, 0), true)
	t('===', edgeA.size, 1, 'adding to one column changes all columns')
	t('===', edgeA.get(0,1), 'A', 'other columns get default values')
	t('===', edgeA.set(0,1, 'AA'), true)
	t('===', edgeA.set(0,2, 'B'), true)
	t('===', edge0.size, 2, 'adding to one column changes all columns')//
	t('===', edge0.get(0,1), 0, 'other columns get default values')

	t('===', edgeA.get(0,2), 'B')
	t('===', edge0.get(0,2), 1)
	t('===', edgeA.get(1,2), undefined)
	t('===', edge0.get(1,2), undefined)

	t('===', edgeA.data.reduce(function(str, k){return str+=k}, ''), 'AAB')
	t('===', edge0.data.reduce(function(str, k){return str+=k}, ''), '01')
	t('===', edge0.data.reduce(function(str, k){return str+=k}, ''), '01')

	//t('===', edge0.del(1,5), false)
	t('===', edge0.size, 2)

	t('===', edge0.del(0,2), true)
	t('===', edge0.size, 1)
	t('===', edgeA.size, 1)
	t('===', edgeA.get(0,2), undefined, 'deleting one edge deletes it in all other columns')//
	t('===', edge0.get(0,2), undefined)//
	t('===', edgeA.get(0,1), 'AA')
	t('===', edge0.get(0,1), 0)
	t('===', edge0.size, 1)

	t('===', graph.delEdgeData({}), null)
	t('===', graph.delEdgeData('0'), edge0)
	t('===', graph.delEdgeData(edgeA.name), edgeA)
})
