import {expect} from 'chai'

const coordsEquals = (c1:number[], c2:number[]): boolean => {
    const diff = Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]);
    return diff<1E-4;
};

const testData = {
    bd09: [117.0,32.0],
    gcj02: [116.99360338478688,31.99367268115307],
    wgs84: [116.98826104585218,31.99574180740506],
    e3857: [1.3023073648414828E7, 3762751.6861747215]
};

describe("bd09 coordinate reference system", function () {

    it("check test", function () {
       console.log("check test.")
       expect(1).equals(1)
    });

    it("bd09 <-> gcj02", function () {

    });

    it("bd09 <-> wgs84", function () {

    });

    it("bd09 <-> e3857", function () {

    });

});
