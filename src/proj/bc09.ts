/**
 * BD09 Coordinate Reference System.
 * This crs is applied to web map and apps of baidu co.
 * It is secondly encrypted crs based on GCJ02 crs.
 *
 * @Author: wkgreat
 * @Date: 2020/08/08
 * */

/**
 * the code of bd09
 * @const
 * @type {string}
 * */
/*eslint-disable */
import {Extent} from 'ol/extent';
/*eslint-disable */
import Projection from 'ol/proj/Projection';
import Units from 'ol/proj/Units';
import {addEquivalentProjections, addEquivalentTransforms, TransformFunction} from 'ol/proj';
import {PROJECTIONS as EPSG3857_PROJECTIONS} from 'ol/proj/epsg3857';
import {PROJECTIONS as EPSG4326_PROJECTIONS} from 'ol/proj/epsg4326';
import {
  PROJECTIONS as GCJ02_PROJECTIONS,
  toEPSG3857 as gcj02to3857,
  fromEPSG3857 as gcj02from3857,
  toEPSG4326 as gcj02to4326,
  fromEPSG4326 as gcj02from4326
} from './gcj02';
import {transformChain} from './common';

export const CODE = 'BD09';

/**
 * radius of WGS84 ellipsoid
 * @const
 * @type {number}
 * */
export const RADIUS:number = 6378137;

/**
 * extent of gcj02
 * @const
 * @type {ol/Extent}
 * */
export const EXTENT: Extent = [73.62, 18.11, 134.77, 53.56];

/**
 * coefficient between degree and radian
 * @const
 * @type {number}
 * */
export const METERS_PER_UNIT:number = (Math.PI * RADIUS) / 180;

/**
 * the class of bd09 (baidu) coordinate reference system
 * @class BD09Projection
 * */
class BD09Projection extends Projection {

  constructor(code: string, opt_axisOrientation ?: string) {
    super({
      code: code,
      units: Units.METERS,
      extent: EXTENT,
      axisOrientation: opt_axisOrientation,
      global: false, // should be in china
      metersPerUnit: METERS_PER_UNIT,
      worldExtent: EXTENT
    });
  }
}

/**
 * all codes of bd09 reference system
 * @const
 * @type {BD09Projection[]}
 * */
export const PROJECTIONS: BD09Projection[] = [
  new BD09Projection(CODE),
  new BD09Projection('BD:09'),
  new BD09Projection('baidu')
];

/**
 * transform coordinate from BD09 to gcj02
 * @function
 * @param {number[]} input input coordinate
 * @param {number[]} opt_output output coordinate
 * @param {number} opt_dimension dimension of coordinate
 * @return {number[]} tranformed coordinate
 * */
export function toGCJ02(input:number[], opt_output:number[], opt_dimension:number): number[] {
  const length = input.length;
  const dimension = opt_dimension > 1 ? opt_dimension : 2;
  let output:number[] = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (let i = 0; i < length; i += dimension) {
    const coord = bd09toGcj02(input.slice(i, i + 2));
    output[i] = coord[i];
    output[i + 1] = coord[i + 1];
  }
  return output;
}

/**
 * transform coordinate from GCJ02 to BD09
 * @function
 * @param {number[]} input input coordinate
 * @param {number[]} opt_output output coordinate
 * @param {number} opt_dimension dimension of coordinate
 * @return {number[]} tranformed coordinate
 * */
export function fromGcj02(input:number[], opt_output:number[], opt_dimension:number) {
  const length = input.length;
  const dimension = opt_dimension > 1 ? opt_dimension : 2;
  let output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (let i = 0; i < length; i += dimension) {
    const coord = gcj02toBd09(input.slice(i, i + 2));
    output[i] = coord[i];
    output[i + 1] = coord[i + 1];
  }
  return output;
}

const XPI = Math.PI * 3000.0 / 180.0;

/**
 * transform bd09 coordinate to gcj02
 * @param {number[]} coord coordinate of bd09
 * @return coordinate of gcj02
 * */
function bd09toGcj02(coord: number[]) {
  const x = coord[0] - 0.0065;
  const y = coord[1] - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * XPI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * XPI);
  return [z * Math.cos(theta), z * Math.sin(theta)];
}

/**
 * transform gcj02 coordinate to bd09
 * @param {number[]} coord coordinate of gcf02
 * @return coordinate of bd09
 * */
function gcj02toBd09(coord: number[]) {
  const x = coord[0];
  const y = coord[1];
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * XPI);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * XPI);
  return [z * Math.cos(theta) + 0.0065, z * Math.sin(theta) + 0.006];
}

const adBD09 = () => {

  // same projection of bd09
  addEquivalentProjections(PROJECTIONS);

  // bd09 and gcj02
  addEquivalentTransforms(
    PROJECTIONS,
    GCJ02_PROJECTIONS,
    toGCJ02,
    fromGcj02
  );

  // bd02 and EPSG:3827
  addEquivalentTransforms(
    PROJECTIONS,
    EPSG3857_PROJECTIONS,
    transformChain(toGCJ02, gcj02to3857),
    transformChain(gcj02from3857, fromGcj02)
  );

  //bd02 and wgs84
  addEquivalentTransforms(
    PROJECTIONS,
    EPSG4326_PROJECTIONS,
    transformChain(toGCJ02, gcj02to4326),
    transformChain(gcj02from4326, fromGcj02)
  );

};

adBD09();

