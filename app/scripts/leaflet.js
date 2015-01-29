'use strict';

// geojson usage based on
// http://leafletjs.com/examples/geojson.html

function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

// css to draw a 10 (units?) circle with a border and transparent fill
var geojsonMarkerOptions = {
  radius: 10,
  fillColor: '#ff7800',
  color: '#ff7800',
  weight: 1,
  opacity: 1,
  fillOpacity: 0
};

var geojsonFeature = {
  'type': 'Feature',
  'properties': {
    'name': 'zero,zero',
    'popupContent': 'Center of the universe!',
  },
  'geometry': {
    'type': 'Point',
    'coordinates': [0, 0],
  }
};

var map = L.map('map').setView([1.0, 1.0], 0);

L.tileLayer('./images/tiles/{z}/foo_{x}_{y}.jpg', {
  maxZoom: 6,
  id: 'epo-test1',
  noWrap: true,
}).addTo(map);

L.geoJson(geojsonFeature, {
  onEachFeature: onEachFeature,
  // the pointToLayer callback overrides the default "pins" drawn for points
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
  },
}).addTo(map);
