'use strict';
const RSI = require('@solazu/technicalindicators').RSI;
/**
 * gets and sets the RSI values
 * @param {Array} priceArray The array of prices to create the RSI from
 * @return {string} two arrays for price and RSI
 */
module.exports = function rsi(priceArray) {
    return new Promise((resolve, reject) => {
        try {
            let values = [];
            priceArray.forEach((entry) => {
                if (entry.close) {
                    values.push(entry.close);
                }
            });
            const inputRSI = {values, period: 14, reversedInput: true};
            const rsiArray = (RSI.calculate(inputRSI));
            if (values.length > 0 && rsiArray.length > 0) {
                resolve({rsiArray, priceArray});
            }
        } catch (error) {
            reject(error);
        }
    });
};
