// @ts-check
'use strict';
const RSI = require('@solazu/technicalindicators').RSI;
/**
 * gets and sets the RSI values
 * @param {Array} priceArray The array of prices to create the RSI from
 * @return {Object} two arrays for price and RSI
 */
module.exports = function rsi(priceArray) {
    return new Promise((resolve, reject) => {
        let values = [];
        for (let i = 0; i <= 99; ++i) {
            values[i] = priceArray[i].close;
        }
        const inputRSI = {values, period: 14, reversedInput: true};
        const rsiArray = (RSI.calculate(inputRSI));
        if (values.length >= 86 && rsiArray.length >= 86) {
            resolve({rsiArray, priceArray});
        }
    });
};
