'use strict';
/**
 * get subscriptions
 * @param {number} timeFrames The value to the left of target
 * @param {number} pairs The tagets value
 * @param {number} apiUrl The value to the right of target
 * @return {string} the string indicating direction
 */
module.exports = function subscriptions() {
    return new Promise((resolve, reject) => {
    const timeFrames = ['15m', '30m', '1h', '1D', '7D'];
    const pairs = ['EOSUSD', 'ZRXUSD', 'AIDUSD', 'AIOUSD', 'REPUSD', 'AVTUSD', 'BATUSD', 'BTCUSD', 'BCHUSD', 'BTGUSD', 'BFTUSD', 'CFIUSD', 'DAIUSD', 'DASHUSD', 'MNAUSD', 'ETPUSD', 'EDUUSD', 'ETHUSD', 'EDOUSD', 'ETCUSD', 'FUNUSD', 'GNTUSD', 'IOSUSD', 'IOTAUSD', 'LTCUSD', 'LRCUSD', 'MTNUSD', 'XMRUSD', 'NEOUSD', 'ODEUSD', 'OMGUSD', 'QASHUSD', 'QTUMUSD', 'RCNUSD', 'RDNUSD', 'RRTUSD', 'REQUSD', 'XRPUSD', 'SANUSD', 'SNGUSD', 'AGIUSD', 'SPKUSD', 'SNTUSD', 'DATAUSD', 'TRXUSD', 'TNBUSD', 'WAXUSD', 'YYWUSD', 'ZECUSD', 'ELFUSD', 'RLCUSD'];
        let subscriptions = [];
        timeFrames.forEach((timeFrames) => {
            pairs.forEach((pairs) => {
                const event = 'subscribe';
                const channel = 'candles';
                const key = `trade:${timeFrames}:t${pairs}`;
                subscriptions.push({event, channel, key});
            });
        });
        if (subscriptions.length > 0){
            resolve(subscriptions);
        } else {
            reject('No subscriptions')
        }
    });
};
