import {expect} from "chai";
import {coordsEquals, transformChain} from "../src/proj/common";
import {fromEPSG4326, toEPSG4326} from "ol/proj/epsg3857";

const testData = {
    bd09: [117.0,32.0],
    gcj02: [116.99360338478688,31.99367268115307],
    wgs84: [116.98826104585218,31.99574180740506],
    e3857: [1.3023073648414828E7, 3762751.6861747215]
};

describe("common.ts test", function () {

    it("check test", function () {
        console.log("check test.")
        expect(1).equals(1)
    });

    it("transformChain test", function () {
        const f1 = fromEPSG4326;
        const f2 = toEPSG4326;
        const cf = transformChain(f1,f2);
        const nc = cf(testData.wgs84);
        console.log(`oc: ${testData.wgs84}`);
        console.log(`nc: ${nc}`);
        expect(coordsEquals(nc, testData.wgs84)).equals(true);
    });

    it("transformChain test2", function () {
        const f1 = fromEPSG4326;
        const f2 = toEPSG4326;
        const cf = transformChain(f1,f2);
        const oc = [117,32];
        const nc = [0,0];
        cf(oc, nc, 2);
        console.log(`oc: ${oc}`);
        console.log(`nc: ${nc}`);
        expect(coordsEquals(nc, oc)).equals(true);
    });

});
