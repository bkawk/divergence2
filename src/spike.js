'use strict';
/**
 * determines if the soike is up down or none
 * @param {number} dataArray the array to evaluate
 * @param {number} type indicates if the array is price or rsi
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
                    if (i === 0) {
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
            resolve({spikeArray, dataArray});
        } catch (error) {
            reject(error);
        }
    });
};
