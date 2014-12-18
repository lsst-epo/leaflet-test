var map = L.map('map').setView([1.0, 1.0], 0);

L.tileLayer('./img/{z}/foo_{x}_{y}.jpg', {
    maxZoom: 6,
    id: 'epo-test1',
    noWrap: true
}).addTo(map);
