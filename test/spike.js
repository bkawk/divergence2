const spike = require("../src/spike");
const priceData = require("./data/priceData.js");
var chai = require("chai"),
  should = chai.should,
  expect = chai.expect,
  assert = chai.assert;
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

describe("Spike tests", () => {
  it("Should return spike none", () => {
    spike(priceData,"price").should.eventually.deep.equal({spikeArray:["none"],dataArray:priceData});
  });
});
