app = {
    distances: []
};
function init(){
	app.map = new OpenLayers.Map('map');
	app.map.addLayer(new OpenLayers.Layer.OSM("Open Street Map"));

	app.pathLayer = new OpenLayers.Layer.Vector("Path Layer");
	app.path = new OpenLayers.Geometry.LinearRing([]);
	app.pathLayer.addFeatures([new OpenLayers.Feature.Vector(app.path, {}, {fillOpacity:0})]);
	app.map.addLayer(app.pathLayer);

	app.drawingLayer = new OpenLayers.Layer.Vector("Drawing Layer");
	app.map.addLayer(app.drawingLayer);

    app.addVertex = function(vertexA){
        var vertices = app.path.getVertices();
        var z = [];
        vertices.forEach(function(vertexB, b){
            var dist = vertexA.distanceTo(vertexB);
            app.distances[b].push(dist);
            z.push(dist);
        });
        z.push(0);
        app.distances.push(z);
        app.path.addComponent(vertexA);
		app.pathLayer.redraw();
    };

	app.recalcRoute = function(){
        var vertices = app.path.getVertices();
        vertices.forEach(function(vertexA,a){app.distances[a]=[];});
        var max = 0;
        vertices.every(function(vertexA,a){
            vertices.every(function(vertexB, b){
                if(b==a){
                    app.distances[a].push(0);
                    return false;
                }
                var dist = vertexA.distanceTo(vertexB);
                app.distances[a].push(dist);
                app.distances[b].push(dist);
                if(dist > max){ max = dist; }
                return true;
            });
            return true;
        });
        
		app.pathLayer.redraw();
	};

    app.removeVertex = function(vertexA){
        var vertices = app.path.getVertices();
        var remove = 0;
        vertices.every(function(vertexB, b){
            if(_.isEqual(vertexA, vertexB)){
                remove = b;
                app.distances.splice(remove,1);
        		return false;
            }
        });
        vertices.every(function(vertexB, b){
            app.distances[b].splice(remove,1);
        });
        app.path.removeComponent(vertexA);
		app.pathLayer.redraw();
    };
    
	app.drawingLayer.events.register("featureremoved", {}, function(evt){
		app.removeVertex(evt.feature.geometry);
	});

	var point = new OpenLayers.Control.DrawFeature(app.drawingLayer, OpenLayers.Handler.Point);
	point.events.register("featureadded", {}, function(evt){
		app.addVertex(evt.feature.geometry);
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
};
