function Line(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.m = null;
  this.c = null;
}

Line.fromAngle = function(p1, theta) {
  // If angle is 0 or 180 then set the points manually to avoid division by zero.
  if (withinEpsilon(theta, 0)) {
    return new Line(p1, new Point(p1.x, p1.y - 1));
  }
  else if (withinEpsilon(theta, Math.PI)) {
    return new Line(p1, new Point(p1.x, p1.y + 1));
  }
  // Otherwise calculate it using tan.
  else {
    return new Line(p1, new Point(p1.x + 1, p1.y + (1 / Math.tan(theta))));
  }
};

Line.prototype.gradientInfinite = function() {
  return (withinEpsilon(this.p1.x, this.p2.x));
}

Line.prototype.gradient = function() {
  if (this.m == null) {
    this.m = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
  }
  return this.m;
}

Line.prototype.yInt = function() {
  if (this.c == null) {
    this.c = this.p1.y - this.gradient() * this.p1.x;
  }
  return this.c;
}

Line.prototype.x = function(y) {
  if (this.gradientInfinite()) {
    return this.p1.x;
  }
  return (y - this.yInt()) / this.gradient();
}

Line.prototype.y = function(x) {
  return this.gradient() * x + this.yInt();
}

Line.prototype.intersection = function(other) {
  if (this.gradientInfinite() && other.gradientInfinite()) {
    return null;
  }
  else if (this.gradientInfinite()) {
    return new Point(this.p1.x, other.y(this.p1.x));
  }
  else if (other.gradientInfinite()) {
    return new Point(other.p1.x, this.y(other.p1.x));
  }
  else {
    if (withinEpsilon(this.gradient(), other.gradient())) {
      return null;
    }
    var intersectX = (other.yInt() - this.yInt()) / (this.gradient() - other.gradient());
    var intersectY = this.gradient() * intersectX + this.yInt();
    return new Point(intersectX, intersectY);
  }
}