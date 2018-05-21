'use strict';
const getBitfinexData = require('./getBitfinexData');
const getDivergenceData = require('./getDivergenceData');
const memwatch = require('memwatch-next');
memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
  });
(() => {
    getBitfinexData();
    getDivergenceData();
})();
