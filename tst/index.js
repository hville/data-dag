var t = require('cotest'),
		DAG = require('../index')

t('ddag - graph operations', function() {
	var ctx = new DAG()
	//addNode
	t('===', ctx.addNode(0), DAG.DONE)
	t('===', ctx.addNode(1), DAG.DONE)
	t('===', ctx.addNode(2), DAG.DONE)
	t('===', ctx.addNode(3), DAG.DONE)
	t('===', ctx.N, 4)
	t('===', ctx.addNode(3), DAG.EXISTS,'reject duplicates')
	t('===', ctx.N, 4)

	//addEdge
	t('===', ctx.addEdge(3,2), DAG.DONE)
	t('===', ctx.E, 1)
	t('===', ctx.addEdge(3,1), DAG.DONE)
	t('===', ctx.addEdge(1,0), DAG.DONE)
	t('===', ctx.E, 3)
	t('===', ctx.addEdge(1,3), DAG.CYCLE, 'reject cycles')
	t('===', ctx.addEdge(3,1), DAG.EXISTS, 'reject duplicates')
	t('===', ctx.E, 3)
	t('===', ctx.addEdge(3,0), DAG.DONE)

	//resort
	t('===', ctx.addEdge(2,0), DAG.DONE)

	//delete Node
	t('===', ctx.delNode(1), DAG.LINKED, 'edges must be deleted first')
})
t('ddag - toposort integrity', function() {
	var ctx = new DAG()
	ctx.addNData('nodeIdx', function() { return ctx.N-1 })
	ctx.addEData('edgeIdx', function() { return ctx.E-1 })

	t('===', ctx.addNode('A'), DAG.DONE)
	t('===', ctx.addNode('B'), DAG.DONE)
	t('===', ctx.addNode('C'), DAG.DONE)
	t('===', ctx.addNode('D'), DAG.DONE)
	t('===', ctx.nodes.reduce(function(r, n, i){return r+=''+n.k+n.i+i}, ''), 'A00B11C22D33')
	t('===', ctx.nData.nodeIdx.reduce(function(r, v, i){return r+=''+v+i}, ''), '00112233')

	//inverted edges in shuffled order
	t('===', ctx.addEdge('D', 'A'), DAG.DONE)//3
	t('===', ctx.addEdge('D', 'C'), DAG.DONE)//0
	t('===', ctx.addEdge('D', 'B'), DAG.DONE)//1
	t('===', ctx.addEdge('B', 'A'), DAG.DONE)//4
	t('===', ctx.addEdge('C', 'B'), DAG.DONE)//2
	t('===', ctx.eData.edgeIdx.reduce(function(str, k){return str+=k}, ''), '01234')

	//toposort
	t('===', ctx.topoSort(), DAG.DONE)
	t('===', ctx.nodes.reduce(function(r, n, i){return r+=''+n.k+n.i+i}, ''), 'D00C11B22A33')
	t('===', ctx.nData.nodeIdx.reduce(function(r, v, i){return r+=''+v+i}, ''), '30211203')
})
