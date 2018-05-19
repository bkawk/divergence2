'use strict';
const db = require('./db.js');
const rsi = require('./rsi.js');
const spike = require('./spike.js');
/**
 * Enhance the data with RSI and spikes
 * @param {number} pair The instrument pair
 * @param {number} timeFrame The time frame
 * @return {string} somthing
 */
module.exports = function enhanceData(pair, timeFrame) {
    return new Promise((resolve, reject) => {
        const data = {pair, timeFrame};
        db(data, 'getAllPrices')
        .then((prices) => {
            return rsi(prices);
        })
        .then((rsiData) => {
            const rsiArray = rsiData.rsiArray;
            const priceArray = rsiData.priceArray;
            rsiArray.forEach((item, i) => {
                const id = priceArray[i]._id;
                const rsi = rsiArray[i];
                const data = {id, rsi};
                db(data, 'setRsi')
                .catch((error) => {
                    console.log(error);
                });
            });
            return Promise.all([spike(priceArray, 'price'), spike(rsiArray, 'rsi')]);
        })
        .then((spikeData) => {
            const priceArray = spikeData[0].dataArray;
            const priceSpikeArray = spikeData[0].spikeArray;
            const rsiSpikeArray = spikeData[1].spikeArray;
            priceSpikeArray.forEach((item, i) => {
                const id = priceArray[i]._id;
                const priceSpike = priceSpikeArray[i];
                const rsiSpike = rsiSpikeArray[i];
                const data = {id, priceSpike, rsiSpike};
                db(data, 'setSpikes')
                .catch((error) => {
                    reject(error);
                });
            });
            resolve(true);
        })
        .catch((error) => {
            reject(error);
        });
    });
};
