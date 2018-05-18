const slope = require('./slope.js');
module.exports = function divergence(columns) {
    return new Promise((resolve, reject) => {
        columns.forEach((unused, i) => {
            if (
                i > 2 &&
                columns[1].priceSpike === 'down' &&
                columns[i].priceSpike === 'down' &&
                columns[1].rsiSpike === 'down' &&
                columns[i].rsiSpike === 'down' &&
                columns[i].close > columns[1].close &&
                columns[i].rsi < columns[1].rsi
            ) {
                slope(columns, i, 'Bullish', 'Divergence')
            } else if (
                i > 2 &&
                columns[1].priceSpike === 'up' &&
                columns[i].priceSpike === 'up' &&
                columns[1].rsiSpike === 'up' &&
                columns[i].rsiSpike === 'up' &&
                columns[i].close < columns[1].close &&
                columns[i].rsi > columns[1].rsi
            ) {
                slope(columns, i, 'Bearish', 'Divergence')
            } else if (
                i > 2 &&
                columns[1].priceSpike === 'down' &&
                columns[i].priceSpike === 'down' &&
                columns[1].rsiSpike === 'down' &&
                columns[i].rsiSpike === 'down' &&
                columns[i].close < columns[1].close &&
                columns[i].rsi > columns[1].rsi
            ) {
                slope(columns, i, 'Positive', 'Reversal')
            } else if (
                i > 2 &&
                columns[1].priceSpike === 'up' &&
                columns[i].priceSpike === 'up' &&
                columns[1].rsiSpike === 'up' &&
                columns[i].rsiSpike === 'up' &&
                columns[i].close > columns[1].close &&
                columns[i].rsi < columns[1].rsi
            ) {
                slope(columns, i, 'Negative', 'Reversal')
            }
        });
    })
}