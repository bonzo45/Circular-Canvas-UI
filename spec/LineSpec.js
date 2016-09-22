var customMatchers = {

  toBeLineEqual: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        var result = {};

        if (expected === undefined) {
          result.pass = false;
        }

        if (actual.gradientInfinite() && expected.gradientInfinite()) {
          result.pass = util.equals(actual.p1.x, expected.p1.x) && (!(actual.p1.y < actual.p2.y) != (expected.p1.y < expected.p2.y));
        }
        else if (actual.gradientInfinite() || expected.gradientInfinite()) {
          result.pass = false;
        }
        else {
          result.pass = util.equals(actual.gradient(), expected.gradient()) && util.equals(actual.yInt(), expected.yInt());
        }

        if (result.pass) {
          result.message = "Expected " + actual + " not to equal " + expected + ".";
        } else {
          result.message = "Expected " + actual + " to equal " + expected + ".";
        }
        return result;
      }
    };
  }
};

describe("The line class contains code needed to create and intersect lines.", function() {

  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  it("should create a line from two points", function() {
    var line = new Line(new Point(0, 0), new Point(1, 1));
    expect(line.p1).toEqual(new Point(0, 0));
    expect(line.p2).toEqual(new Point(1, 1));
  });

  it("should create a line with zero gradient from a point and angle", function() {
    var line = Line.fromAngle(new Point(1, 1), Math.PI / 2);
    expect(line).toBeLineEqual(new Line(new Point(1, 1), new Point(2, 1)));
  });

  it("should create a line with non-zero gradient from a point and angle", function() {
    var line = Line.fromAngle(new Point(1, 1), Math.PI / 4);
    expect(line).toBeLineEqual(new Line(new Point(1, 1), new Point(2, 2)));
  });

  it("should create a line with infinite gradient from a point and angle", function() {
    var line = Line.fromAngle(new Point(1, 1), 0);
    expect(line).toBeLineEqual(new Line(new Point(1, 2), new Point(1, 1)));
  });

  it("should create a line that has a particular direction", function() {
    var line = Line.fromAngle(new Point(1, 1), Math.PI / 2);
    expect(line).toBeLineEqual(new Line(new Point(1, 1), new Point(2, 1)));
    expect(line).not.toBeLineEqual(new Line(new Point(2, 1), new Point(1, 1)));
  });

  it("should create a line that has a particular direction with infinite gradient upwards", function() {
    var line = Line.fromAngle(new Point(1, 1), 0);
    expect(line).toBeLineEqual(new Line(new Point(1, 2), new Point(1, 1)));
    expect(line).not.toBeLineEqual(new Line(new Point(1, 1), new Point(1, 2)));
  });

  it("should create a line that has a particular direction with infinite gradient downwards", function() {
    var line = Line.fromAngle(new Point(1, 1), Math.PI);
    expect(line).toBeLineEqual(new Line(new Point(1, 1), new Point(1, 2)));
    expect(line).not.toBeLineEqual(new Line(new Point(1, 2), new Point(1, 1)));
  });

  it("should know when a line has an infinite gradient", function() {
    var line = new Line(new Point(0, 0), new Point(0, 1));
    expect(line.gradientInfinite()).toBe(true);
  });

  it("should know when a line does not have an infinite gradient", function() {
    var line = new Line(new Point(0, 0), new Point(1, 1));
    expect(line.gradientInfinite()).not.toBe(true);
  });

  it("should compute the gradient when not infinite", function() {
    var line = new Line(new Point(0, 0), new Point(1, 1));
    expect(line.gradient()).toBe(1);
    line = new Line(new Point(0, 0), new Point(0.5, 1));
    expect(line.gradient()).toBe(2);
    line = new Line(new Point(0, 0), new Point(0.5, -1));
    expect(line.gradient()).toBe(-2);
  });

  it("should compute the y-intercept when gradient not infinite", function() {
    var line = new Line(new Point(0, 1), new Point(1, 2));
    expect(line.yInt()).toBe(1);
    line = new Line(new Point(0, 2), new Point(1, 2));
    expect(line.yInt()).toBe(2);
    line = new Line(new Point(1, 1), new Point(2, 2));
    expect(line.yInt()).toBe(0);    
  });

  it("should compute x values given y when gradient not infinite", function() {
    var line = new Line(new Point(0, 0), new Point(1, 2));
    expect(line.x(0)).toBe(0);
    expect(line.x(1)).toBe(0.5);
    expect(line.x(2)).toBe(1);
    expect(line.x(100)).toBe(50);
  });
  
  it("should compute x values given y when gradient is infinite", function() {
    var line = new Line(new Point(4, 0), new Point(4, 1));
    expect(line.x(0)).toBe(4);
    expect(line.x(1)).toBe(4);
    expect(line.x(2)).toBe(4);
    expect(line.x(100)).toBe(4);
  });  

  it("should compute y values given x when gradient not infinite", function() {
    var line = new Line(new Point(0, 0), new Point(1, 2));
    expect(line.y(0)).toBe(0);
    expect(line.y(1)).toBe(2);
    expect(line.y(2)).toBe(4);
    expect(line.y(100)).toBe(200);
  });

  it("should compute y values given x when gradient is 0", function() {
    var line = new Line(new Point(0, 4), new Point(1, 4));
    expect(line.y(0)).toBe(4);
    expect(line.y(1)).toBe(4);
    expect(line.y(2)).toBe(4);
    expect(line.y(100)).toBe(4);
  });

  it("should compute intersections between two lines", function() {
    var line = new Line(new Point(0, 0), new Point(1, 1));
    var line2 = new Line(new Point(0, 2), new Point(2, 0));
    expect(line.intersection(line2)).toEqual(new Point(1, 1));
  });

  it("should compute intersections between two lines where one has an infinite gradient", function() {
    var line = new Line(new Point(0, 0), new Point(0, 1));
    var line2 = new Line(new Point(-1, 2), new Point(1, 4));
    expect(line.intersection(line2)).toEqual(new Point(0, 3));
  });

});