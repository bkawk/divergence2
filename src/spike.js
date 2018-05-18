'use strict';
/**
 * get subscriptions
 * @param {number} timeFrames The value to the left of target
 * @param {number} pairs The tagets value
 * @param {number} apiUrl The value to the right of target
 * @return {string} the string indicating direction
 */
module.exports = function spike(dataArray, type) {
    return new Promise((resolve, reject) => {
        try {
            let spikeArray = [];
            dataArray.forEach((entry, i) => {
                if (type === 'price') {
                    if (i === 0) {
                        spikeArray.push('none');
                    } else if (i < (dataArray.length-15)) {
                        const right = dataArray[i-1].close;
                        const target = dataArray[i].close;
                        const left = dataArray[i+1].close;
                        if (target > left && target > right) {
                            spikeArray.push('up');
                        } else if (target < left && target < right) {
                            spikeArray.push('down');
                        } else {
                            spikeArray.push('none');
                        }
                    } else if (i === (dataArray.length-15)) {
                        spikeArray.push('none');
                    }
                }
                if (type === 'rsi') {
                    if(i === 0){
                        spikeArray.push('none');
                    } else if (i < (dataArray.length)) {
                        const right = dataArray[i-1];
                        const target = dataArray[i];
                        const left = dataArray[i+1];
                        if (target > left && target > right) {
                            spikeArray.push('up');
                        } else if (target < left && target < right) {
                            spikeArray.push('down');
                        } else {
                            spikeArray.push('none');
                        }
                    } 
                }
            });
            resolve({spikeArray, dataArray})
        } catch(error) {
            reject(error)
        }
    })
}
