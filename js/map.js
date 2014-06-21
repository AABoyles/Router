app={
  map: {},
  path: {},
  pathLayer: {},
  drawingLayer: {},
  recalcRoute: function(){}
};

function init(){
  app.map = new OpenLayers.Map("map");
  app.map.addLayer(new OpenLayers.Layer.OSM("Open Street Map"));

  app.drawingLayer = new OpenLayers.Layer.Vector("Points");
  app.map.addLayer(app.drawingLayer);

  app.path = new OpenLayers.Geometry.LinearRing();
  app.pathLayer = new OpenLayers.Layer.Vector("Path");
  app.pathLayer.addFeatures([new OpenLayers.Feature.Vector(app.path, {}, {
    fillOpacity: 0
  })]);
  app.map.addLayer(app.pathLayer);

  app.recalcRoute = function() {
    var vertices = _.pluck(app.drawingLayer.getFeaturesByAttribute(), "geometry");
    app.path.removeComponents(vertices);
    vertices.forEach(function(vertex){
      var activeVertices = app.path.components;
      if(_.contains(activeVertices, vertex)) return;
      var minInsertDist = Number.MAX_VALUE;
      var insertIndex = activeVertices.length;
      for(var j = 1; j < activeVertices.length; j++){
        var before = activeVertices[j-1], after = activeVertices[j];
        if(vertex == before || vertex == after) continue;
        var insertDist = before.distanceTo(vertex) + vertex.distanceTo(after) - before.distanceTo(after);
        if(insertDist < minInsertDist){
          minInsertDist = insertDist;
          insertIndex = j;
        }
      }
      app.path.addComponent(vertex, insertIndex);
    });
    app.pathLayer.redraw();
  };

  var point = new OpenLayers.Control.DrawFeature(app.drawingLayer, OpenLayers.Handler.Point);
  point.events.register("featureadded", {}, function(evt) {
    app.path.addComponent(evt.feature.geometry);
    app.recalcRoute();
  });

  var drag = new OpenLayers.Control.DragFeature(app.drawingLayer, {
    onDrag: function(feature) {
      app.recalcRoute();
    }
  });

  app.map.addControls([
    point,
    drag,
    new OpenLayers.Control.LayerSwitcher(),
    new OpenLayers.Control.MousePosition({
      displayProjection: "EPSG:4326"
    })
  ]);

  point.activate();
  drag.activate();

  app.map.zoomToMaxExtent();
};