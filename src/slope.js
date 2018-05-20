'use strict';
const db = require('./db.js');
/**
 * get subscriptions
 * @param {number} columns The value to the left of target
 * @param {number} period The tagets value
 * @param {number} direction The value to the right of target
 * @param {number} type The value to the right of target
 * @return {string} the string indicating direction
 */
module.exports = function slope(columns, period, direction, type) {
    return new Promise((resolve, reject) => {
        try {
            const priceY1 = columns[1].close;
            const priceY2 = columns[period].close;
            const rsiY1 = columns[1].rsi;
            const rsiY2 = columns[period].rsi;
            const priceSlope = (priceY1 - priceY2) / period;
            const rsiSlope = (rsiY1 - rsiY2) / period;
            let result = true;
            columns.forEach((column, i) => {
                if (i > 1 && i < period) {
                    let priceLine = ((i) * priceSlope) + priceY1;
                    let rsiLine = ((i) * rsiSlope) + rsiY1;
                    if ((direction == 'Bullish' || direction == 'Negative') && (column.close > priceLine || column.rsi > rsiLine)) {
                        result = false;
                    } else if ((direction == 'Bearish' || direction == 'Positive') && (column.close < priceLine || column.rsi < rsiLine)) {
                        result = false;
                    }
                }
            });
            if (result === true) {
                const pair = columns[1].pair;
                const timeFrame = columns[1].timeFrame;
                const localTime = columns[1].localTime;
                const time = columns[1].time;
                console.log(`Confirmed ${direction} ${type}, ${period-1} Period, ${columns[1].pair}, ${columns[1].timeFrame}. localTime: ${columns[1].localTime} time: ${columns[1].time}`);
                const data = {columns, direction, type, period, pair, timeFrame, localTime, time};
                db(data, 'setDivergence')
                .catch((error)=>{
                    console.log(error);
                });
            } 
        } catch (error) {
            reject(error);
        }
    });
};
