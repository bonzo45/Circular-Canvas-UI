describe("This helper file contains a couple of useful bits.", function() {

  it("should know when two numbers are essentially identical", function() {
    expect(withinEpsilon(0.0, 0.00000001)).toBe(true);
    expect(withinEpsilon(0.0, 0.5)).not.toBe(true);
  });
});