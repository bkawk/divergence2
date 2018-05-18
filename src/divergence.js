module.exports = function divergence(columns) {
    return new Promise((resolve, reject) => {
        columns.forEach((column, i) => {
            if (
                i > 2 &&
                columns[1].priceSpike === 'down' &&
                columns[i].priceSpike === 'down' &&
                columns[1].rsiSpike === 'down' &&
                columns[i].rsiSpike === 'down' &&
                columns[i].close > columns[1].close &&
                columns[i].rsi < columns[1].rsi
            ) {
                console.log(`Bullish Divergence, ${i-1} Period, ${columns[1].pair}, ${columns[1].timeFrame}`)
            } else if (
                i > 2 &&
                columns[1].priceSpike === 'up' &&
                columns[i].priceSpike === 'up' &&
                columns[1].rsiSpike === 'up' &&
                columns[i].rsiSpike === 'up' &&
                columns[i].close < columns[1].close &&
                columns[i].rsi > columns[1].rsi
            ) {
                console.log(`Bearish Divergence, ${i-1} Period, ${columns[1].pair}, ${columns[1].timeFrame}`)
            } else if (
                i > 2 &&
                columns[1].priceSpike === 'down' &&
                columns[i].priceSpike === 'down' &&
                columns[1].rsiSpike === 'down' &&
                columns[i].rsiSpike === 'down' &&
                columns[i].close < columns[1].close &&
                columns[i].rsi > columns[1].rsi
            ){
                console.log(`Positive Reversal, ${i-1} Period, ${columns[1].pair}, ${columns[1].timeFrame}`)
            } else if (
                i > 2 &&
                columns[1].priceSpike === 'up' &&
                columns[i].priceSpike === 'up' &&
                columns[1].rsiSpike === 'up' &&
                columns[i].rsiSpike === 'up' &&
                columns[i].close > columns[1].close &&
                columns[i].rsi < columns[1].rsi
            ){
                console.log(`Negative Reversal, ${i-1} Period, ${columns[1].pair}, ${columns[1].timeFrame}`)
            }
        });
        // _slope check the slopes of the rsi and price to ensure its a true divergence
        // log divergence if its true
    })
}