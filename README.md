# China's Projection for OpenLayers
**Author:** wkgreat  
![TS](https://img.shields.io/npm/types/ol-proj-ch?style=flat)
[![NPM version](https://img.shields.io/npm/v/ol-proj-ch.svg)](https://www.npmjs.com/package/ol-proj-ch)
![CI](https://github.com/wkgreat/ol-proj-ch/workflows/CI/badge.svg)

# Projection Supported  
| Projection | code | Description |
| :----: | :---- | :---- |
| GCJ02 | 'GCJ02','GCJ:02','ZH:MARS' | 国测局02坐标系，火星坐标系 |
| BD09 | 'BD09','BD09','baidu' | 百度坐标系 |

# Introduction
GCJ02 is a coordinate systems often used in China. 
Strictly speaking, it is a confidential algorithm for encrypting geopoints.
After processing by GCJ02 algorithm, 
the point defined in WGS84 will be deviated on web map visually.
This module defines the GCJ02 as a Projection of openlayers, likewise EPSG:4326 and EPSG:3857

💡From version `1.0.3` also support `typescript`. 

# Install:
```shell script
npm install ol-proj-ch
```

# Import:
by `import olpjch`, the `olpjch` is defined as a container for all supported projections in this module.  
by `import {xxx} from 'ol-proj-ch'`, import the pertinent projection you want.  
```javascript
import olpjch from 'ol-proj-ch'

/* GCJ02 */
const GCJ02 = olpjch.GCJ02
const code = GCJ02.CODE
//...

/* BD09 */
const BD09 = olpjch.BD09
const code = BD09.CODE

//or import GCJ02, BD09 or others
import {GCJ02} from 'ol-proj-ch'
import {BD09} from 'ol-proj-ch'
const code1 = GCJ02.CODE    //the code of GCJ02
const code2 = BD09.CODE     //the code of BD09
```

# Usage:
💡 here use GCJ02 to make exmaples. 
* transform a coordinate from gcj02 to wgs84(EPSG:4326)
```javascript
import {GCJ02} from 'ol-proj-ch'
import {transform} from 'ol/proj'
const coords = [117.0,32.0];
const newCoords = transform(coords, GCJ02.CODE, "EPSG:4326");
```
likewise, use `transform([coords, "EPSG:4326", GCJ02.CODE)` from wgs84 to gcj02


* transform a coordinate from gcj02 to EPSG:3857
```javascript
import {GCJ02} from 'ol-proj-ch'
import {transform} from 'ol/proj'
const coords = [117.0,32.0];
const newCoords = transform(coords, GCJ02.CODE, "EPSG:3857");
```
likewise, use `transform([coords, "EPSG:3857", GCJ02.CODE)` from EPSG:3827 to gcj02

* eg: create feature from geojson data of GCJ02
```javascript
import {GCJ02} from 'ol-proj-ch'
import {GeoJSON} from "ol/format";

//geojson data pretend coordinates are in GCJ02
const data = {
   "type": "Feature",
   "geometry": {
      "type": "Point",
      "coordinates": [125.6, 10.1]
   },
   "properties": {
      "name": "Dinagat Islands"
   }
};

const format = new GeoJSON();
let feature = format.readFeature(data, {
   dataProjection: GCJ02.CODE,
   featureProjection: "EPSG:3857"
});
//... then add feature to layer and then add to map
```
* eg: visulaize vector data from wkt with gcj02 data projection
```javascript
import {GCJ02} from 'ol-proj-ch'
import WKT from "ol/format/WKT";

//WKT data
const data = `POINT (125.6 10.1)`;

const format = new WKT();
let feature = format.readFeature(data, {
   dataProjection: GCJ02.CODE,
   featureProjection: "EPSG:3857"
});
//... then add feature to layer and then add to map
```
