// @ts-check
'use strict';
const db = require('./db.js');
const rsi = require('./rsi.js');
const spike = require('./spike.js');
/**
 * Enhance the data with RSI and spikes
 * @param {string} pair The instrument pair
 * @param {string} timeFrame The time frame
 * @return {Object} somthing
 */
module.exports = function enhanceData(pair, timeFrame) {
    return new Promise((resolve, reject) => {
        const data = {pair, timeFrame};
        let rsiArray = [];
        let priceArray = [];
        db(data, 'getAllPrices')
        .then((prices) => {
            if (prices && prices.length >= 100) {
                return rsi(prices);
            }
        })
        .then((rsiData) => {
            if (rsiData && rsiData.rsiArray && rsiData.priceArray) {
                rsiArray = rsiData.rsiArray;
                priceArray = rsiData.priceArray;
                return Promise.all([spike(priceArray, 'price'), spike(rsiArray, 'rsi')]);
            }
        })
        .then((spikeData) => {
            if (spikeData && spikeData[0] && spikeData[1]) {
                const priceArray = spikeData[0].dataArray;
                const priceSpikeArray = spikeData[0].spikeArray;
                const rsiSpikeArray = spikeData[1].spikeArray;
                let batch = [];
                for (let i = 0; i <= 85; ++i) {
                    const id = priceArray[i]._id;
                    const priceSpike = priceSpikeArray[i];
                    const rsiSpike = rsiSpikeArray[i];
                    const rsi = rsiArray[i];
                    const data = {id, priceSpike, rsiSpike, rsi};
                    batch.push(data);
                };
                console.log('saving');
                db(batch, 'setEnhance')
                .catch((error) => {
                    reject(error);
                });
                resolve(true);
            }
        })
        .catch((error) => {
            reject(error);
        });
    });
};
