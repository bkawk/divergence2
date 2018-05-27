// @ts-check
'use strict';
const channelModel = require('./model/channel');
/**
 * Saves the channel data we get from bitfinex after subscribing
 * @param {Object} msg The array of prices to create the RSI from
 */
function subscribed(msg) {
    const key = msg.key;
    const chanId = msg.chanId;
    const item = key.split(':');
    const timeFrame = item[1];
    const pair = item[2];
    const data = {timeFrame, pair, key, chanId};
    channelModel.setChannel(data)
    .catch((error) => {
        console.log(error);
    });
};
export {
    subscribed,
};
