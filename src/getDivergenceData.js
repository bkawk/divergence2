const db = require('./db.js');
const divergence = require('./divergence.js');
const enhanceData = require('./enhanceData.js');
const getSubscriptions = require('./getSubscriptions');
const memwatch = require('memwatch-next');
const util = require('util');
// Take first snapshot
let hd = new memwatch.HeapDiff();
module.exports = function getDivergenceData() {
    getSubscriptions()
    .then((subscriptions)=>{
        setInterval(function() {
            subscriptions.forEach((msg) => {
                const key = msg.key;
                const item = key.split(':');
                const timeFrame = item[1];
                const pair = item[2];
                const data = {timeFrame, pair};
                enhanceData(pair, timeFrame)
                .then(() => {
                    return db(data, 'getAllPrices');
                })
                .then((data)=>{
                    if (data.length >= 20 && data[0].rsi && data[0].priceSpike && data[0].rsiSpike) {
                        const divergenceData = data.splice(0, 20);
                        divergence(divergenceData)
                        .catch((error)=>{
                            console.log(error);
                        });
                    }
                })
                .catch((error)=>{
                    console.log(error);
                });
            });
             // Take the second snapshot and compute the diff
        let diff = hd.end();
        console.log(util.inspect(diff, {showHidden: false, depth: 4}));
        }, 10000);
    });
};
