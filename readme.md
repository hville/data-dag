<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 MD036 -->

# data-dag

*directed acylic graph with row or column data fields*

## Example

```javascript
var CDAG = require('data-dag')

function initValueSetter(name, index, array) { return array.length }

var dag = new IDag(),
		nodeCol = dag.addNData('nodeIndex', initValueSetter),
		edgeCol = dag.addEData('edgeIndex', initValueSetter)

dag.addNode('A')
dag.addNode('B')
dag.addNode('C')

dag.addEdge('D', 'A')
dag.addEdge('D', 'C')
dag.addEdge('B', 'A')
dag.addEdge('C', 'B')

console.log(dag.nData.nodeIndex.join('-')) // 1-2-3
dag.topoSort()
console.log(dag.nData.nodeIndex.join('-')) // 3-2-1
```

## Notes and Features

* Base case is for a column structure to easy send and receive columnar data
* Data can still be in a row-first format by having a single column with multiple fields


## API

Graph structure

* Nodes
  * `dag.N` number of nodes
  * `dag.getNode(nodeKey)` Node Object `{i, s, wells}`
  * `dag.addNode(nodeKey)` Boolean hasChanged
  * `dag.delNode(nodeKey)` Boolean hasChanged
* Edges
  * `dag.E` number of edges
  * `dag.getEdge(wellNodeKey, sinkNodeKey)` Edge Object `{i, s, well, sink}`
  * `dag.addEdge(wellNodeKey, sinkNodeKey)` Boolean hasChanged
  * `dag.delEdge(wellNodeKey, sinkNodeKey)` Boolean hasChanged
* Data Columns
  * `dag.addEData(name, initSetter)` Boolean hasChanged
  * `dag.addNData(name, initSetter)` Boolean hasChanged
  * `dag.delEData(name)` Boolean hasChanged
  * `dag.delNData(name)` Boolean hasChanged
* Common
  * `dag.toposort()` Boolean hasChanged - reorders all nodes, edges and datacolunms

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
