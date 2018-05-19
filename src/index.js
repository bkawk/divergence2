'use strict';
const getBitfinexData = require('./getBitfinexData');
const getDivergenceData = require('./getDivergenceData');
(() => {
    getBitfinexData();
    getDivergenceData();
})();
