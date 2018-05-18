const db = require('./db.js');
const divergence = require('./divergence.js');
module.exports = function getDivergenceData(subscriptions) {
    return new Promise((resolve, reject) => {
        console.log('starting ')
        setInterval(function(){ 
            console.log('Checking Data for rsi');
            subscriptions.forEach(msg => {
                const key = msg.key;
                const item = key.split(':');
                const timeFrame = item[1];
                const pair = item[2];
                const data = {timeFrame, pair}
                db(data, 'getAllPrices')
                .then((data)=>{
                    if (data.length >= 20 && data[0].rsi && data[0].priceSpike && data[0].rsiSpike){
                        divergence(data)
                    }
                })
            });
        }, 10000);
    })
}