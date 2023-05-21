export function getInsribedRectInCircle (radius: number): number {
  return Math.sqrt(Math.pow(2 * radius, 2) / 2);
}

export function isRectangleContained(
  innerRect: any, 
  outerRect: any
): boolean {
  return (
    innerRect.left >= outerRect.left &&
    innerRect.right <= outerRect.right &&
    innerRect.top >= outerRect.top &&
    innerRect.bottom <= outerRect.bottom
  );
}


interface Coordinates {
  x: number,
  y: number
}

type Point = Coordinates;
type Vector = Coordinates;
type Angle = number;

function translatePointFromVector(
  point: Point,
  direction: Vector,
  distance: number
): Point {
  const dx = direction.x, dy = direction.y;
  const vectorNorm = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  const factor = distance / vectorNorm;

  return {
    x: point.x + (dx * factor),
    y: point.y + (dy * factor)
  };
}

function translatePointFromAngle(
  point: Point,
  direction: Angle,
  distance: number
): Point {
  const dx = distance * Math.cos(direction);
  const dy = distance * Math.sin(direction);

  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

export function translatePoint(
  point: Point,
  direction: Vector | Angle,
  distance: number
): Point {
  if (typeof direction === 'object') {
    return translatePointFromVector(point, direction as Vector, distance);
  }
  if (typeof direction === 'number') {
    return translatePointFromAngle(point, direction as Angle, distance);
  }
  return point;
}
