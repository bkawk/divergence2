'use strict';
const db = require('./db.js');
const savePrice = require('./savePrice.js');
const LeakyBucket = require('leaky-bucket');
/**
 * gets and sets the RSI values
 * @param {Array} message The array of prices to create the RSI from
 */
module.exports = function price(message) {
    const data = message[1];
    const chanId = message[0];
    const bucket = new LeakyBucket({
        capacity: 5, // Make 10 requests
        interval: 0.5, // Every 1 second
        maxWaitingTime: 100 * 0.5, // Number of items to process * interval
    });
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
            for (let i = 0; i < data.length; i++) {
                if (i <= 100 && channel.pair && channel.timeFrame && data[i].length > 0) {
                    bucket.throttle((err) => {
                        savePrice(channel.pair, channel.timeFrame, data[i]);
                    });
                }
            }
        } else if (channel && channel.pair && channel.timeFrame && data.length > 0) {
            console.log(channel.pair, channel.timeFrame, data);
            savePrice(channel.pair, channel.timeFrame, data);
        }
    })
    .catch((error) => {
        console.log(error);
    });
};
