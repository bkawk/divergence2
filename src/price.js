'use strict';
const db = require('./db.js');
const getChannel = require('./getChannel.js');
const savePrice = require('./savePrice.js');
/**
 * gets and sets the RSI values
 * @param {Array} msg The array of prices to create the RSI from
 * @return {string} two arrays for price and RSI
 */
module.exports = function price(msg) {
    try {
        if (msg && typeof msg[0] != undefined && msg[0] != null) {
            let data = msg[1];
            db(msg[0], 'getChannel')
            .then((data)=>{
                if (data && data.key) {
                    return getChannel(data.key);
                }
            })
            .then((channel)=>{
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
    } catch (error) {
        console.log(error);
    }
};
