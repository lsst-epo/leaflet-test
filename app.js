// size of CFHTLS image in deg

var fov = 16384 * 5.166e-5;  // degrees
var Rearth = 6378137;  // meters
var pixAngularScale0 = 512 * 180 / (3.14159 * 2 * Rearth); // zoom 0
var resolution0 = fov/pixAngularScale0; // zoom 0
var projCenterLat = -17.17710;
var projCenterLong = 334.42908;
var projString = '+proj=gnom +lat_0=' + projCenterLat + ' +lon_0=' + projCenterLong +' +x_0=0 +y_0=0';

// ra, dec are for the upper left corner of image
var xform = new L.Transformation(-1, -17.17710, -1, 334.42908);

var crs = new L.Proj.CRS('EPSG:', projString,
	{
		resolutions: [
		    resolution0, resolution0/2, resolution0/4, resolution0/8,
		    resolution0/16, resolution0/32, resolution0/64
		],
                transformation: xform
	});

var map = L.map('map', {
    crs: crs
}).setView([-17.73-0.5*fov, 333.87+0.5*fov], 0);

L.tileLayer('./img/{z}/foo_{x}_{y}.jpg', {
    maxZoom: 7,
    id: 'epo-test1',
    noWrap: true
}).addTo(map);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString() + " " + e.layerPoint.toString())
        .openOn(map);
}

map.on('click', onMapClick);
