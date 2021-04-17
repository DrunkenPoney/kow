/**
 * Represents a 2D coordinate (x, y).
 */
export type Pos = [ number, number ] | {x: number, y: number}
type distanceFunc = (p1: Pos, p2: Pos) => number

/**
 * Calculates the distance between p1 and p2.
 *
 * @param {Pos} p1 - Point 1
 * @param {Pos} p2 - Point 2
 */
export const distance = <distanceFunc> ((p1: any, p2: any) => {
  let x1 = p1.x ?? p1[0],
      x2 = p2.x ?? p2[0],
      y1 = p1.y ?? p1[1],
      y2 = p2.y ?? p2[1]
  return Math.sqrt(( x2 - x1 ) ** 2 + ( y2 - y1 ) ** 2)
})

/**
 * Constrains the value within the range [min, max].
 *
 * @example
 * constrain(1, 2, 4) // => 2
 * constrain(3, 2, 4) // => 3
 * constrain(5, 2, 4) // => 4
 *
 * @param {number} value - The value to constrain
 * @param {number} min - The lower bound of the range (inclusive)
 * @param {number} max - The upper bound of the range (inclusive)
 */
export function constrain(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Rounds the value to the the specified decimal place.
 *
 * @example
 * round(123.456, -2) // => 100.0
 * round(123.456, 0) // => 123.0
 * round(124.456, 2) // => 123.46
 *
 * @param {number} value - The value to round
 * @param {number} [b=0] - The decimal place to round to
 */
export function round(value: number, b: number = 0): number {
  const e = 10 ** b
  return Math.round(value * e) / e
}

export function floor(value: number, b: number = 0): number {
  const e = 10 ** b
  return Math.floor(value * e) / e
}

export function ceil(value: number, b: number = 0): number {
  const e = 10 ** b
  return Math.ceil(value * e) / e
}

export function isBetween(value: number, min: number, max: number): boolean {
  return min < value && value < max
}