export function reduce(obj, fcn, res) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn(res, obj[ks[i]], ks[i], obj)
	return res
}
