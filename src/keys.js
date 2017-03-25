module.exports = Keys
function Keys() {
	this._map = new Map()
	this._arr = []
}
//has get set->add size delete forEach set
Keys.prototype = {
	constructor: Keys,
	has: function(key) { return this._map.has(key) },
	add: function(key) {
		var arr = this._arr,
				map = this._map,
				len = arr.length
		if (!map.has(key)) {
			map.set(key, len)
			arr[len] = key
		}
		return this
	},
	index: function(i) { return this._arr[i] },
	forEach: function(fcn, ctx) { this._arr.forEach(fcn, ctx) },
	delete: function(item) {
		var arr = this._arr,
				map = this._map,
				idx = map.get(item),
				has = map.delete(item)
		if (has) {
			arr.splice(idx, 1)
			for (var i=idx; i<arr.length; ++i) map.set(arr[i], i)
			if (this.ondelete) this.ondelete(item, idx)
		}
		return has
	}
}
