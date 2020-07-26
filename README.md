# GCJ02 Projection for OpenLayers
**Author:** wkgreat

# Introduction
GCJ02 is a coordinate systems often used in China. 
Strictly speaking, it is a confidential algorithm for encrypting geopoints.
After processing by GCJ02 algorithm, 
the point defined in WGS84 will be deviated on web map visually.
This module defines the GCJ02 as a Projection of openlayers, likewise EPSG:4326 and EPSG:3857

# Install:
```shell script
npm install ol-proj-ch
```

# Import GCJ02:
```javascript
import olpjch from 'ol-proj-ch'
const GCJ02 = olpjch.GCJ02
const code = GCJ02.CODE
//...

//or
import {GCJ02} from 'ol-proj-ch'
const code = GCJ02.CODE
```
`code` is the constant string value (`'GCJ02'`) for identifying `GCJ02` used in openlayers. 
Unlike `'EPSG:4326'` and `'EPSG:3857'`, as GCJ02 is not a projection defined in EPSG, the code
dose **NOT** comply the formation `EPSG:xxxx`, `'GCJ02'` instead.

ps: `olpjch` is defined as a container for all supported projections in this module, 
current version only supports `GCJ02`

# Usage:
* transform a coordinate from gcj02 to wgs84(EPSG:4326)
```javascript
import GCJ02 from 'ol-proj-ch'
import {transform} from 'ol/proj'
const coords = [117.0,32.0];
const newCoords = transform(coords, GCJ02.CODE, "EPSG:4326");
```
likewise, use `transform([coords, "EPSG:4326", GCJ02.CODE)` from wgs84 to gcj02


* transform a coordinate from gcj02 to EPSG:3857
```javascript
import GCJ02 from 'ol-proj-ch'
import {transform} from 'ol/proj'
const coords = [117.0,32.0];
const newCoords = transform(coords, GCJ02.CODE, "EPSG:3857");
```
likewise, use `transform([coords, "EPSG:3857", GCJ02.CODE)` from EPSG:3827 to gcj02

* eg: create feature from geojson data of GCJ02
```javascript
import GCJ02 from 'ol-proj-ch'
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
import GCJ02 from 'ol-proj-ch'
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
#TODO
add baidu coordinate system and other common china's coordinate systems.
