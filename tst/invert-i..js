var t = require('cotest'),
		inv = require('../src/invert-i')

t('invert', function() {
	t('{==}', inv([{i:2},{i:0},{i:1}]), [{i:1},{i:2},{i:0}])
	t('{==}', inv([{i:3},{i:2},{i:1},{i:0}]), [{i:3},{i:2},{i:1},{i:0}])
	t('{==}', inv(inv([{i:3},{i:1},{i:0},{i:2}])), [{i:3},{i:1},{i:0},{i:2}])
	t('{==}', inv(inv([{i:1},{i:2},{i:3},{i:0}])), [{i:1},{i:2},{i:3},{i:0}])
})
