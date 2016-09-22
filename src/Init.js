var canvas = document.getElementById('myCanvas');
var c = canvas.getContext('2d');

var cSizeX;
var cSizeY;
var cCenterX;
var cCenterY;

var layer1Width = 0.3;
var layer2Width = 0.3;

var distanceInDirection = function(point1, direction, point2) {
  if (point1 == null || point2 == null)
    return null;

  var distance = Math.pow((Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)), 0.5);
  var negate = 1;
  if (direction.gradientInfinite()) {
    negate = ((direction.p2.y - direction.p1.y) * (point2.y - point1.y)) < 1 ? -1 : 1;
  }
  else if (withinEpsilon(direction.gradient(), 0)) {
    negate = ((direction.p2.x - direction.p1.x) * (point2.x - point1.x)) < 0 ? -1 : 1;
  }
  else {
    negate = ((point2.x - point1.x) / direction.gradient()) < 0 ? -1 : 1;
  }
   
  return negate * distance;        
}

var getCanvasIntersection = function(point, theta) {
  theta %= 2 * Math.PI;
  var line = Line.fromAngle(point, theta);

  var top = new Line(new Point(0, 0), new Point(1, 0));
  var right = new Line(new Point(cSizeX, 0), new Point(cSizeX, 1));
  var bottom = new Line(new Point(0, cSizeY), new Point(1, cSizeY));
  var left = new Line(new Point(0, 0), new Point(0, 1));

  var topPoint = line.intersection(top);
  var topIntersection = {
    p: topPoint,
    d: distanceInDirection(point, line, topPoint)
  }

  var rightPoint = line.intersection(right);
  var rightIntersection = {
    p: rightPoint,
    d: distanceInDirection(point, line, rightPoint)
  }

  var bottomPoint = line.intersection(bottom);
  var bottomIntersection = {
    p: bottomPoint,
    d: distanceInDirection(point, line, bottomPoint)
  }

  var leftPoint = line.intersection(left);
  var leftIntersection = {
    p: leftPoint,
    d: distanceInDirection(point, line, leftPoint)
  }

  var intersections = [topIntersection, rightIntersection, bottomIntersection, leftIntersection];
  for (var i = intersections.length - 1; i >= 0; i--) {
    if (intersections[i].d == null || intersections[i].d < 0) {
      intersections.splice(i, 1);
    }
  }
  intersections.sort(function(a, b) {
    return a.d - b.d;
  });

  return intersections[0].p;
}

var drawCircle = function(x, y, radius, colour = "#e78f8e") {
  c.fillStyle = colour;
  c.beginPath();
  c.arc(x, y, radius, 0, 2*Math.PI, false);
  c.fill();
}

var drawLayer2 = function(offset, angle) {
  var intersection1 = getCanvasIntersection(new Point(cCenterX, cCenterY), offset);
  var intersection2 = getCanvasIntersection(new Point(cCenterX, cCenterY), offset + angle);

  c.beginPath();
  c.lineWidth = 10;
  c.moveTo(cCenterX, cCenterY);
  c.lineTo(intersection1.x, intersection1.y);
  c.lineTo(intersection2.x, intersection2.y);
  c.stroke();
}

var draw = function() {
  cSizeX = window.innerWidth;
  c.canvas.width = cSizeX;
  cSizeY = window.innerHeight;
  c.canvas.height = cSizeY;

  cCenterX = cSizeX / 2;
  cCenterY = cSizeY / 2;

  c.fillStyle = "#3bb300";
  c.fillRect(0, 0, c.canvas.width, c.canvas.height);

  c.fillStyle = "#e78f8e";
  c.fillRect(100, 100, 300, 300);

  drawCircle(c.canvas.width / 2, c.canvas.height / 2, c.canvas.height * layer1Width / 2);
  drawLayer2(0, Math.PI / 2);
  drawLayer2(Math.PI / 2, Math.PI / 2);
}

setInterval(function() {
  draw();
}, 100);