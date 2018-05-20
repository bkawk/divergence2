'use strict';
const db = require('./db.js');
const moment = require('moment');
/**
 * gets and sets the RSI values
 * @param {Array} pair the pair currency
 * @param {string} timeFrame the time frame e.g: 1h
 * @param {double} price price
 //* @return {string} two arrays for price and RSI
 */
module.exports = function savePrice(pair, timeFrame, price) {
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
};
