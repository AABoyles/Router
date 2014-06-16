app = {};
$(function() {
	app.map = new OpenLayers.Map('map');
	app.map.addLayer(new OpenLayers.Layer.OSM("Open Street Map"));

	app.pathLayer = new OpenLayers.Layer.Vector("Path Layer");
	app.path = new OpenLayers.Geometry.LinearRing([]);
	app.pathLayer.addFeatures([new OpenLayers.Feature.Vector(app.path, {}, {fillColor: "#996600", fillOpacity: .3})]);
	app.map.addLayer(app.pathLayer);

	app.drawingLayer = new OpenLayers.Layer.Vector("Drawing Layer");
	app.map.addLayer(app.drawingLayer);

	app.recalcRoute = function(){
		app.pathLayer.redraw();
	};

	app.drawingLayer.events.register("featureremoved", {}, function(evt){
		app.path.removeComponent(evt.feature.geometry);
		app.recalcRoute();
	});

	var point = new OpenLayers.Control.DrawFeature(app.drawingLayer, OpenLayers.Handler.Point);
	point.events.register("featureadded", {}, function(evt){
		app.path.addComponent(evt.feature.geometry);
		app.recalcRoute();
	});

	var drag = new OpenLayers.Control.DragFeature(app.drawingLayer, {
		onDrag: function(feature){
			app.recalcRoute();
		},
	});

	app.map.addControls([
		point,
		drag,
		new OpenLayers.Control.LayerSwitcher(),
		new OpenLayers.Control.MousePosition({displayProjection:"EPSG:4326"})
	]);

	point.activate();
	drag.activate();

	app.map.zoomToMaxExtent();
});
