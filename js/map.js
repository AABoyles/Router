app = {
    interactions: {},
    map: {},
    path: {},
    pathLayer: {},
    drawingLayer: {},
    recalcRoute: function() {}
};

function init() {
    var raster = new ol.layer.Tile({
        source: new ol.source.MapQuest({
            layer: 'sat'
        })
    });
    var map = new ol.Map({
        layers: [raster],
        target: 'map',
        view: new ol.View2D({
            center: [-11000000, 4600000],
            zoom: 4
        })
    });
    var featureOverlay = new ol.FeatureOverlay({
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    featureOverlay.setMap(map);
    var modify = new ol.interaction.Modify({
        features: featureOverlay.getFeatures(),
        deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
        }
    });
    map.addInteraction(modify);
    var draw = new ol.interaction.Draw({
        features: featureOverlay.getFeatures(),
        type: "Polygon"
    });
    map.addInteraction(draw);
};