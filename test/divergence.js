const divergence = require('../src/divergence');
const slope = require('../src/slope.js');
const noDivergence = require('./data/noDivergence.js');
const bullishDivergence = require('./data/bullishDivergence.js');
const bearishDivergence = require('./data/bearishDivergence.js');
const confirmedBullishDivergence = require('./data/confirmedBullishDivergence.js');
const confirmedBearishDivergence = require('./data/confirmedBearishDivergence.js');

const chaiAsPromised = require('chai-as-promised');
const chai = require('chai'), should = chai.should, expect = chai.expect, assert = chai.assert;
chai.use(chaiAsPromised);
sinon = require('sinon');
describe('Divergence tests', () => {
// close = priceValue
// rsiValue = rsi

   
    it('Should return bullish divergence', () => {
        const columns = bullishDivergence;
        let slopeSpy = sinon.spy(slope);        
        divergence(columns).then(function() {
            let slopeArguments = slopeSpy.getCall(0).args;
            slopeArguments[2].should.be.eq('Bullish');
            slopeArguments[3].should.be.eq('Divergence');
        });
    });

    // it('Should return bearish divergence', () => {
    //     const columns = bearishDivergence;
    //     const pos = 2;
    //     const timeFrame = "1h";
    //     const pair = "tEOSUSD";
    //     return divergence(columns, pos, timeFrame, pair)
    //         .then(function (data) {
    //             expect(data.direction).to.equal('bearish');
    //         })
    // });

    // it('Should return confirmed bullish divergence', () => {
    //     const columns = confirmedBullishDivergence;
    //     const pos = 6;
    //     const timeFrame = "1h";
    //     const pair = "tEOSUSD";
    //     return divergence(columns, pos, timeFrame, pair)
    //         .then(function (data) {
    //             expect(data.direction).to.equal('bullish');
    //         })
    // });

    // it('Should return confirmed bearish divergence', () => {
    //     const columns = confirmedBearishDivergence;
    //     const pos = 6;
    //     const timeFrame = "1h";
    //     const pair = "tEOSUSD";
    //     return divergence(columns, pos, timeFrame, pair)
    //         .then(function (data) {
    //             expect(data.direction).to.equal('bearish');
    //         })
    // });
});