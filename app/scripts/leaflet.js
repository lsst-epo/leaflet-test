'use strict';

// size of CFHTLS image in deg

var fov = 16384 * 5.166e-5;  // degrees
var Rearth = 6378137;  // meters
var pixAngularScale0 = 512 * 180 / (3.14159 * 2 * Rearth); // zoom 0
var resolution0 = fov/pixAngularScale0; // zoom 0
var projCenterLat = -17.17710;
var projCenterLong = 334.42908;
var projString = '+proj=gnom +lat_0=' + projCenterLat + ' +lon_0=' + projCenterLong +' +x_0=0 +y_0=0';

proj4.defs('urn:ogc:def:crs:d4', projString);

// ra, dec are for the upper left corner of image
var xform = new L.Transformation(-1, -17.17710, -1, 334.42908);

var crs = new L.Proj.CRS('EPSG:', projString, {
  resolutions: [
    resolution0, resolution0/2, resolution0/4, resolution0/8,
    resolution0/16, resolution0/32, resolution0/64
  ],
  transformation: xform
});

var map = L.map('map', {
  crs: crs
}).setView([-17.73-0.5*fov, 333.87+0.5*fov], 0);

L.tileLayer('./images/tiles/{z}/foo_{x}_{y}.jpg', {
  maxZoom: 6,
  id: 'epo-test1',
  noWrap: true,
}).addTo(map);

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent('You clicked the map at ' + e.latlng.toString() + ' ' + e.layerPoint.toString())
    .openOn(map);
}

map.on('click', onMapClick);

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

    geogroup.addLayer(L.Proj.geoJson(geoj, {
        onEachFeature: onEachFeature,
        // the pointToLayer callback overrides the default "pins" drawn for points
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
      })
    );
  };

  // files is a FileList of File objects. List some properties.
  for (var i = 0; i < files.length; i++) {
    reader.readAsText(files[i], 'UTF-8');
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
