app = {
    map: {},
    featureOverlay: {},
    recalcRoute: function() {}
};

function init() {
    app.map = new ol.Map({
        layers: [new ol.layer.Tile({
			source: new ol.source.OSM()
		})],
        target: 'map',
        view: new ol.View2D({
            center: [-11000000, 4600000],
            zoom: 4
        })
    });
    app.featureOverlay = new ol.FeatureOverlay({
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0000ff',
                width: 2
            })
        })
    });
    app.featureOverlay.setMap(app.map);
    app.map.addInteraction(new ol.interaction.Modify({
        features: app.featureOverlay.getFeatures(),
        deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
        }
    }));
    app.map.addInteraction(new ol.interaction.Draw({
        features: app.featureOverlay.getFeatures(),
        type: "Polygon"
    }));
    app.recalcRoute = function(){
        
    };
}
