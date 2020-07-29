import olpjch, {GCJ02} from '../src'
import {transform} from 'ol/proj'
import {expect} from 'chai'
import {GeoJSON} from "ol/format";
import WKT from "ol/format/WKT";
import Point from "ol/geom/Point";
import SimpleGeometry from "ol/geom/SimpleGeometry";

const coordsEquals = (c1:number[], c2:number[]): boolean => {
   const diff = Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]);
   return diff<1E-5;
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

      const c1 = GCJ02.gcj2WGS([117,32]);
      const c2 = transform([117,32], GCJ02.CODE, "EPSG:4326");
      expect(coordsEquals(c1,c2)).equals(true)

   });

   it("transform coordinates from WGS84 to GCJ02", function () {

      const c1 = GCJ02.wgs2GCJ([117,32]);
      const c2 = transform([117,32], "EPSG:4326", GCJ02.CODE);
      expect(coordsEquals(c1,c2)).equals(true)

   });

   it("transform coordinates from GCJ02 to EPSG:3857", function () {

      const c1 = transform(GCJ02.gcj2WGS([117,32]),"EPSG:4326","EPSG:3857");
      const c2 = transform([117,32], GCJ02.CODE, "EPSG:3857");
      expect(coordsEquals(c1,c2)).equals(true);

   });

   it("transform coordinates from EPSG:3857 to GCJ02", function () {

      const c1 = GCJ02.wgs2GCJ(transform([117,32], "EPSG:3857", "EPSG:4326"));
      const c2 = transform([117,32], "EPSG:3857", GCJ02.CODE);
      expect(coordsEquals(c1,c2)).equals(true);

   });

   it("geojson data with GCJ02 CRS", function () {

      const coord = [125.6, 10.1];

      const data = {
         "type": "Feature",
         "geometry": {
            "type": "Point",
            "coordinates": coord
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
      expect(feature).not.equals(null);
      const c1 = transform(GCJ02.gcj2WGS(coord), "EPSG:4326", "EPSG:3857");
      const c2 = (feature.getGeometry() as SimpleGeometry).getFlatCoordinates();
      expect(c2).not.equals(null);
      expect(coordsEquals(c1,c2)).equals(true)

   });

   it("WKT data with GCJ02 CRS", function () {

      const coord = [125.6, 10.1];

      const data = `POINT (${coord[0]} ${coord[1]})`;
      console.log(`WKT: ${data}`);

      const format = new WKT();
      let feature = format.readFeature(data, {
         dataProjection: GCJ02.CODE,
         featureProjection: "EPSG:3857"
      });
      console.log(feature);
      expect(feature).not.equals(null);
      const c1 = transform(GCJ02.gcj2WGS(coord), "EPSG:4326", "EPSG:3857");
      const c2 = (feature.getGeometry() as SimpleGeometry).getFlatCoordinates();
      expect(c2).not.equals(null);
      expect(coordsEquals(c1,c2)).equals(true)

   });

});

