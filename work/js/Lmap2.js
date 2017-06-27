// /*
var testData2 = {
  max: 10,
  data: [
       {lat: 33.180780, lng: -118.234998, count: 5},
       {lat: 33.138157, lng: -116.939315, count: 5},
       {lat: 33.098981, lng: -115.658707, count: 1},
       {lat: 33.063138, lng: -114.391682, count: 5},
       {lat: 34.394521, lng: -120.542492, count: 5},
       {lat: 34.343245, lng: -119.195821, count: 10},
       {lat: 34.295891, lng: -117.867803, count: 5},
       {lat: 34.252304, lng: -116.556622, count: 5},
       {lat: 34.212349, lng: -115.260610, count: 5},
       {lat: 34.175904, lng: -113.978229, count: 5},
       {lat: 35.592235, lng: -121.598194, count: 5},
       {lat: 35.535219, lng: -120.213071, count: 5},
       {lat: 35.482526, lng: -118.848912, count: 5},
       {lat: 35.433971, lng: -117.503655, count: 5},
       {lat: 35.389390, lng: -116.175420, count: 5},
       {lat: 35.348640, lng: -114.862482, count: 5},
       {lat: 36.823395, lng: -122.723688, count: 5},
       {lat: 36.759840, lng: -121.295137, count: 5},
       {lat: 36.701081, lng: -119.890310, count: 5},
       {lat: 36.646893, lng: -118.506837, count: 5},
       {lat: 36.597079, lng: -117.142572, count: 1},
       {lat: 36.551466, lng: -115.795560, count: 5},
       {lat: 38.020788, lng: -122.452299, count: 5},
       {lat: 37.955081, lng: -121.001348, count: 1},
       {lat: 37.894460, lng: -119.574699, count: 5},
       {lat: 37.838683, lng: -118.169873, count: 5},
       {lat: 39.322434, lng: -123.697343, count: 5},
       {lat: 39.248696, lng: -122.193586, count: 5},
       {lat: 39.180663, lng: -120.717736, count: 5},
       {lat: 39.118037, lng: -119.266878, count: 5},
       {lat: 40.586922, lng: -123.481559, count: 5},
       {lat: 40.510261, lng: -121.949058, count: 5},
       {lat: 40.439690, lng: -120.445462, count: 5},
       {lat: 41.889013, lng: -123.285340, count: 1},
       {lat: 41.809122, lng: -121.720627, count: 5},
       {lat: 41.735759, lng: -120.186011, count: 5},
       {lat: 43.324020, lng: -124.748245, count: 5},
       {lat: 43.233042, lng: -123.111708, count: 5},
       {lat: 43.149546, lng: -121.510736, count: 5},
       {lat: 43.073079, lng: -119.941294, count: 5},
       {lat: 44.624150, lng: -122.964553, count: 5},
       {lat: 44.536585, lng: -121.322543, count: 1},
       {lat: 44.456628, lng: -119.713795, count: 5}
  ]

};

var baseLayer2 = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
     attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
     id: 'examples.map-20v6611k'
});
         


var cfg2 = {
  "radius": 1.1,
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
  backgroundColor: 'rgba(177,177,177,.0)',
  gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    '0.0': '#111',
    '0.15': '#333',
    '0.5': '#eee',
    '0.85': '#4FC1E9',
    '1.0': '#4FC1E9'
  },
};


var heatmapLayer2 = new HeatmapOverlay(cfg2);

var map2 = new L.Map('Lmap2', {
  center: new L.LatLng(38, -117),
  zoom: 5,
  layers: [baseLayer2, heatmapLayer2]
});


heatmapLayer2.setData(testData2);
//*/