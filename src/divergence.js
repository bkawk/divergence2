const db = require('./db.js');
const divergence = require('./divergence.js');
module.exports = function divergence(data) {
    return new Promise((resolve, reject) => {
        /// if we have got 20 records then lop over all 20 for both price and rsi, but ignore position 0 and comapre position 1 to i+1
        // _divergence if we find a divergence determine if its bearish or bullish
        // _slope check the slopes of the rsi and price to ensure its a true divergence
        // log divergence if its true
    })
}