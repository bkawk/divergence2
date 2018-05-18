'use strict';
const RSI = require('@solazu/technicalindicators').RSI;
/**
 * get subscriptions
 * @param {number} timeFrames The value to the left of target
 * @param {number} pairs The tagets value
 * @param {number} apiUrl The value to the right of target
 * @return {string} the string indicating direction
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
                resolve({rsiArray, priceArray})
            }
        } catch(error) {
            reject(error)
        }
    })
}
