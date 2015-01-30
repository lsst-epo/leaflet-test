'use strict';

var map = L.map('map').setView([1.0, 1.0], 0);

L.tileLayer('./images/tiles/{z}/foo_{x}_{y}.jpg', {
  maxZoom: 6,
  id: 'epo-test1',
  noWrap: true,
}).addTo(map);

var geogroup = L.layerGroup().addTo(map);

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

// based on this example:
// http://www.html5rocks.com/en/tutorials/file/dndfiles/
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  var reader = new FileReader();

  reader.onload = function(e) {
    // Print the contents of the file
    var text = e.target.result;

    var geoj = JSON.parse(text);
    console.log(geoj);

    geogroup.addLayer(L.geoJson(geoj, {
        onEachFeature: onEachFeature,
        // the pointToLayer callback overrides the default "pins" drawn for points
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
      })
    );
  };

  // files is a FileList of File objects. List some properties.
  for (var i = 0, f; f = files[i]; i++) {
    reader.readAsText(f, 'UTF-8');
  }
}

function clearGeo() {
  geogroup.clearLayers();
}

$(document).ready(function() {
  $('.geo-wrapper .btn-file :file').bind('change', handleFileSelect);
  //$('.file-wrapper button[type=button]').bind('click', clearGeo);
  $('.geo-wrapper .btn-clear').bind('click', clearGeo);
});
