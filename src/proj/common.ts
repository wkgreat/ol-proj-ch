/*eslint-disable */
import {TransformFunction} from 'ol/proj';
/*eslint-enable */

/**
 * whether two coordinates are equivalent
 * @param {number[]} c1 coordinate 1
 * @param {number[]} c2 coordinate 2
 * @return {boolean} equals or not
 * */
export const coordsEquals = (c1: number[], c2: number[]): boolean => {
  const diff = Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]);
  return diff < 1E-4;
};

/**
 * transform a coordinate between more than two projection
 * projection1 -(f1)-> projection2 -(f2)-> projection3
 *
 * @param {TransformFunction} f1 the first transform
 * @param {TransformFunction} f2 the sconed transform
 * @returns {TransformFunction} a new transformation func which can transform a coordinate from projection a to projection b and then projection c
 * */
export const transformChain: (f1: TransformFunction, f2: TransformFunction) => TransformFunction =
    (f1: TransformFunction, f2: TransformFunction) =>
      (p0: number[], p1?: number[], p2?: number) => {
        const tp = f1(p0, undefined, p2);
        return f2(tp, p1, p2);
      };
