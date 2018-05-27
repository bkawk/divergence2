// @ts-check
'use strict';
const getSubscriptions = require('./getSubscriptions');
const LeakyBucket = require('leaky-bucket');
const enhanceData = require('./enhanceData.js');
const divergence = require('./divergence.js');
// models
const priceModel = require('./model/price');

/**
 * getDivergenceData
 */
function getDivergenceData() {
    const subscriptions = getSubscriptions();
    const capacity = 10;
    const interval = 0.5;
    const maxWaitingTime = subscriptions.length * interval;
    const loopTime = maxWaitingTime * 1000;
    const bucket = new LeakyBucket({capacity, interval, maxWaitingTime});
    setInterval(() => {
        for (let i = 0; i < subscriptions.length; i++) {
            const key = subscriptions[i].key;
            const item = key.split(':');
            const timeFrame = item[1];
            const pair = item[2];
            const data = {timeFrame, pair};
            bucket.throttle(() => {
                enhanceData(pair, timeFrame)
                .then(() => {
                    return priceModel.getAllPrices(data);
                })
                .then((data) => {
                    if (data && data.length >= 20 && data[0].rsi && data[0].priceSpike && data[0].rsiSpike) {
                        const divergenceData = data.splice(0, 20);
                        divergence(divergenceData)
                        .catch((error) => {
                            console.log(error);
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            });
        }
    }, loopTime);
};
export {
    getDivergenceData,
};
