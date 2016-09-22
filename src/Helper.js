var EPSILON = 0.0001;

function withinEpsilon(actual, target) {
  return ((target - EPSILON < actual) && (actual < target + EPSILON))
}