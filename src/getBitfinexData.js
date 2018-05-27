// @ts-check
'use strict';
const getSubscriptions = require('./getSubscriptions.js');
const WebSocket = require('ws');
const subscribed = require('./subscribed.js');
const price = require('./price.js');
const LeakyBucket = require('leaky-bucket');
const socketAssignment = require('./socketAssignment.js');

/**
 * Get data from Bitfinex
 */
module.exports = function getBitfinexData() {
    const subscriptions = getSubscriptions();
    const socketPerConnection = 50;
    const subscriptionGroups = Math.ceil(subscriptions.length / socketPerConnection);
    let bucket = [];
    let bitfinex = [];

    for (let i = 0; i <= subscriptionGroups; ++i) {
        bucket[i] = new LeakyBucket({capacity: 1, interval: 30, maxWaitingTime: subscriptions.length * 30});
        bitfinex[i] = new WebSocket('wss://api.bitfinex.com/ws/2');
        bitfinex[i].on('message', (msg) => {
            const message = JSON.parse(msg.toString());
            if (message.event === 'subscribed') {
                subscribed(message);
            } else if (message && message[1] != 'hb' && typeof message[0] != undefined && message[0] != null) {
                price(message);
            }
        });
        bitfinex[i].on('open', () => {
            for (let x = 0; x < subscriptions.length; x++) {
                if (socketAssignment(i, x)) {
                    bucket[i].throttle(() => {
                        bitfinex[i].send(JSON.stringify(subscriptions[x]));
                    });
                }
            }
            setInterval(function() {
                bitfinex[i].send(JSON.stringify({event: 'ping', cid: new Date().getTime()}));
            }, 3000);
        });
        bitfinex[i].on('error', (error) => {
            process.exit(0);
        });
        bitfinex[i].on('close', () => {
            process.exit(0);
        });
    }
};
