const rsi = require('../src/rsi.js');
const priceData = require('./data/priceData.js');
const chai = require('chai'), should = chai.should, expect = chai.expect, assert = chai.assert;
const withStatus = require('promise-with-status')(Promise);

describe('rsi tests', () => {
    it('Should return price and RSI arrays', () => {
        // need to find correct RSI
    });
    it('Should return pending when no RSI found', () => {
        const priceArray = priceData;
        let promise =  withStatus(rsi(priceArray));
        expect(promise.status.toString().trim()).to.be.eq('Symbol(pending)');
    });
  
})
