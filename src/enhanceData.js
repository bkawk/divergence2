'use strict';
const db = require('./db.js');
const rsi = require('./rsi.js');
const spike = require('./spike.js');
/**
 * get subscriptions
 * @param {number} timeFrames The value to the left of target
 * @param {number} pairs The tagets value
 * @param {number} apiUrl The value to the right of target
 * @return {string} the string indicating direction
 */
module.exports = function enhanceData(pair, timeFrame) {
    return new Promise((resolve, reject) => {
        try {
            const data = {pair, timeFrame};
            db(data, 'getAllPrices')
            .then(prices => {
                return rsi(prices)
            })
            .then(rsiData => {
                const rsiArray = rsiData.rsiArray;
                const priceArray = rsiData.priceArray;
                rsiArray.forEach((item, i) => {
                    const id = priceArray[i]._id;
                    const rsi = rsiArray[i];
                    const data = {id, rsi};
                    db(data, "setRsi")
                })
                return Promise.all([spike(priceArray, 'price'), spike(rsiArray, 'rsi')])
            })
            .then(spikeData => { 
                const priceArray = spikeData[0].dataArray;
                const priceSpikeArray = spikeData[0].spikeArray;  
                const rsiSpikeArray = spikeData[1].spikeArray;          
                priceSpikeArray.forEach((item, i)=>{
                    const id = priceArray[i]._id;
                    const priceSpike = priceSpikeArray[i];
                    const rsiSpike = rsiSpikeArray[i];
                    const data = {id, priceSpike, rsiSpike};
                    db(data, "setSpikes")
                    .catch((error) => {
                        console.log(error)
                    })
                })
            })
            .catch((error) => {
                console.log(error)
            })
        } catch (error) {
            reject(error)
        }
    })
}
