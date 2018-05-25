// @ts-check
'use strict';
const db = require('./db.js');
const savePrice = require('./savePrice.js');
/**
 * gets and sets the RSI values
 * @param {Array} message The array of prices to create the RSI from
 * @param {Array} socket The array of prices to create the RSI from
 */
module.exports = function price(message, socket) {
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
            savePrice('batch', channel.pair, channel.timeFrame, data);
        } else if (channel && channel.pair && channel.timeFrame && data.length > 0) {
            savePrice('single', channel.pair, channel.timeFrame, data);
        }
    })
    .catch((error) => {
        console.log(error);
    });
};
