const db = require('../src/db.js');
const rsi = require('../src/rsi.js');
const spike = require('../src/spike.js');
const enhanceData = require('../src/enhanceData.js');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai'), should = chai.should, expect = chai.expect, assert = chai.assert;
const withStatus = require('promise-with-status')(Promise);
chai.use(chaiAsPromised);
sinon = require('sinon');


describe('enhance Data tests', () => {
    it("Should return pending promise",function(){
        const timeFrame = "1h";
        const pair = "tEOSUSD";
        let promise = withStatus(enhanceData(pair, timeFrame));
        expect(promise.status.toString().trim()).to.be.eq('Symbol(pending)');
    });
});