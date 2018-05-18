'use strict';
const getSubscriptions = require('./getSubscriptions');
const getBitfinexData = require('./getBitfinexData');
const enhanceData = require('./enhanceData');

(() => {
    getSubscriptions()
    .then((subscriptions) => {
        return getBitfinexData(subscriptions);
    })
    .catch((error) => {
        console.log(error)
    })
})()