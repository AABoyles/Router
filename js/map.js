app = {
    map: {},
    pointLayer: {},
    nnPath: {},
    nnPathLayer: {},
    nePath: {},
    nePathLayer: {},
    calcRoutes: function() {},
    nnCalcRoute: function() {},
    neCalcRoute: function() {},
};
$(function() {
    app.pointLayer = new OpenLayers.Layer.Vector("Points");
    app.nnPath = new OpenLayers.Geometry.LinearRing();
    app.nnPathLayer = new OpenLayers.Layer.Vector("Nearest-Neighbor");
    app.nnPathLayer.addFeatures([new OpenLayers.Feature.Vector(app.nnPath, {}, {
        fillOpacity: 0,
        strokeColor: "#ff0000"
    })]);
    app.nePath = new OpenLayers.Geometry.LinearRing();
    app.nePathLayer = new OpenLayers.Layer.Vector("Nearest-Edge");
    app.nePathLayer.addFeatures([new OpenLayers.Feature.Vector(app.nePath, {}, {
        fillOpacity: 0,
        strokeColor: "#0000ff"
    })]);
    app.map = new OpenLayers.Map({
        div: "map",
        layers: [new OpenLayers.Layer.OSM("Open Street Map"), app.pointLayer, app.nnPathLayer, app.nePathLayer],
        center: [-10973646.505861, 4841142.9262657],
        zoom: 5
    });
    app.neCalcRoute = function() {
        var vertices = _.pluck(app.pointLayer.getFeaturesByAttribute(), "geometry");
        app.nePath.removeComponents(vertices);
        vertices.forEach(function(vertex) {
            var activeVertices = app.nePath.components;
            if(_.contains(activeVertices, vertex)) return;
            var minInsertDist = Number.MAX_VALUE;
            var insertIndex = activeVertices.length;
            for(var j = 1; j < activeVertices.length; j++) {
                var before = activeVertices[j - 1],
                    after = activeVertices[j];
                if(vertex == before || vertex == after) continue;
                var insertDist = before.distanceTo(vertex) + vertex.distanceTo(after) - before.distanceTo(after);
                if(insertDist < minInsertDist) {
                    minInsertDist = insertDist;
                    insertIndex = j;
                }
            }
            app.nePath.addComponent(vertex, insertIndex);
        });
        app.nePathLayer.redraw();
        var km = app.nePath.getLength()/1000 + "";
        $("#nearest-edge-distance").text(km.substring(0, km.indexOf(".")) + " km");
    };
    app.nnCalcRoute = function(n) {
        n = typeof n === 'number' ? n : 0;
        var vertices = _.pluck(app.pointLayer.getFeaturesByAttribute(), "geometry");
        app.nnPath.removeComponents(vertices);
        var current = vertices[n];
        while(true) {
            var unvisitedVertices = _.difference(vertices, app.nnPath.components);
            if(unvisitedVertices.length == 0) {
                break;
            }
            var minInsertDist = Number.MAX_VALUE;
            unvisitedVertices.forEach(function(next) {
                var insertDist = current.distanceTo(next);
                if(insertDist < minInsertDist) {
                    nextNode = next;
                    minInsertDist = insertDist;
                }
            });
            app.nnPath.addComponent(nextNode);
            current = nextNode;
        }
        app.nnPathLayer.redraw();
        var km = app.nnPath.getLength()/1000 + "";
        $("#nearest-neighbor-distance").text(km.substring(0, km.indexOf(".")) + " km");
    };
    app.recalcRoute = function() {
        if($("#nearest-edge")[0].checked) {
            app.neCalcRoute();
        }
        if($("#nearest-neighbor")[0].checked) {
            app.nnCalcRoute();
        }
    };
    var point = new OpenLayers.Control.DrawFeature(app.pointLayer, OpenLayers.Handler.Point, {
        autoActivate: true
    });
    point.events.register("featureadded", {}, app.recalcRoute);
    app.map.addControls([
        point,
        new OpenLayers.Control.DragFeature(app.pointLayer, {
            onDrag: function() {
                app.recalcRoute();
            },
            autoActivate: true
        }),
        new OpenLayers.Control.MousePosition({
            displayProjection: "EPSG:4326",
            div: $("#coords")[0]
        })
    ]);
    $('#nearest-neighbor').button().click(function() {
        if(this.checked) {
            app.nnCalcRoute();
        } else {
            $("#nearest-neighbor-distance").text("");
        }
        app.nnPathLayer.setVisibility(this.checked);
    });
    $('#nearest-edge').button().click(function() {
        if(this.checked) {
            app.neCalcRoute();
        } else {
            $("#nearest-edge-distance").text("");
        }
        app.nePathLayer.setVisibility(this.checked);
    });
    $('#wtf').button();
    $("#github").button();
});