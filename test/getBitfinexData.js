
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
// call needed to resolve chai bug
chai.should();
chai.use(chaiAsPromised);
const getBitfinexData = require('../src/getBitfinexData.js');
const withStatus = require('promise-with-status')(Promise);

describe('get Bitfinex Data tests', function() {
    it('Should return pending promise', function() {
        const subscriptions = [
            {channel: 'candles', event: 'subscribe', key: 'trade:1h:tEOSUSD'},
            {channel: 'candles', event: 'subscribe', key: 'trade:1h:tZRXUSD'},
            {channel: 'candles', event: 'subscribe', key: 'trade:2h:tEOSUSD'},
            {channel: 'candles', event: 'subscribe', key: 'trade:2h:tZRXUSD'}];
        let promise = withStatus(getBitfinexData(subscriptions));
        expect(promise.status.toString().trim()).to.be.eq('Symbol(pending)');
    });
});
