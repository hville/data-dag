module.exports = function sort(order, array) {
	var len = order.length
	if (array.length !== len) throw Error('length mismatch')

	for (var i=0; i<len; ++i) if (order[i].i > i && order[i].s > i) {  // if not visited
		var temp = array[i],
				j = i,
				k = order[j].s
		while(k !== i) {           // while not visited
			array[j] = array[j = k]  // switcharoo
			k = order[k].s
		}
		array[j] = temp
	}
	return order
}
