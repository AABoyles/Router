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

  app.drawingLayer = new OpenLayers.Layer.Vector("Drawing Layer");
  app.map.addLayer(app.drawingLayer);

  app.path = new OpenLayers.Geometry.LineString([]);
  app.pathLayer = new OpenLayers.Layer.Vector("Path Layer");
  app.pathLayer.addFeatures([new OpenLayers.Feature.Vector(app.path, {}, {
    fillOpacity: 0
  })]);
  app.map.addLayer(app.pathLayer);

  app.recalcRoute = function() {
    var vertices = _.pluck(app.drawingLayer.getFeaturesByAttribute(), "geometry");
    app.path.removeComponents(vertices);
    for(var i = 0; i < vertices.length; i++){
      var activeVertices = app.path.components;
      var minInsertDist = Number.MAX_VALUE;
      var insertIndex = 0;
      for(var j = 0; j < activeVertices.length-1; j++){
        var before = vertices[j], after = vertices[j+1];
        if(before == vertices[i] || after == vertices[i]) continue;
        var insertDist = before.distanceTo(vertices[i]) + after.distanceTo(vertices[i]) - before.distanceTo(after);
        if(insertDist < minInsertDist){
          minInsertDist = insertDist;
          insertIndex = i+1;
        }
      }
      app.path.addComponent(vertices[i], insertIndex);
    }
    app.pathLayer.redraw();
  };

  app.drawingLayer.events.register("featureremoved", {}, function(evt) {
    app.path.removeComponent(evt.feature.geometry);
    app.recalcRoute();
  });

  var point = new OpenLayers.Control.DrawFeature(app.drawingLayer, OpenLayers.Handler.Point);
  point.events.register("featureadded", {}, function(evt) {
    app.path.addComponent(evt.feature.geometry);
    app.recalcRoute();
  });

  var drag = new OpenLayers.Control.DragFeature(app.drawingLayer, {
    onDrag: function(feature) {
      app.recalcRoute();
    },
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