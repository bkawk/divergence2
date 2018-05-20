'use strict';
const db = require('./db.js');
const getChannel = require('./getChannel.js');
const savePrice = require('./savePrice.js');
/**
 * gets and sets the RSI values
 * @param {Array} message The array of prices to create the RSI from
 */
module.exports = function price(message) {
    if (message && typeof message[0] != undefined && message[0] != null) {
        const data = message[1];
        db(message[0], 'getChannel')
        .then((data)=>{
            if (data && data.key) {
                return getChannel(data.key);
            }
        })
        .then((channel) => {
            if (channel && data && data.length > 6) {
                data.forEach((price, i) => {
                    savePrice(channel.pair, channel.timeFrame, price);
                });
            } else if (channel) {
                savePrice(channel.pair, channel.timeFrame, data);
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }
};
