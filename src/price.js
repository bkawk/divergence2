// @ts-check
'use strict';
const db = require('./db.js');
const savePrice = require('./savePrice.js');
/**
 * Prepares the price to be saved to the database
 * @param {Array} message The array of prices
 */
module.exports = function price(message) {
    const data = message[1];
    const chanId = message[0];
    db(chanId, 'getChannel')
    .then((chan) => {
        if (chan && chan.key) {
            const item = chan.key.split(':');
            const timeFrame = item[1];
            const pair = item[2];
            const channel = {pair, timeFrame};
            return (channel);
        }
    })
    .then((channel) => {
        if (channel && data && data.length > 6) {
            savePrice('batch', channel.pair, channel.timeFrame, data)
        } else if (channel && channel.pair && channel.timeFrame && data.length > 0) {
            savePrice('single', channel.pair, channel.timeFrame, data);
        }
    })
    .catch((error) => {
        console.log(error);
    });
};
