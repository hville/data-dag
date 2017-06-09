var t = require('cotest'),
		sort = require('../tmp/sort-to').sortTo

var samples = ['a','b','c','d','e','f']

function tester(ranks, msg) {
	var source = samples.slice(0, ranks.length)
	var mixed = ranks.map(function(v) {
		return source[v]
	})
	var order = ranks.map(function(v) {
		return {i:v,s:-1}
	})
	ranks.forEach(function(v,i) {
		order[v].s = i
	})
	sort(order, mixed)
	t('{==}', mixed, source, msg + ranks.join('-'))
}

t('sort - valid order', function() {
	tester([0,1,2,3,4,5], 'fixed')

	tester([1,0,3,2,5,4], 'adjacent pairs')
	tester([2,0,1,4,5,3], 'adjavent triplets')

	tester([5,4,3,2,1,0], 'split pairs(inverse)')
	tester([2,5,4,1,0,3], 'split triplets')
})
