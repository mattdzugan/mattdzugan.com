var width = 730,
    height = 300,
    speed = 5e-3,
    start = Date.now();

width = document.getElementById("globeviz").offsetWidth;

var sphere = {type: "Sphere"};

var projection = d3.geo.orthographic()
    .scale(height / 2.1)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(.5);
//*
projection = d3.geo.satellite()
    .distance(3.5)
    .scale(600)
    .rotate([76.00, -34.50, 32.12])
    .center([0, 0])
    .translate([width / 2, height / 2])
    .tilt(0)
    .clipAngle(Math.acos(1 / 3.5) * 180 / Math.PI - 1e-6)
    .precision(.1);
//*/
var graticule = d3.geo.graticule();

var canvas = d3.select("#globeviz").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection)
    .context(context);

d3.json("../data/world.json", function(error, topo) {
  var land = topojson.feature(topo, topo.objects.land),
      borders = topojson.mesh(topo, topo.objects.countries, function(a, b) { return a !== b; }),
      grid = graticule();

  d3.timer(function() {
    projection.rotate([speed * (Date.now() - start), 15*Math.sin(speed/40 * (Date.now() - start))]);
    var distnew = 3+Math.cos(speed/30 * (Date.now() - start));
    projection.distance(distnew);
    projection.clipAngle(Math.acos(1 / distnew) * 180 / Math.PI - 1e-6)

    context.clearRect(0, 0, width, height);

    context.beginPath();
    path(sphere);
    context.lineWidth = 3;
    context.strokeStyle = "#000";
    //context.stroke();

    context.beginPath();
    path(sphere);
    context.fillStyle = "#3b5998";
    context.fill();

    context.beginPath();
    path(land);
    context.fillStyle = "#fff";
    context.fill();
    context.lineWidth = 1.0;
    context.strokeStyle = "#31456e";
    context.stroke();

    context.beginPath();
    path(borders);
    context.lineWidth = .5;
    context.strokeStyle = "#31456e";
    context.stroke();

    context.beginPath();
    path(grid);
    context.lineWidth = .5;
    context.strokeStyle = "rgba(255,255,255,0.5)";
    context.stroke();
  });
});

d3.select(self.frameElement).style("height", height + "px");