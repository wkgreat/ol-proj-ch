/**
 * GCJ02 Projection on basis of WGS84(EGPS:4326)
 * <p>
 * GCJ02 is not a projection strictly. In fact, it is a
 * confidential algorithm to offset real coordinate in China
 *
 * @author Ke Wang (wkgreat@outlook.com)
 *
 * </p>
 * */

import Projection from 'ol/proj/Projection';

import {
  fromEPSG4326 as from4326to3857,
  PROJECTIONS as EPSG3857_PROJECTIONS,
  toEPSG4326 as from3857to4326
} from 'ol/proj/epsg3857';

import {PROJECTIONS as EPSG4326_PROJECTIONS} from 'ol/proj/epsg4326';

import {addEquivalentProjections, addEquivalentTransforms} from 'ol/proj';
import Units from 'ol/proj/Units';
/*eslint-disable */
import {Extent} from 'ol/extent';
/*eslint-enable */

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
 * @classdesc
 * Projection object definition of GCJ02
 * */
class GCJ02Projection extends Projection {
  /**
     * @constructor
     * @param {string} code of gcj02
     * @param {string} opt_axisOrientation Axis orientation.
     * */
  constructor(code:string, opt_axisOrientation ?:string) {
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
 * default code of gcj02, used as identifier of gcj02
 * @const
 * @type {string}
 * */
export const CODE:string = 'GCJ02';

/**
 * all code of GCJ02Projection, 'GCJ02', 'GCJ:02' and 'ZH:MARS'
 * @const
 * @type {GCJ02Projection[]}
 * */
export const PROJECTIONS = [
  new GCJ02Projection(CODE),
  new GCJ02Projection('GCJ:02'),
  new GCJ02Projection('ZH:MARS')
];

/**
 * transform coordinate from GCJ02 to EPSG:3857
 * @function
 * @param {number[]} input input coordinate
 * @param {number[]} opt_output output coordinate
 * @param {number} opt_dimension dimension of coordinate
 * @return {number[]} tranformed coordinate
 * */
export function toEPSG3857(input:number[], opt_output:number[], opt_dimension:number):number[] {
  const the4326 = toEPSG4326(input, opt_output, opt_dimension);
  return from4326to3857(the4326, opt_output, opt_dimension);
}

/**
 * transform coordinate from EPSG:3857 to GCJ02
 * @function
 * @param {number[]} input input coordinate
 * @param {number[]} opt_output output coordinate
 * @param {number} opt_dimension dimension of coordinate
 * @return {number[]} tranformed coordinate
 * */
export function fromEPSG3857(input:number[], opt_output:number[], opt_dimension:number): number[] {
  const the4326 = from3857to4326(input, opt_output, opt_dimension);
  return fromEPSG4326(the4326, opt_output, opt_dimension);
}

/**
 * transform coordinate from GCJ02 to EPSG:4326
 * @function
 * @param {number[]} input input coordinate
 * @param {number[]} opt_output output coordinate
 * @param {number} opt_dimension dimension of coordinate
 * @return {number[]} tranformed coordinate
 * */
export function toEPSG4326(input:number[], opt_output:number[], opt_dimension:number): number[] {
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
    const coord = gcj2WGS(input.slice(i, i + 2));
    output[i] = coord[i];
    output[i + 1] = coord[i + 1];
  }
  return output;
}

/**
 * transform coordinate from EPSG:4326 to GCJ02
 * @function
 * @param {number[]} input input coordinate
 * @param {number[]} opt_output output coordinate
 * @param {number} opt_dimension dimension of coordinate
 * @return {number[]} tranformed coordinate
 * */
export function fromEPSG4326(input:number[], opt_output:number[], opt_dimension:number) {
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
    const coord = wgs2GCJ(input.slice(i, i + 2));
    output[i] = coord[i];
    output[i + 1] = coord[i + 1];
  }
  return output;
}

/**
 * transform coordinate from GCJ02 to EPSG:4326, this algorithm is more precise.
 * @function
 * @param {number[]} coord coordinate
 * @return {number[]} tranformed coordinate
 * */
export function gcj02WGSExactly(coord: number[]): number[] {
  const gcjLon = coord[0]; const gcjLat = coord[1];
  const initDelta = 0.01;
  const threshold = 0.000000001;
  let dLat = initDelta; let dLon = initDelta;
  let mLat = gcjLat - dLat; let mLon = gcjLon - dLon;
  let pLat = gcjLat + dLat; let pLon = gcjLon + dLon;
  let wgsLat; let wgsLon; let i = 0;
  while (true) {
    wgsLat = (mLat + pLat) / 2;
    wgsLon = (mLon + pLon) / 2;
    const tmp = wgs2GCJ([wgsLat, wgsLon]);
    dLat = tmp[0] - gcjLat;
    dLon = tmp[1] - gcjLon;
    if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold)) {
      break;
    }

    if (dLat > 0) {
      pLat = wgsLat;
    } else {
      mLat = wgsLat;
    }
    if (dLon > 0) {
      pLon = wgsLon;
    } else {
      mLon = wgsLon;
    }

    if (++i > 10000) {
      break;
    }
  }
  return [wgsLon, wgsLat];
}

/**
 * transform coordinate from EPSG:4326 to GCJ02
 * @function
 * @param {number[]} coord coordinate
 * @return {number[]} tranformed coordinate
 * */
export function wgs2GCJ(coord:number[]): number[] {
  const wgLon = coord[0]; const wgLat = coord[1];
  if (outOfChina(coord)) {
    return coord;
  }
  const deltaD = delta(coord);
  return [wgLon + deltaD[0], wgLat + deltaD[1]];
}

/**
 * transform coordinate from GCJ02 to EPSG:4326
 * @function
 * @param {number[]} coord coordinate
 * @return {number[]} tranformed coordinate
 * */
export function gcj2WGS(coord:number[]):number[] {
  const glon = coord[0]; const glat = coord[1];
  if (outOfChina(coord)) {
    return coord;
  }
  const deltaD = delta(coord);
  return [glon - deltaD[0], glat - deltaD[1]];
}

/**
 * whether a coordinate is nout of area of china
 * @param {number[]} coord the coordinate
 * @return {boolean} whether is out of china
 * */
export function outOfChina(coord:number[]): boolean {
  const lon = coord[0]; const lat = coord[1];
  if (lon < 72.004 || lon > 137.8347) {
    return true;
  }
  if (lat < 0.8293 || lat > 55.8271) {
    return true;
  }
  return false;
}

function delta(coord:number[]): number[] {
  const wgLon = coord[0]; const wgLat = coord[1];
  let dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
  let dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
  const radLat = wgLat / 180.0 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - 0.00669342162296594323 * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((6378245.0 * (1 - 0.00669342162296594323)) / (magic * sqrtMagic) * Math.PI);
  dLon = (dLon * 180.0) / (6378245.0 / sqrtMagic * Math.cos(radLat) * Math.PI);
  return [dLon, dLat];
}

function transformLat(x:number, y:number): number {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLon(x:number, y:number):number {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
  return ret;
}

/**
 * add gcj02 and its transformations to openlayers
 * it is added when this module is imported automatically
 * @function
 * */
function addGcj02() {
  // Add transformations that don't alter coordinates to convert within set of
  // projections with equal meaning.
  addEquivalentProjections(PROJECTIONS);
  // Add transformations to convert EPSG:4326 like coordinates to EPSG:3857 like
  // coordinates and back.
  addEquivalentTransforms(
    PROJECTIONS,
    EPSG3857_PROJECTIONS,
    toEPSG3857,
    fromEPSG3857
  );
  addEquivalentTransforms(
    PROJECTIONS,
    EPSG4326_PROJECTIONS,
    toEPSG4326,
    fromEPSG4326
  );
}

addGcj02();
