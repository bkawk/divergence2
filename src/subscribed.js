'use strict';
const db = require('./db.js');
/**
 * gets and sets the RSI values
 * @param {Array} msg The array of prices to create the RSI from
 * @return {string} two arrays for price and RSI
 */
module.exports = function subscribed(msg) {
    try {
        const key = msg.key;
        const item = key.split(':');
        const timeFrame = item[1];
        const pair = item[2];
        const chanId = msg.chanId;
        const data = {timeFrame, pair, key, chanId};
        db(data, 'setChannel')
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        reject(error);
    }
};
