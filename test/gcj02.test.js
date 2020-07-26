import olpjch, {GCJ02} from '../src'
import {transform} from 'ol/proj'
import should from "should";
import {GeoJSON} from "ol/format";
import WKT from "ol/format/WKT";

const coordsEquals = (c1, c2) => {
   const diff = Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]);
   return diff<1E-5;
};

describe("ol-proj-ch gcj02 projection", function () {

   it("check test", function () {
      console.log("hello test");
   });

   it("import olpjch", function () {
      should(olpjch).not.undefined();
      should(olpjch.GCJ02).not.undefined();
      should(typeof olpjch.GCJ02.toEPSG3857).equals("function");
      should(olpjch.GCJ02.CODE).equals("GCJ02");
   });

   it("import GCJ02",function () {
      should(GCJ02).not.undefined();
      should(GCJ02.CODE).equals("GCJ02");
   });

   it("transform coordinates from GCJ02 to WGS84", function () {

      const c1 = GCJ02.gcj2WGS([117,32]);
      const c2 = transform([117,32], GCJ02.CODE, "EPSG:4326");
      should(coordsEquals(c1,c2)).true("c1 and c2 should be equal");

   });

   it("transform coordinates from WGS84 to GCJ02", function () {

      const c1 = GCJ02.wgs2GCJ([117,32]);
      const c2 = transform([117,32], "EPSG:4326", GCJ02.CODE);
      should(coordsEquals(c1,c2)).true("c1 and c2 should be equal");

   });

   it("transform coordinates from GCJ02 to EPSG:3857", function () {

      const c1 = transform(GCJ02.gcj2WGS([117,32]),"EPSG:4326","EPSG:3857");
      const c2 = transform([117,32], GCJ02.CODE, "EPSG:3857");
      should(coordsEquals(c1,c2)).true("c1 and c2 should be equal");

   });

   it("transform coordinates from EPSG:3857 to GCJ02", function () {

      const c1 = GCJ02.wgs2GCJ(transform([117,32], "EPSG:3857", "EPSG:4326"));
      const c2 = transform([117,32], "EPSG:3857", GCJ02.CODE);
      should(coordsEquals(c1,c2)).true("c1 and c2 should be equal");

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
      should(feature).not.null();
      const c1 = transform(GCJ02.gcj2WGS(coord), "EPSG:4326", "EPSG:3857");
      const c2 = feature.getGeometry().getFlatCoordinates();
      should(c2).not.null();
      should(coordsEquals(c1,c2)).true("c1 and c2 should be equal");

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
      should(feature).not.null();
      const c1 = transform(GCJ02.gcj2WGS(coord), "EPSG:4326", "EPSG:3857");
      const c2 = feature.getGeometry().getFlatCoordinates();
      should(c2).not.null();
      should(coordsEquals(c1,c2)).true("c1 and c2 should be equal");

   });

});

