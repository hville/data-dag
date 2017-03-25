module.exports = function orderI(array, order) {
	var len = order.length
	if (array.length !== len) throw Error('length mismatch' + array.length + ' !== ' + len)

	// iterate unmarked indices.
	// Making is done with negative indices (bitwise ~ or ^-1)
	for (var i=0; i<len; ++i) {
		var b = order[i].s
		if (b >= 0) {  // if not visited
			var tmp = array[i],
					a = i
			do {
				order[a].s ^= -1  // mark as visited (negative index)
				if (a !== b) {
					array[a] = b === i ? tmp : array[b]  // switcharoo
					a = b
				}
				b = order[a].s
			} while(b >= 0)  // while not visited
			if (a !== i) throw Error('invalid of duplicate order index')
		}
	}
	// remove marks
	for (var j=0; j<len; ++j) order[j].s ^= -1
	return array
}
