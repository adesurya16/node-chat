exports.Point = function (_x, _y) {
  x = _x;
  y = _y;
  inf = false;

  return {
    x: x,
    y: y,
    inf: inf
  };
}