const WebSocket = require('ws');
const db = require('./db.js');
const subscribed = require('./subscribed.js');
const price = require('./price.js');
const getSubscriptions = require('./getSubscriptions');

module.exports = function getBitfinexData() {
    try {
        getSubscriptions()
        .then((subscriptions)=>{
            const w = new WebSocket('wss://api.bitfinex.com/ws/2');
            w.on('message', (_msg) => {
                const msg = JSON.parse(_msg);
                if (msg.event === 'subscribed') {
                    subscribed(msg);
                } else if (msg[1] != 'hb') {
                    price(msg);
                }
            });
            w.on('open', () => {
                subscriptions.forEach((pairs, i) => {
                    w.send(JSON.stringify(subscriptions[i]));
                });
            });
        })
    } catch (error) {
        console.log(error);
    }
};
