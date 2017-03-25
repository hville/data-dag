var t = require('cotest'),
		ISet = require('./index')

t('i-set constructor and size property', function() {
	t('===', (new ISet()).size, 0)
	t('===', (new ISet([4])).size, 1)
	t('===', (new ISet([3,3,1])).size, 2, 'ignore duplicates')
})
t('i-set methods', function() {
	var iset = new ISet()
	// add
	t('===', iset.add('a').add('b').add('c'), iset)
	// size
	t('===', iset.size, 3)
	t('===', iset._map.size, 3)
	t('===', iset._arr.length, 3)
	// has
	t('===', iset.has('b'), true)
	t('===', iset.has('d'), false)
	// del
	t('===', iset.delete('b'), true)
	t('===', iset.delete('d'), false)
	t('===', iset.delete('b'), false)
	// size
	t('===', iset.size, 2)
	t('===', iset._map.size, 2)
	t('===', iset._arr.length, 2)
	// get
	t('===', iset.indexOf('a'), 0, 'get')
	t('===', iset.indexOf('b'), -1, 'get')
	t('===', iset.indexOf('c'), 1, 'get')
	// forEach
	var str=''
	iset.forEach(function(k,i) { str+=k+i })
	t('===', str, 'a0c1', 'forEach')
	//clear
	t('===', iset.clear(), undefined, 'clear')
	t('===', iset.size, 0, 'clear size')
	//sort
	t('===', iset.add('b').add('c').add('a').size, 3)
	t('{==}', iset.order([1,0,2])._arr, ['c', 'b', 'a'])
	t('{==}', iset.sort()._arr, ['a', 'b', 'c'])
	t('===', iset.indexOf('b'), 1)
	//index
	t('===', iset.index(2), 'c')
	t('===', iset.index(7), undefined)
})
