"use strict";
var Vertex = /** @class */ (function () {
    function Vertex(value) {
        this.value = value;
        this.adjacent = new Map();
    }
    return Vertex;
}());
var WeightedGraph = /** @class */ (function () {
    function WeightedGraph() {
        this.vertices_map = new Map();
        this.size = 0;
    }
    WeightedGraph.prototype.addVertex = function (value) {
        this.size += 1;
        var vertex_to_add = new Vertex(value);
        this.vertices_map.set(value, vertex_to_add);
        return vertex_to_add;
    };
    WeightedGraph.prototype.getVertex = function (value) {
        if (this.vertices_map.has(value)) {
            return this.vertices_map.get(value);
        }
        return;
    };
    WeightedGraph.prototype.addEdge = function (a, b, weight) {
        if (!this.vertices_map.has(a)) {
            this.addVertex(a);
        }
        if (!this.vertices_map.has(b)) {
            this.addVertex(b);
        }
        this.vertices_map.get(a).adjacent.set(b, weight);
        this.vertices_map.get(b).adjacent.set(a, weight);
    };
    WeightedGraph.prototype.getAllVertices = function () {
        var result_list = [];
        this.vertices_map.forEach(function (value, key, map) {
            result_list.push(key);
        });
        return result_list;
    };
    return WeightedGraph;
}());
module.exports.WeightedGraph = WeightedGraph;
