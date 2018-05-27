// @ts-check
'use strict';
import {getDivergenceData} from './getDivergenceData';
// const memwatch = require('memwatch-next');
// memwatch.on('leak', (info) => {
//     console.error('Memory leak detected:\n', info);
//     process.exit(0);
// });

setTimeout(function() {
    getDivergenceData();
// }, 1026000);
}, 6000);
