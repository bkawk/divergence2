'use strict';
const getSubscriptions = require('./getSubscriptions');
const WebSocket = require('ws');
const subscribed = require('./subscribed.js');
const price = require('./price.js');

module.exports = function getBitfinexData() {
    getSubscriptions()
    .then((subscriptions) => {
        const bitfinex = new WebSocket('wss://api.bitfinex.com/ws/2');
        bitfinex.on('message', (msg) => {
            const message = JSON.parse(msg);
            if (message.event === 'subscribed') { 
                subscribed(message);
            } else if (message && message[1] != 'hb' && typeof message[0] != undefined && message[0] != null) {
                price(message);
            }
        });
        bitfinex.on('open', () => {
            subscriptions.forEach((pairs, i) => {
                bitfinex.send(JSON.stringify(subscriptions[i]));
            });
        });
    })
    .catch((error)=>{
        console.log(error);
    });
};
