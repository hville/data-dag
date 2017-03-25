module.exports = function invert(ranked) {
	for (var i=0; i<ranked.length; ++i) if (ranked[i].i >= 0) { //not visited
		var tgt = i
		if (ranked[i].i !== i) do {
			var src = tgt
			tgt = ranked[i].i
			ranked[i].i = ~src
			swap(ranked, i, tgt)
		} while (tgt > i)
		if (tgt === i) tgt.i ^= -1
		else throw Error('invalid index '+src+':'+tgt)
	}
	for (var j=0; j<ranked.length; ++j) ranked[j].i ^= -1
	return ranked
}
function swap(arr, i, j) {
	var t = arr[i]
	arr[i] = arr[j]
	arr[j] = t
}

