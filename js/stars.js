Globals =   {  "CanvasWidth": 200,
               "CanvasHeight": 100};

Globals.CanvasWidth = Number(d3.select("#headercanvas").style("width").split("px")[0]);
Globals.CanvasHeight = Number(d3.select("#headercanvas").style("height").split("px")[0]);

Globals.width = Globals.CanvasWidth;
Globals.height = Globals.CanvasHeight;
Globals.velocity = .004;
Globals.scale = Globals.width * 0.45;
Globals.time = Date.now();
Globals.LambdaSpan = (Globals.width)/30; // tuned for 60deg at widescreen
Globals.PhiSpan = (Globals.height)/10; // tuned for 50deg at widescreen
Globals.ind2plot = -1;
Globals.mouseDownBuffer = 2;

var position = d3.scale.ordinal()
    .domain([0, 1])
    .rangePoints([0, Globals.width * .87], .8);

var radius = d3.scale.linear()
    .domain([-1, 6])
    .range([2.0, 0.3]);
var color = d3.scale.linear()
    .domain([-1,6])
    .range(["rgba(255,255,255,0.7)", "rgba(255,255,255,0.3)"])



var Lambda = d3.scale.linear()
    .domain([0, Globals.width])
    .range([-Globals.LambdaSpan, Globals.LambdaSpan]);
    //.range([-180, 180]);

var Phi = d3.scale.linear()
    .domain([0, Globals.height])
    .range([-Globals.PhiSpan, Globals.PhiSpan]);
    //.range([90, -90]);

var projection = d3.geo.gnomonic()
    .scale(Globals.scale/1.75)
    .clipAngle(100)
    //.clipExtent([[0,0],[Globals.width/2,Globals.height/2]])
    .rotate([0, -35])
    .translate([Globals.width / 2, Globals.height / 2])
    .precision(0.3);

var sphere = {type: "Sphere"};
//var graticule = d3.geo.graticule()();

var canvas = d3.select("#headercanvas")
    .attr("width", Globals.width)
    .attr("height", Globals.height);

var context = canvas.node().getContext("2d");

context.strokeStyle = "#aaa";

var path = d3.geo.path()
    .context(context);
//var gpath = d3.geoPath().context(context);
var starsLocs = d3.select('canvas');




d3.csv("./js/stars.csv", type, function(error, stars) {
  d3.json("./js/constellations.lines.json", function(errorj, constellations) {
    d3.json("./js/constellations.json", function(errorc, constellationNodes) {
      if (error) throw error;
      if (errorj) throw error;
      if (errorc) throw error;

      //myStars = stars;
      var dataBinding = starsLocs.selectAll("points.arc")
        .data(stars)
      		.enter()
          .append("points")
          .classed("arc", true)
          .attr("id",function(d) {return ("star"+d.ID);})
          .attr("x", function(d) {return projection([d.lon,d.lat])[0]})
          .attr("y", function(d) {return projection([d.lon,d.lat])[1]})
          .attr("radius", function(d) {return radius(d.magnitude);})
          .attr("fillStyle", function(d) {return color(d.magnitude);});
          //.attr("fillStyle", "#ddd");

      d3.timer(function() {
        var dt = Date.now() - Globals.time;
        projection.rotate([Globals.velocity * dt, -70, -30]);
        starsLocs.selectAll("points.arc")
        .attr("x", function(d) {return projection([d.lon,d.lat])[0]})
        .attr("y", function(d) {return projection([d.lon,d.lat])[1]});
        renderStars();
        drawLines();
      });


      function drawLines(){

        // if mouse is in canvas
        canvas.on("mousemove",function(){
          var mycoords = d3.mouse(this);
          var mylonlat = projection.invert(mycoords);
          var myNodes = constellationNodes.features;
          var myDists = new Array(myNodes.length);
          for (var ii=0; ii<myNodes.length; ii++){
            var myNodeLonLat = myNodes[ii].geometry.coordinates;
            var myLatDif = Math.abs(mylonlat[1]-myNodeLonLat[1]);
            var myLonDif1 = Math.abs( (mylonlat[0]+myNodeLonLat[0]) %360.0);
            var myLonDif2 = Math.abs( (mylonlat[0]+myNodeLonLat[0]+360.0) %360.0);
            var myLonDif3 = Math.abs( (mylonlat[0]+myNodeLonLat[0]-360.0) %360.0);
            var myLonDif = Math.min(myLonDif1,myLonDif2,myLonDif3);
            myLonDif = myLonDif*Math.cos(3.14159/180*mylonlat[1]);
            myDists[ii] = myLonDif*myLonDif + myLatDif*myLatDif;
          }
          Globals.ind2plot = indexOfMin(myDists);

          //console.log()
          if (Globals.mouseDown==0){
            d3.select("#constellationLabelText").html(myNodes[Globals.ind2plot].properties.name);
          }
          //console.log(Globals.ind2plot);
          //console.log(mylonlat);

        });
        if (Globals.mouseDown>0){
          d3.select("#constellationLabelText").html("These rings aren't simply concentric circles<br>Stars south of the ecliptic appear to diverge from Polaris<br>(when viewed in a local 2D frame like this)");
        }


        // determine const ID

        var features = constellations.features;
        features.forEach(function(feature,fi){
          if (fi==Globals.ind2plot){
            //*
            var lineStrings = feature.geometry.coordinates;
            lineStrings.forEach(function(lineString){
              context.beginPath();

              lineString.forEach(function(d,i){
                var mylat = +d[1];
                var mylon = -d[0];
                var pp = projection([mylon,mylat]);
                //console.log(pp);
                if (i==0){
                  context.moveTo(pp[0], pp[1]);
                }else{
                  context.lineTo(pp[0], pp[1]);
                }
              });
              //path(feature);
              context.strokeStyle = "rgba(255,255,255,0.4)";
              context.lineWidth = 0.5;
              if (Globals.mouseDown==0){
                context.stroke();
              }
              //context.stroke();
            });
            //*/



          }
        });



      }
      function renderStars() {
        //var ImageData_Old = context.getImageData(0,0,width,height);


        if(Globals.mouseDown){
          Globals.mouseDownBuffer -= 1;
          if (Globals.mouseDownBuffer>0){
            context.clearRect(0, 0, Globals.width, Globals.height);
          }
        }else{
          context.clearRect(0, 0, Globals.width, Globals.height);
        }




        /*
        for(var i=0;i<height;i++)
          for(var j=0;j<width;j++)
             ImageData.data[((i*(width*4)) + (j*4) + 3)] = 3;//opacity = 0.5 [0-255]
        */




        //context.putImageData(ImageData,0,0);//put image data back

        //context.fillStyle="red";
        //context.fill();
        //context.closePath();

        var translate = projection.translate();
        //context.save();
        //context.translate(translate[0], translate[1]);
        //context.rotate(Math.PI / 2);
        //context.translate(-translate[0], -translate[1]);

        path.projection(projection);

        context.beginPath();
        //path(sphere);
        //context.stroke();

        /*
        context.beginPath();
        path(graticule);
        context.strokeStyle = "#061616";
        context.lineWidth = 0.5;
        context.stroke();
        //*/



        var elements = starsLocs.selectAll("points.arc");
      	elements.each(function(d) {
          var node = d3.select(this);
          context.beginPath();
      		context.arc(node.attr("x"), node.attr("y"), node.attr("radius"), 0, 2 * Math.PI);
      		context.fillStyle = node.attr("fillStyle");
          context.fill();
          //context.closePath();
      	});


        // UMi TEST
        /*
        context.beginPath();
        context.moveTo( projection([-123.9853,77.7945])[0],
                        projection([-123.9853,77.7945])[1]);
        context.lineTo( projection([-115.6238,75.7553])[0],
                        projection([-115.6238,75.7553])[1]);
        context.lineTo( projection([-129.8178,71.8340])[0],
                        projection([-129.8178,71.8340])[1]);
        context.lineTo( projection([-137.3236,74.1555])[0],
                        projection([-137.3236,74.1555])[1]);
        context.strokeStyle = "rgba(255,150,50,0.75)";
        context.lineWidth = 3.0;
        context.stroke();



        // URSA MINOR
        context.beginPath();

        var A = d3.select("#star424");
        context.moveTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star6789");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star6322");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star5903");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star6116");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star5735");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star5563");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star5903");
        context.lineTo(A.attr("x"), A.attr("y"));

        context.strokeStyle = "rgba(255,255,255,0.2)";
        context.lineWidth = 0.5;
        context.stroke();



        // URSA MAJOR
        context.beginPath();

        var A = d3.select("#star5191");
        context.moveTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star5062");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star4905");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star4660");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star4554");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star4295");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star4301");
        context.lineTo(A.attr("x"), A.attr("y"));

        var A = d3.select("#star4660");
        context.lineTo(A.attr("x"), A.attr("y"));

        context.strokeStyle = "rgba(255,255,255,0.2)";
        context.lineWidth = 0.5;
        context.stroke();
        */



        /*
        var ImageData_New = context.getImageData(0,0,width,height);
        var ImageData_Both = ImageData_New;
        var pp = 0.95;
        var qq = 1-pp;
        for(var i=0;i<height;i++){
          for(var j=0;j<width;j++){
            ImageData_Both.data[((i*(width*4)) + (j*4) + 0)] = Math.round((pp*ImageData_Old.data[((i*(width*4)) + (j*4) + 0)])+(qq*ImageData_New.data[((i*(width*4)) + (j*4) + 0)]));
            ImageData_Both.data[((i*(width*4)) + (j*4) + 1)] = Math.round((pp*ImageData_Old.data[((i*(width*4)) + (j*4) + 1)])+(qq*ImageData_New.data[((i*(width*4)) + (j*4) + 1)]));
            ImageData_Both.data[((i*(width*4)) + (j*4) + 2)] = Math.round((pp*ImageData_Old.data[((i*(width*4)) + (j*4) + 2)])+(qq*ImageData_New.data[((i*(width*4)) + (j*4) + 2)]));
            ImageData_Both.data[((i*(width*4)) + (j*4) + 3)] = Math.round((pp*ImageData_Old.data[((i*(width*4)) + (j*4) + 3)])+(qq*ImageData_New.data[((i*(width*4)) + (j*4) + 3)]));
          }
        }

       context.clearRect(0, 0, width, height);
       context.putImageData(ImageData_Both,0,0);//put image data back


       var elements = starsLocs.selectAll("points.arc");
       elements.each(function(d) {
         var node = d3.select(this);
         context.beginPath();
         context.arc(node.attr("x"), node.attr("y"), node.attr("radius"), 0, 2 * Math.PI);
         context.fillStyle = node.attr("fillStyle");
         context.fill();
         context.closePath();
       });
       */



       //context.restore();

      }







    });
  });
});
d3.select(self.frameElement).style("height", Globals.height + "px");


function type(d) {
  d.lon = -(+d.RA_hour + d.RA_min / 60 + d.RA_sec / 3600) * 15;
  d.lat = (+d.dec_deg + d.dec_min / 60 + d.dec_sec / 3600);
  d.magnitude = +d.magnitude;
  d.ID = +d.ID;
  return d;
}

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var min = arr[0];
    var minIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }
    return minIndex;
}




Globals.mouseDown = 0;
document.body.onkeydown = function(e) {
  if(e.keyCode == 90){
    Globals.mouseDown = 1;
  }

}
document.body.onkeyup = function(e) {
  if(e.keyCode == 90){
    Globals.mouseDown = 0;
    Globals.mouseDownBuffer = 2;
  }
}




// Page Resize Stuff
window.onresize = function(event) {
  Globals.CanvasWidth = Number(d3.select("#headercanvas").style("width").split("px")[0]);
  Globals.CanvasHeight = Number(d3.select("#headercanvas").style("height").split("px")[0]);
  Globals.width = Globals.CanvasWidth;
  Globals.height = Globals.CanvasHeight;
  //Globals.scale = Globals.width * 0.45;
  Globals.LambdaSpan = (Globals.width)/30; // tuned for 60deg at widescreen
  Globals.PhiSpan = (Globals.height)/10; // tuned for 50deg at widescreen


  position.rangePoints([0, Globals.width * .87], .8);
  Lambda.domain([0, Globals.width]).range([-Globals.LambdaSpan, Globals.LambdaSpan]);
  Phi.domain([0, Globals.height]).range([-Globals.PhiSpan, Globals.PhiSpan]);
  projection.scale(Globals.scale/1.75)
            .translate([Globals.width / 2, Globals.height / 2]);
  canvas.attr("width", Globals.width)
        .attr("height", Globals.height);
}
