'use strict';
const db = require('./db.js');
const getChannel = require('./getChannel.js');
const moment = require('moment');
/**
 * gets and sets the RSI values
 * @param {Array} msg The array of prices to create the RSI from
 * @return {string} two arrays for price and RSI
 */
module.exports = function savePrice(pair, timeFrame, price) {
    try {
        let time = price[0];
        let open = price[1];
        let close = price[2];
        let high = price[3];
        let low = price[4];
        let volume = price[5];
        let localTime = moment(time).format();
        let data = {pair, timeFrame, open, close, high, low, volume, localTime, time};
        db(data, 'setPrice')
        .catch((error)=>{
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
};
