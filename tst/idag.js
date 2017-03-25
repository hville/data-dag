var t = require('cotest'),
		IDAG = require('../src/idag')

var ctx = new IDAG()
t('idag - addNode', function() {
	t('===', ctx.addNode(), true)
	t('===', ctx.addNode(), true)
	t('===', ctx.addNode(), true)
	t('===', ctx.addNode(), true)
	t('===', ctx.addNode(), true)
})
t('idag - addEdge', function() {
	t('===', ctx.addEdge(3,2), true)
	t('===', ctx.addEdge(3,1), true)
	t('===', ctx.addEdge(2,1), true)
	t('===', ctx.addEdge(1,0), true)

	t('===', ctx.nodes.map(function(v){return v.i}).join(''), '32104', 're-ranked')
	t('===', ctx.edges.map(function(v){return v.i}).join(''), '0123', 'not-ranked')

	t('===', ctx.addEdge(1,0), false, 'invalid duplicate')
	t('===', ctx.addEdge(2,3), false, 'invalid cycle')
	t('===', ctx.addEdge(3,3), false, 'invalid cycle')
	t('catch', function() { ctx.addEdge(9,9) }, /invalid/, 'invalid nodes')
})
t('idag - hasEdge', function() {
	t('===', ctx.hasEdge(2,1), true)
	t('===', ctx.hasEdge(0,3), false)
	t('===', ctx.hasEdge(9,9), false)
})
t('idag - delEdge', function() {
	t('===', ctx.delEdge(2,1), true)
	t('===', ctx.delEdge(0,3), false)
	t('===', ctx.nodes.map(function(v){return v.i}).join(''), '32104', 're-ranked')
	t('===', ctx.edges.map(function(v){return ''+v.well.i+v.sink.i}).join('-'), '01-02-23','ranks of 32-31-10')
})
t('idag - delNode', function() {
	t('===', ctx.delNode(3), false)
	t('===', ctx.delNode(4), true)
})
