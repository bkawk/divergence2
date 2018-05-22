'use strict';
const getSubscriptions = require('./getSubscriptions.js');
const WebSocket = require('ws');
const subscribed = require('./subscribed.js');
const price = require('./price.js');
const LeakyBucket = require('leaky-bucket');

module.exports = function getBitfinexData() {
    const subscriptions = getSubscriptions();
    let bucket = [];
    let bitfinex = [];
    for (let i = 0; i <= 8; ++i) {
        bucket[i] = new LeakyBucket({
            capacity: 1, // Make 1 request
            interval: 20, // Every 10 seconds
            maxWaitingTime: 2040, // > Number of items to process * interval
        });
    }
    for (let i = 0; i <= 8; ++i) {
        bitfinex[i] = new WebSocket('wss://api.bitfinex.com/ws/2');
    }
    for (let i = 0; i <= 8; ++i) {
        bitfinex[i].on('message', (msg) => {
            const message = JSON.parse(msg);
            if (message.event === 'subscribed') {
                subscribed(message);
            } else if (message && message[1] != 'hb' && typeof message[0] != undefined && message[0] != null) {
                price(message);
            }
        });
        bitfinex[i].on('open', () => {
            for (let x = 0; x < subscriptions.length; x++) {
                if (i === 0 && x <= 50) {
                    bucket[i].throttle((err) => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
                if (i === 1 && x > 50 && x <= 100) {
                    bucket[i].throttle((err) => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
                if (i === 2 && x > 100 && x <= 150) {
                    bucket[i].throttle((err) => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
                if (i === 3 && x > 150 && x <= 200) {
                    bucket[i].throttle((err) => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
                if (i === 4 && x > 200 && x <= 250) {
                    bucket[i].throttle((err) => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
                if (i === 5 && x > 250 && x <= 300) {
                    bucket[i].throttle((err) => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
                if (i === 6 && x > 300 && x <= 350) {
                    bucket[i].throttle((err) => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
                if (i === 7 && x > 350 && x <= 408) {
                    bucket[i].throttle((err) => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
            }
        });
        bitfinex[i].on('error', (error) => {
            bitfinex[i] = new WebSocket('wss://api.bitfinex.com/ws/2');
        });
    }
};
