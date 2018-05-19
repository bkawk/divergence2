const getDivergenceData = require('../src/getDivergenceData');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai'), should = chai.should, expect = chai.expect, assert = chai.assert;
chai.should();
chai.use(chaiAsPromised);
const withStatus = require('promise-with-status')(Promise);

describe('get Divergence Data tests', () => {
    it("Should return pending promise",function(){
        const subscriptions = [
            {channel: 'candles', event: 'subscribe', key: 'trade:1h:tEOSUSD'},
            {channel: 'candles', event: 'subscribe', key: 'trade:1h:tZRXUSD'},
            {channel: 'candles', event: 'subscribe', key: 'trade:2h:tEOSUSD'},
            {channel: 'candles', event: 'subscribe', key: 'trade:2h:tZRXUSD'}];
        let promise = withStatus(getDivergenceData(subscriptions));
        expect(promise.status.toString().trim()).to.be.eq('Symbol(pending)');
    });
});