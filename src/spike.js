// @ts-check
'use strict';
/**
 * determines if the soike is up down or none
 * @param {Array} dataArray the array to evaluate
 * @param {string} types indicates if the array is price or rsi
 * @return {Object} the string indicating direction
 */
function spike(dataArray, types) {
    return new Promise((resolve, reject) => {
        let spikeArray = [];
        dataArray.forEach((entry, i) => {
            if (types === 'price') {
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
            if (types === 'rsi') {
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
    });
};
export {
    spike,
};
