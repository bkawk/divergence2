const WebSocket = require('ws');
const moment = require('moment');
const getChannel = require('./getChannel.js');
const db = require('./db.js');

module.exports = function getBitfinexData(subscriptions) {
    return new Promise((resolve, reject) => {
        try {
            function subscribed(msg) {
                const key = msg.key;
                const item = key.split(':');
                const timeFrame = item[1];
                const pair = item[2];
                const chanId = msg.chanId;
                const data = {timeFrame, pair, key, chanId};
                db(data, 'setChannel')
                .catch((error) => {
                    console.log(error);
                });
            }
            function price(msg) {
                if (msg && typeof msg[0] != undefined && msg[0] != null) {
                    let data = msg[1];
                    db(msg[0], 'getChannel')
                    .then((data)=>{
                        if (data && data.key) {
                            return getChannel(data.key);
                        }
                    })
                    .then((channel)=>{
                        if (channel && data && data.length > 6) {
                            data.forEach((price, i) => {
                                savePrice(channel.pair, channel.timeFrame, price);
                            });
                        } else if (channel) {
                            savePrice(channel.pair, channel.timeFrame, data);
                        }
                    })
                    .catch((error)=>{
                        reject(error);
                    });
                }
            }
            function savePrice(pair, timeFrame, price) {
                let time = price[0];
                let open = price[1];
                let close = price[2];
                let high = price[3];
                let low = price[4];
                let volume = price[5];
                let localTime = moment(time).format();
                let data = {pair, timeFrame, open, close, high, low, volume, localTime, time};
                db(data, 'setPrice')
                .catch((error)=>{
                    console.log(error);
                });
            }

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
        } catch (error) {
            reject(error);
        }
    });
};
