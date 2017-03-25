var arrayOrder = require('array-order')

module.exports = ISet
/*
	Set with Position Index
	API similar javascript Set. Exceptions:
		Number get(item) => index
		Any    index(index) => item
		self   sort(sorter|order)
*/
function ISet(items, callbacks) {
	this._map = new Map()
	this._arr = []
	this.onadd = callbacks && callbacks.add
	this.ondelete = callbacks && callbacks.delete
	this.onclear = callbacks && callbacks.clear
	if (items) items.forEach(this.add, this)
}
ISet.prototype = {
	get size() { return this._arr.length },
	has: function(item) { return this._map.has(item) },
	indexOf: function(item) {
		var idx = this._map.get(item)
		return idx === undefined ? -1 : idx
	},
	add: function(item) {
		var arr = this._arr,
				map = this._map
		if (!map.has(item)) {
			map.set(item, arr.length)
			arr[arr.length] = item
			if (this.onadd) this.onadd(item, arr.length)
		}
		return this
	},
	index: function(i) { return this._arr[i] },
	clear: function() {
		var size = this._map.size
		this._map.clear()
		this._arr.length = 0
		if (size && this.onclear) this.onclear()
	},
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
	},
	sort: function(sorter) {
		var arr = this._arr,
				map = this._map
		arr.sort(sorter).forEach(map.set, map)
		return this
	},
	order: function(order) {
		var arr = this._arr,
				map = this._map
		arrayOrder(arr, order).forEach(map.set, map)
		return this
	}
}
