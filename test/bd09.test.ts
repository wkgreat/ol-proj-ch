import {BD09, GCJ02} from '../src'
import {transform} from 'ol/proj'
import {expect} from 'chai'
import {coordsEquals} from "../src/proj/common";

const testData = {
    bd09: [117.0,32.0],
    gcj02: [116.99360338478688,31.99367268115307],
    wgs84: [116.98826104585218,31.99574180740506],
    e3857: [1.3023073648414828E7, 3762751.6861747215]
};

describe("bd09 coordinate reference system", function () {

    it("check test", function () {
       console.log("check test.");
       expect(1).equals(1);
    });

    it("import BD09", function () {
        expect(BD09).not.equals(undefined, "undefined of BD09");
        expect(BD09.CODE).equals("BD09", "BD09.CODE not equals 'BD09'");
    });

    it("bd09 <-> gcj02", function () {
        const c1 = transform(testData.bd09, BD09.CODE, GCJ02.CODE);
        expect(coordsEquals(c1, testData.gcj02)).equals(true, 'wrong: bd09 -> gcj02');
        const c2 = transform(testData.gcj02, GCJ02.CODE, BD09.CODE);
        expect(coordsEquals(c2, testData.bd09)).equals(true, 'wrong: bd09 <- gcj02');
    });

    it("bd09 <-> wgs84", function () {
        const c1 = transform(testData.bd09, BD09.CODE, 'EPSG:4326');
        expect(coordsEquals(c1, testData.wgs84)).equals(true, 'wrong: bd09 -> wgs84');
        const c2 = transform(testData.wgs84, 'EPSG:4326', BD09.CODE);
        expect(coordsEquals(c2, testData.bd09)).equals(true,'wrong: bd09 <- wgs84');
    });

    it("bd09 <-> e3857", function () {
        const c1 = transform(testData.bd09, BD09.CODE, 'EPSG:3857');
        expect(coordsEquals(c1, testData.e3857)).equals(true, 'wrong: bd09 -> EPSG:3857');
        const c2 = transform(testData.e3857, 'EPSG:3857', BD09.CODE);
        expect(coordsEquals(c2, testData.bd09)).equals(true, 'wrong: bd09 <- EPSG:3857');
    });

});
