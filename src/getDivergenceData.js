const db = require('./db.js');
const divergence = require('./divergence.js');
const enhanceData = require('./enhanceData.js');
const getSubscriptions = require('./getSubscriptions');
const LeakyBucket = require('leaky-bucket');
const bucket = new LeakyBucket(60);

module.exports = function getDivergenceData() {
    const subscriptions = getSubscriptions();
    const loopTime = (subscriptions.length / 60) * 60000;
    setInterval(function() {
        for (let i = 0; i < subscriptions.length; i++) {
            const key = subscriptions[i].key;
            const item = key.split(':');
            const timeFrame = item[1];
            const pair = item[2];
            const data = {timeFrame, pair};
            bucket.throttle((err) => {
                console.log('Enhance Data'+ new Date().toLocaleString());
                enhanceData(pair, timeFrame)
                .then(() => {
                    return db(data, 'getAllPrices');
                })
                .then((data) => {
                    if (data.length >= 20 && data[0].rsi && data[0].priceSpike && data[0].rsiSpike) {
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
