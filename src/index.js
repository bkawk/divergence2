'use strict';
const getSubscriptions = require('./getSubscriptions');
const getBitfinexData = require('./getBitfinexData');
const getDivergenceData = require('./getDivergenceData');
(() => {
    getSubscriptions()
    .then((subscriptions) => {
        getBitfinexData(subscriptions);
        getDivergenceData(subscriptions);
    })
    .catch((error) => {
        console.log(error);
    });
})();
