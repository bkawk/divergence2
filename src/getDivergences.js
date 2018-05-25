// @ts-check
'use strict';
const getDivergenceData = require('./getDivergenceData');
// const memwatch = require('memwatch-next');
// memwatch.on('leak', (info) => {
//     console.error('Memory leak detected:\n', info);
//     process.exit(0);
// });

setTimeout(function() {
    console.log('========================= Starting to find divergences!')
    getDivergenceData();
// }, 1026000);
}, 6000);
