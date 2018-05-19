'use strict';
const db = require('./db.js');
/**
 * Saves the channel data we get from bitfinex after subscribing
 * @param {Array} msg The array of prices to create the RSI from
 * @return {string} two arrays for price and RSI
 */
module.exports = function subscribed(msg) {
    const key = msg.key;
    const chanId = msg.chanId;
    const item = key.split(':');
    const timeFrame = item[1];
    const pair = item[2];
    const data = {timeFrame, pair, key, chanId};
    db(data, 'setChannel')
    .catch((error) => {
        console.log(error);
    });
};
