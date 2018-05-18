'use strict';
const getSubscriptions = require('./getSubscriptions');
const getBitfinexData = require('./getBitfinexData');
const enhanceData = require('./enhanceData');
const getDivergenceData = require('./getDivergenceData');

(() => {
    getSubscriptions()
    .then((subscriptions) => {
        getBitfinexData(subscriptions);
        getDivergenceData(subscriptions)
    })
    .catch((error) => {
        console.log(error)
    })

    
})()