// @ts-check
'use strict';
const getSubscriptions = require('./getSubscriptions.js');
const WebSocket = require('ws');
const subscribed = require('./subscribed.js');
const price = require('./price.js');
const LeakyBucket = require('leaky-bucket');

module.exports = function getBitfinexData() {
    const subscriptions = getSubscriptions();
    const socketPerConnection = 50;
    const subscriptionGroups = Math.ceil(subscriptions.length / socketPerConnection);
    const capacity = 1;
    const interval = 20;
    const maxWaitingTime = subscriptions.length * interval;
    let bucket = [];
    let bitfinex = [];

       /**
     * get subscriptions
     * @param {number} i The value to the left of target
     * @param {number} x The tagets value
     * @return {boolean} the string indicating direction
     */
    function socketJob(i, x) {
        return ((i === 0 && x <= 50) ||
            (i === 1 && x > 50 && x <= 100) ||
            (i === 2 && x > 100 && x <= 150) ||
            (i === 3 && x > 150 && x <= 200) ||
            (i === 4 && x > 200 && x <= 250) ||
            (i === 5 && x > 250 && x <= 300) ||
            (i === 6 && x > 300 && x <= 350) ||
            (i === 7 && x > 350 && x <= 450)
        );
    }

    for (let i = 0; i <= subscriptionGroups; ++i) {
        bucket[i] = new LeakyBucket({capacity, interval, maxWaitingTime});
        bitfinex[i] = new WebSocket('wss://api.bitfinex.com/ws/2');
        bitfinex[i].on('message', (msg) => {
            const message = JSON.parse(msg);
            if (message.event === 'subscribed') {
                subscribed(message);
            } else if (message && message[1] != 'hb' && typeof message[0] != undefined && message[0] != null) {
                price(message, i);
            } else if (message.event === 'info') {
                if (message.code == 20051 || message.code == 20061 ) {
                    // getBitfinexData();
                }
            }
        });
        bitfinex[i].on('open', () => {
            for (let x = 0; x < subscriptions.length; x++) {
                if (socketJob(i, x)) {
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
            console.log('ERROR' + error);
            bitfinex[i].close();
        });
        bitfinex[i].on('close', () => {
            setTimeout(() => {
                console.log('PM2 Will restart in 30 seconds');
                process.exit(0);
            }, 30000);
        });
    }
};
