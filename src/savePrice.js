// @ts-check
'use strict';
const moment = require('moment');
const priceModel = require('./model/price');

/**
 * Saves the prices to the database
 * @param {String} operation the pair currency
 * @param {string} pair the time frame e.g: 1h
 * @param {string} timeFrame price
 * @param {Object} price price
 */
module.exports = function savePrice(operation, pair, timeFrame, price) {
    if (operation == 'single') {
        let time = price[0];
        let open = price[1];
        let close = price[2];
        let high = price[3];
        let low = price[4];
        let volume = price[5];
        let localTime = moment(time).format();
        let data = {pair, timeFrame, open, close, high, low, volume, localTime, time};
        priceModel.setPrice(data)
        .catch((error) => {
            console.log(error);
        });
    } else if (operation == 'batch') {
        let batch = [];
        for (let i = 0; i < price.length; i++) {
            let time = price[i][0];
            let open = price[i][1];
            let close = price[i][2];
            let high = price[i][3];
            let low = price[i][4];
            let volume = price[i][5];
            let localTime = moment(time).format();
            let data = {pair, timeFrame, open, close, high, low, volume, localTime, time};
            batch.push(data);
        }
        priceModel.batchPrice(batch)
        .catch((error) => {
            console.log(error);
        });
    };
};
