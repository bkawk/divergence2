const mongoose = require('mongoose');
const db = require('../src/db');
const priceModel = require('../src/model/price');
const chai = require('chai'),
  should = chai.should,
  expect = chai.expect,
  assert = chai.assert;
const savePrice = require('./savePrice.js');
const MongodbMemoryServer = require('mongodb-memory-server').default;

let sameData = [
  {
    pair: 'tZECUSD',
    timeFrame: '3h',
    open: 247.53,
    close: 243.38,
    high: 248.85,
    low: 242.61,
    volume: 1673.40821406,
    localTime: '2018-05-28T13:00:00+07:00',
    time: '2018-05-28T06:00:00.000Z',
    __v: 0,
  },
  {
    pair: 'tZECUSD',
    timeFrame: '3h',
    open: 276.97,
    close: 277.7,
    high: 277.7,
    low: 274.16,
    volume: 417.85088349,
    localTime: '2018-05-26T10:00:00+07:00',
    time: '2018-05-26T03:00:00.000Z',
    __v: 0,
  },
];
let diffData = [
  {
    pair: 'tZECUSD',
    timeFrame: '3h',
    open: 247.54,
    close: 243.39,
    high: 248.86,
    low: 242.62,
    volume: 1674.40821406,
    localTime: '2019-05-28T13:00:00+07:00',
    time: '2019-05-28T06:00:00.000Z',
  },
  {
    pair: 'tZECUSD',
    timeFrame: '3h',
    open: 216.97,
    close: 177.7,
    high: 177.7,
    low: 174.16,
    volume: 117.85088349,
    localTime: '2019-05-26T10:00:00+07:00',
    time: '2019-05-26T03:00:00.000Z',
  },
];
describe('saveprice tests', () => {
  before(function(done) {
    mongoServer = new MongodbMemoryServer();
    mongoServer
      .getConnectionString()
      .then((mongoUri) => {
        // instantiate schema
        db(mongoUri);
      })
      .then(() => {
        // insert fake data
        priceModel
          .insertMany(sameData)
          .then((results) => {
            done();
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });
  after(() => {
    mongoose.disconnect();
    mongoServer.stop();
  });
  it('Should stay 2 rows when records are the same', function(done) {
    priceModel.count({}, function(err, originalCount) {
      priceModel
        .insertMany(sameData)
        .then(() => {
          priceModel.count({}, function(err, currentCount) {
            expect(currentCount).to.equal(originalCount);
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  it('Should add 2 rows when records are not the same', function(done) {
    priceModel.count({}, function(err, originalCount) {
      priceModel
        .insertMany(diffData)
        .then(() => {
          priceModel.count({}, function(err, currentCount) {
            expect(currentCount).to.equal(originalCount + 2);
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  it('Single should insert only 1 row', function() {
    priceModel.remove({}, function(err) {
      let price = {
        close: 10.774,
        high: 10.898,
        localTime: '2018-05-29T13:15:00+07:00',
        low: 10.701,
        open: 10.797,
        pair: 'tWAXUSD',
        time: 1527394274,
        timeFrame: '15m',
        volume: 398951.93591716,
      };
      savePrice('single', 'tWAXUSD', '1h', price);
      priceModel.count({}, function(err, currentCount) {
        expect(currentCount).to.equal(1);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  it('Single should stay 1 row when inserting the same data', function() {
      priceModel.remove({}, function(err) {
        let price = {
          close: 10.774,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        savePrice('single', 'tWAXUSD', '1h', price);
        savePrice('single', 'tWAXUSD', '1h', price);
        
        priceModel.count({}, function(err, currentCount) {
          expect(currentCount).to.equal(1);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
    it('Single should become 2 row when inserting conditional data', function() {
      priceModel.remove({}, function(err) {
        let price = {
          close: 10.774,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        savePrice('single', 'tWAXUSD', '1h', price);
        savePrice('single', 'tWAXUSD', '1h', price);
        price.close = 200;
        savePrice('single', 'tWAXUSD', '1h', price);
        priceModel.count({}, function(err, currentCount) {
          expect(currentCount).to.equal(2);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
    it('Batch should become 2 row when inserting conditional data', function() {
      priceModel.remove({}, function(err) {
        let price = {
          close: 10.774,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        let price2 = {
          close: 200,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        savePrice('single', 'tWAXUSD', '1h', price);
        savePrice('single', 'tWAXUSD', '1h', price);
        savePrice('single', 'tWAXUSD', '1h', price2);
        savePrice('batch', 'tWAXUSD', '1h', [price, price2]);
        priceModel.count({}, function(err, currentCount) {
          expect(currentCount).to.equal(2);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
    it('Batch should become 2 row when inserting different data', function() {
      priceModel.remove({}, function(err) {
        let price = {
          close: 10.774,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        let price2 = {
          close: 200,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        savePrice('batch', 'tWAXUSD', '1h', [price, price2]);
        priceModel.count({}, function(err, currentCount) {
          expect(currentCount).to.equal(2);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
    it('Batch should become 3 row when inserting different data', function() {
      priceModel.remove({}, function(err) {
        let price = {
          close: 10.774,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        let price2 = {
          close: 200,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        let price3 = {
          close: 300,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        savePrice('batch', 'tWAXUSD', '1h', [price, price2, price3]);
        priceModel.count({}, function(err, currentCount) {
          expect(currentCount).to.equal(3);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
    it('Batch should become 2 row when inserting different time and close data', function() {
      priceModel.remove({}, function(err) {
        let price = {
          close: 10.774,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        let price2 = {
          close: 200,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394275,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        savePrice('batch', 'tWAXUSD', '1h', [price, price2]);
        priceModel.count({}, function(err, currentCount) {
          expect(currentCount).to.equal(2);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
    it('#8. Batch should become 4 row when inserting different data', function() {
      priceModel.remove({}, function(err) {
        let price = [{
          close: 100,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        },
        {
          close: 100,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        },
        {
          close: 200,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394275,
          timeFrame: '15m',
          volume: 398951.93591716,
        }];
        savePrice('batch', 'tWAXUSD', '1h', price);
        savePrice('batch', 'tWAXUSD', '1h', price);
        priceModel.count({}, function(err, currentCount) {
          expect(currentCount).to.equal(4);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
    it('#9. Spelling mistake should throw an error', function() {
      priceModel.remove({}, function(err) {
        let price = {
          close: 100,
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        try {
        savePrice('spellingMistake', 'tWAXUSD', '1h', price);
        } catch (err) {
          expect(err).to.be(TypeError);
        }
        // priceModel.count({}, function(err, currentCount) {
        //   expect(currentCount).to.equal(2);
        //   done();
        // }).catch((err) => {
        //   done(err);
        // });
      });
    });
    it('#10. Missing close price should throw an error', function() {
      priceModel.remove({}, function(err) {
        let price = {
          high: 10.898,
          localTime: '2018-05-29T13:15:00+07:00',
          low: 10.701,
          open: 10.797,
          pair: 'tWAXUSD',
          time: 1527394274,
          timeFrame: '15m',
          volume: 398951.93591716,
        };
        try {
        savePrice('single', 'tWAXUSD', '1h', price);
        } catch (err) {
          expect(err).to.be(TypeError);
        }
        // priceModel.count({}, function(err, currentCount) {
        //   expect(currentCount).to.equal(2);
        //   done();
        // }).catch((err) => {
        //   done(err);
        // });
      });
    });
});
