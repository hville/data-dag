<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 MD036 -->

# i-set

*indexed set of ordered unique values that can be re-sorted or re-ordered with an API similar to the native javascript Set*

## Example

```javascript
var ISet = require('i-set'),
    iset = new ISet(['a', 'b'])

iset.add('c').add('d')
iset.has('e') // false
iset.index(1) // 'b'
iset.indexOf('b') // 1

iset.forEach(function(k,i) { console.log(i, ':', k)}) // 0:a 1:b 2:c 3:d

iset.order([4,3,2,1])
iset.forEach(function(k,i) { console.log(i, ':', k)}) // 0:d 1:c 2:b 3:a

iset.sort()
iset.forEach(function(k,i) { console.log(i, ':', k)}) // 0:a 1:b 2:c 3:d

iset.clear()
```

## API

`var iset = new ISet([values][, observers])`

In short, the API is similar to the Set API with the following exceptions:
* `index(index) => value` (Array-like)
* `indexOf(value) => index` (Array-like)
* `sort([function]) => self` (Array-like)
* `order(Array) => self`
* forEach behaves like in Arrays (`callback(value, index, array)`)

Internally there is a `._map` property with a native Map (value:index) and a `_arr` property with a native Array (index:value)

Observers are optional functions called when the set composition changes:
* `observers.add(value, index)` called after iset.add(value) adds a value
* `observers.delete(value, index)` called after iset.delete(value) deletes a value
* `observers.clear()` called after iset.clear() deletes values

The observers are not called if no changes are made

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
