<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 MD036 -->

# data-dag

*directed acylic graph with row or column data fields in under 2kb gzip, no dependencies*

## Example

Available in `cjs` (require), `es6` (import) or `browser` (script) formats

```javascript
var DAG = require('data-dag') // or import DAG from 'data-dag'

function initValueSetter(name, index, array) { return array.length }

var dag = new DAG(),
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
  * Number `dag.N` number of nodes
  * Object `dag.getNode(nodeKey)` Node `{i, s, wells}`
  * Number `dag.addNode(nodeKey)` error code or 0
  * Number `dag.delNode(nodeKey)` error code or 0
* Edges
  * Number `dag.E` number of edges
  * Object `dag.getEdge(wellNodeKey, sinkNodeKey)` Edge Object `{i, s, well, sink}`
  * Number `dag.addEdge(wellNodeKey, sinkNodeKey)` error code or 0
  * Number `dag.delEdge(wellNodeKey, sinkNodeKey)` error code or 0
* Data Columns
  * Number `dag.addEData(name, initSetter)` error code or 0
  * Number `dag.addNData(name, initSetter)` error code or 0
  * Number `dag.delEData(name)` error code or 0
  * Number `dag.delNData(name)` error code or 0
* Common
  * Number `dag.toposort()` error code or 0 - reorders all nodes, edges and datacolunms

* Errors
  * `DAG.DONE = 0` completed, graph changed, no errors
  * `DAG.EXISTS = 1` duplicate entry, no changes
  * `DAG.MISSING = 2` non existing entry, nothing deleted
  * `DAG.CYCLE = 3` cycle detected, no changes
  * `DAG.LINKED = 4` edges must be deleted before nodes, no changes

Throws if attempting to add an edge to nodes that doesn't exist


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
