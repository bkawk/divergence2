
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai'), should = chai.should, expect = chai.expect, assert = chai.assert;
chai.should();
chai.use(chaiAsPromised);
sinon = require('sinon');
const getChannel = require('../src/getChannel.js');
const withStatus = require('promise-with-status')(Promise);

describe('get Channel tests', () => {
    it("Should return object with pair and timeFrame",function(){
        const keySample = "trade:15m:tEOSUSD";
        getChannel(keySample).should.eventually.deep.equal({pair:"tEOSUSD",timeFrame:"15m"});
    });
    it("Should return pair undefined when pair is missing",function(){
        const keySample = "trade:15m";
        getChannel(keySample).should.eventually.deep.equal({pair:undefined,timeFrame:"15m"});
    });
    it("Should return undefined values when key is empty",function(){
        const keySample = "";
        let promise = getChannel(keySample);
        getChannel(keySample).should.eventually.deep.equal({pair:undefined,timeFrame:undefined});
    });

});