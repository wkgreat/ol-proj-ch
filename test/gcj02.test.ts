import olpjch, {GCJ02} from '../src'
import {transform} from 'ol/proj'
import {expect} from 'chai'
import {GeoJSON} from "ol/format";
import WKT from "ol/format/WKT";
import Point from "ol/geom/Point";
import SimpleGeometry from "ol/geom/SimpleGeometry";

const coordsEquals = (c1:number[], c2:number[]): boolean => {
   const diff = Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]);
   return diff<1E-4;
};


const testData = {
   gcj02: [117.0,32.0],
   wgs84: [116.99463083583468,32.002051204744795],
   e3857: [1.302378273019214E7,3763579.882653693]
};

describe("ol-proj-ch gcj02 projection", function () {

   it("check test", function () {
      console.log("check test");
      expect(1).equals(1);
   });

   it("import olpjch", function () {
      expect(1).equals(1);
      expect(olpjch).not.equals(undefined);
      expect(olpjch.GCJ02).not.equals(undefined);
      expect(typeof olpjch.GCJ02.toEPSG3857).equals("function");
      expect(olpjch.GCJ02.CODE).equals("GCJ02");
   });

   it("import GCJ02",function () {
      expect(GCJ02).not.equals(undefined);
      expect(GCJ02.CODE).equals("GCJ02");
   });

   it("transform coordinates from GCJ02 to WGS84", function () {

      const c2 = transform(testData.gcj02, GCJ02.CODE, "EPSG:4326");
      expect(coordsEquals(testData.wgs84,c2)).equals(true)

   });

   it("transform coordinates from WGS84 to GCJ02", function () {

      const c2 = transform(testData.wgs84, "EPSG:4326", GCJ02.CODE);
      expect(coordsEquals(testData.gcj02,c2)).equals(true);
   });

   it("transform coordinates from GCJ02 to EPSG:3857", function () {

      const c2 = transform(testData.gcj02, GCJ02.CODE, "EPSG:3857");
      expect(coordsEquals(testData.e3857,c2)).equals(true);

   });

   it("transform coordinates from EPSG:3857 to GCJ02", function () {

      const c2 = transform(testData.e3857, "EPSG:3857", GCJ02.CODE);
      expect(coordsEquals(testData.gcj02,c2)).equals(true);

   });

   it("geojson data with GCJ02 CRS", function () {

      const coord = testData.gcj02;

      const data = {
         "type": "Feature",
         "geometry": {
            "type": "Point",
            "coordinates": coord
         },
         "properties": {
            "name": "a_point"
         }
      };

      const format = new GeoJSON();
      let feature = format.readFeature(data, {
         dataProjection: GCJ02.CODE,
         featureProjection: "EPSG:3857"
      });
      expect(feature).not.equals(null);
      const c2 = (feature.getGeometry() as SimpleGeometry).getFlatCoordinates();
      expect(c2).not.equals(null);
      expect(coordsEquals(testData.e3857,c2)).equals(true)

   });

   it("WKT data with GCJ02 CRS", function () {

      const coord = testData.gcj02;

      const data = `POINT (${coord[0]} ${coord[1]})`;
      console.log(`WKT: ${data}`);

      const format = new WKT();
      let feature = format.readFeature(data, {
         dataProjection: GCJ02.CODE,
         featureProjection: "EPSG:3857"
      });
      console.log(feature);
      expect(feature).not.equals(null);
      const c2 = (feature.getGeometry() as SimpleGeometry).getFlatCoordinates();
      expect(c2).not.equals(null);
      expect(coordsEquals(testData.e3857,c2)).equals(true)

   });

});

