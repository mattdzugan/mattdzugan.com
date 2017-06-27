var testData = {
  max: 10,
  data: [
       {lat: 28.392005, lng: -99.405797, count: 3},
       {lat: 28.411305, lng: -95.154948, count: 4},
       {lat: 28.660616, lng: -81.946485, count: 7},
       {lat: 32.592980, lng: -115.247879, count: 8},
       {lat: 32.480952, lng: -110.598514, count: 4},
       {lat: 32.410009, lng: -106.067406, count: 5},
       {lat: 32.377693, lng: -101.600961, count: 2},
       {lat: 32.382938, lng: -97.151229, count: 9},
       {lat: 32.425914, lng: -92.671658, count: 8},
       {lat: 32.508054, lng: -88.113183, count: 3},
       {lat: 32.632264, lng: -83.419705, count: 6},
       {lat: 37.021940, lng: -118.797200, count: 4},
       {lat: 36.850788, lng: -113.724914, count: 3},
       {lat: 36.735128, lng: -108.838589, count: 2},
       {lat: 36.670054, lng: -104.063986, count: 5},
       {lat: 36.653016, lng: -99.338821, count: 7},
       {lat: 36.683371, lng: -94.605692, count: 5},
       {lat: 36.762273, lng: -89.806429, count: 3},
       {lat: 36.892867, lng: -84.876218, count: 8},
       {lat: 37.080867, lng: -79.735763, count: 6},
       {lat: 41.964113, lng: -123.330131, count: 3},
       {lat: 41.695763, lng: -117.597677, count: 9},
       {lat: 41.508159, lng: -112.178218, count: 2},
       {lat: 41.390688, lng: -106.953349, count: 3},
       {lat: 41.337498, lng: -101.832581, count: 6},
       {lat: 41.346117, lng: -96.738465, count: 5},
       {lat: 41.416939, lng: -91.596693, count: 7},
       {lat: 41.553302, lng: -86.327285, count: 5},
       {lat: 41.762200, lng: -80.833781, count: 4},
       {lat: 42.056030, lng: -74.985843, count: 4},
       {lat: 44.056030, lng: -70.985843, count: 6},
       {lat: 47.277838, lng: -122.844106, count: 3},
       {lat: 46.959345, lng: -116.526404, count: 5},
       {lat: 46.749358, lng: -110.581809, count: 3},
       {lat: 46.632868, lng: -104.850610, count: 6},
       {lat: 46.602554, lng: -99.211463, count: 4},
       {lat: 46.656615, lng: -93.557584, count: 8},
       {lat: 46.798293, lng: -87.779932, count: 7}
  ]

};

var baseLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
     attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
     id: 'examples.map-20v6611k'
});
         


var cfg = {
  "radius": 4,
  "minOpacity": .5,
  "maxOpacity": .8,
  "scaleRadius": true, 
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries 
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": false,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count',
  backgroundColor: 'rgba(177,177,177,.2)',
  gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    '0.0': '#111',
    '0.2': '#333',
    '0.35': '#3b5998',
    '0.55': '#3b5998',
    '0.7': '#eee',
    '1.0': '#eee'
  },
};


var heatmapLayer = new HeatmapOverlay(cfg);

var map = new L.Map('Lmap1', {
  center: new L.LatLng(40, -99),
  zoom: 4,
  layers: [baseLayer, heatmapLayer]
});


heatmapLayer.setData(testData);