const mongoose = require('mongoose');
const db = require('../src/db');
const channelModel = require('../src/model/channel');
const chai = require('chai'),
  should = chai.should,
  expect = chai.expect,
  assert = chai.assert;
const savePrice = require('./savePrice.js');
const MongodbMemoryServer = require('mongodb-memory-server').default;

describe('channel tests', () => {
  before(function(done) {
    mongoServer = new MongodbMemoryServer();
    mongoServer
      .getConnectionString()
      .then((mongoUri) => {
        // instantiate schema
        db(mongoUri);
      })
      .then(() => {
      });
  });
  after(() => {
    mongoose.disconnect();
    mongoServer.stop();
  });
  it('#11. Should result as 1 row when inserting same data', function(done) {
    channelModel.remove({}, function(err) {
      let sampleData = {timeFrame: '1h', pair: 'tEOSUSD', key: 'trade:1h:tEOSUSD', chanId: 1};
      channelModel.setChannel(sampleData);
      channelModel.setChannel(sampleData);
      channelModel.count({}, function(err, currentCount) {
        expect(currentCount).to.equal(1);
          done();
        }).catch((err) => {
          done(err);
        });
    });
  });
  it('#12. Channel should be unique', function(done) {
    channelModel.remove({}, function(err) {
      try {
      let sampleData = {timeFrame: '1h', pair: 'tEOSUSD', key: 'trade:1h:tEOSUSD', chanId: 1};
      channelModel.setChannel(sampleData);
      let sampleData2 = {timeFrame: '2h', pair: 'tEOSUSD', key: 'trade:1h:tEOSUSD', chanId: 1};
      channelModel.setChannel(sampleData2);
      } catch (err) {
        expect(err).to.be(Error);
      }
  });
  });
  it('#13. Channel should result in 2 rows when id is different', function(done) {
    channelModel.remove({}, function(err) {
      let sampleData = {timeFrame: '1h', pair: 'tEOSUSD', key: 'trade:1h:tEOSUSD', chanId: 1};
      channelModel.setChannel(sampleData);
      let sampleData2 = {timeFrame: '2h', pair: 'tEOSUSD', key: 'trade:1h:tEOSUSD', chanId: 2};
      channelModel.setChannel(sampleData2);
      channelModel.count({}, function(err, currentCount) {
        expect(currentCount).to.equal(2);
          done();
        }).catch((err) => {
          done(err);
        });
    });
  });
  });
 });
