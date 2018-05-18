module.exports = function getDivergenceData(key) {
    return new Promise((resolve, reject) => {
        try {
                            /// _getDivergenceData check to make sure we have 20 records for each of the timeframes * the pairs
                            /// if we have got 20 records then lop over all 20 for both price and rsi, but ignore position 0 and comapre position 1 to i+1
                            // _divergence if we find a divergence determine if its bearish or bullish
                            // _slope check the slopes of the rsi and price to ensure its a true divergence
                            // log divergence if its true
        } catch(error) {
            reject(error)
        }
    })
}