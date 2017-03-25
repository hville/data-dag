<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 MD036 -->

# data-dag

*directed acylic graph with row or column data fields*

## Example

```javascript
var CDAG = require('data-dag')

var dag = new IDag(),
		nodeCol = dag.addNodeData('nodeIndex', function() { return this.size }),
		edgeCol = dag.addEdgeData('edgeIndex', function() { return this.size })

dag.addNode('A')
nodeCol.add('B', 1)
dag.addNode('C')

dag.addEdge('D', 'A')
dag.addEdge('D', 'C')
dag.addEdge('B', 'A')
dag.addEdge('C', 'B')

dag.topoSort()
```

## Notes and Features

* Base case is for a column structure to easy send and receive columnar data
* Data can still be in a row-first format by having a single column with multiple fields


## API

Graph structure

* `dag.N` number of nodes
* `dag.hasNode(nodeKey)` Boolean
* `dag.getNode(nodeKey)` Node Object `{i, s, wells}`
* `dag.addNode(nodeKey)` Boolean hasChanged
* `dag.delNode(nodeKey)` Boolean hasChanged
* `dag.E` number of edges
* `dag.hasEdge(wellNodeKey, sinkNodeKey)` Boolean
* `dag.getEdge(wellNodeKey, sinkNodeKey)` Edge Object `{i, s, well, sink}`
* `dag.addEdge(wellNodeKey, sinkNodeKey)` Boolean hasChanged
* `dag.delEdge(wellNodeKey, sinkNodeKey)` Boolean hasChanged
* `dag.toposort()` Boolean - reorders all nodes, edges and datacolunms

Data structure

* `dag.addNodeData(name, getter)` nodeData {has, add, get, delete}
* `dag.delNodeData(name, getter)` nodeData {has, add, get, delete}
* `dag.addEdgeData(name, getter)` edgeData {has, add, get, delete}
* `dag.delEdgeData(name, getter)` edgeData {has, add, get, delete}

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
