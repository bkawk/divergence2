const slope = require('../src/slope');
const bullishDivergence = require('./data/bullishDivergence.js');
const withStatus = require('promise-with-status')(Promise);

var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

    describe('Slope tests', () => {
        it("Should return pending promise",function(){
            const columns = bullishDivergence;
            let promise = withStatus(slope(columns, 3, 'Bullish', 'Divergence'));
            expect(promise.status.toString().trim()).to.be.eq('Symbol(pending)');
        });
    });   