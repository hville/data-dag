var t = require('cotest'),
		DAG = require('../index')

t('ddag - graph operations', function() {
	var ctx = new DAG()
	//addNode
	t('===', ctx.addNode(0), true)
	t('===', ctx.addNode(1), true)
	t('===', ctx.addNode(2), true)
	t('===', ctx.addNode(3), true)
	t('===', ctx.N, 4)
	t('===', ctx.addNode(3), false, 'reject duplicates')
	t('===', ctx.N, 4)

	//addEdge
	t('===', ctx.addEdge(3,2), true)
	t('===', ctx.E, 1)
	t('===', ctx.addEdge(3,1), true)
	t('===', ctx.addEdge(1,0), true)
	t('===', ctx.E, 3)
	t('===', ctx.addEdge(1,3), false, 'reject cycles')
	t('===', ctx.addEdge(3,1), false, 'reject duplicates')
	t('===', ctx.E, 3)
	t('===', ctx.addEdge(3,0), true)

	//resort
	t('===', ctx.addEdge(2,0), true)

	//delete Node
	t('===', ctx.delNode(1), false, 'edges must be deleted first')
})
t('ddag - toposort integrity', function() {
	var ctx = new DAG()
	ctx.addNData('nodeIdx', function() { return ctx.N-1 })
	ctx.addEData('edgeIdx', function() { return ctx.E-1 })

	t('===', ctx.addNode('A'), true)
	t('===', ctx.addNode('B'), true)
	t('===', ctx.addNode('C'), true)
	t('===', ctx.addNode('D'), true)
	t('===', ctx.nodes.reduce(function(r, n, i){return r+=''+n.k+n.i+i}, ''), 'A00B11C22D33')
	t('===', ctx.nData.nodeIdx.reduce(function(r, v, i){return r+=''+v+i}, ''), '00112233')

	//inverted edges in shuffled order
	t('===', ctx.addEdge('D', 'A'), true)//3
	t('===', ctx.addEdge('D', 'C'), true)//0
	t('===', ctx.addEdge('D', 'B'), true)//1
	t('===', ctx.addEdge('B', 'A'), true)//4
	t('===', ctx.addEdge('C', 'B'), true)//2
	t('===', ctx.eData.edgeIdx.reduce(function(str, k){return str+=k}, ''), '01234')

	//toposort
	t('===', ctx.topoSort(), true)
	t('===', ctx.nodes.reduce(function(r, n, i){return r+=''+n.k+n.i+i}, ''), 'D00C11B22A33')
	t('===', ctx.nData.nodeIdx.reduce(function(r, v, i){return r+=''+v+i}, ''), '30211203')
})
