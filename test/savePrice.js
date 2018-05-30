const mongoose = require('mongoose');
const db = require('../src/db');
const priceModel = require('../src/model/price');
const chai = require('chai'),
  should = chai.should,
  expect = chai.expect,
  assert = chai.assert;
const savePrice = require('../src/savePrice.js');
const MongodbMemoryServer = require('mongodb-memory-server').default;

let sameData = [
  [1527394274,
     1,
     2,
     3,
     4,
     100,
    ],
    [
     1527394274,
     1,
     2,
     3,
     4,
     100],
];
let diffData = [
  [
     1527394274,
     1,
     2,
     3,
     4,
     100,
  ],
  [
     1527394275,
     2,
     3,
     4,
     5,
     200,
    ],
];
describe('saveprice tests', () => {
  before(function(done) {
    mongoServer = new MongodbMemoryServer();
    mongoServer
      .getConnectionString()
      .then((mongoUri) => {
        // instantiate schema
        db(mongoUri);
        done();
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
            expect(currentCount).to.equal(2);
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
  it('#1 .Single should insert only 1 row', function(done) {
    priceModel.remove({}, function(err) {
      let price = [
         1527394274,
         1,
         2,
         3,
         4,
         100];
      savePrice('single', 'tWAXUSD', '1h', price).then(()=>{
        priceModel.count({}, function(err, currentCount) {
          expect(currentCount).to.equal(1);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
  });
  it('#2. Single should stay 1 row when inserting the same data', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
           1527394274,
           1,
           2,
           3,
           4,
           100,
        ];
        savePrice('single', 'tWAXUSD', '1h', price).then(()=>{
          savePrice('single', 'tWAXUSD', '1h', price).then(()=>{
            priceModel.count({}, function(err, currentCount) {
              expect(currentCount).to.equal(1);
              done();
            }).catch((err) => {
              done(err);
            });
          });
        });
      });
    });
    it('#3. Single should become 2 row when inserting conditional data', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
           1527394274,
           1,
           2,
           3,
           4,
           100];
        savePrice('single', 'tWAXUSD', '1h', price).then(()=>{
          savePrice('single', 'tWAXUSD', '1h', price).then(()=>{
            price.volume = 200;
            savePrice('single', 'tWAXUSD', '1h', price).then(()=>{
              priceModel.count({}, function(err, currentCount) {
                expect(currentCount).to.equal(2);
                done();
              }).catch((err) => {
                done(err);
              });
            });
          });
        });
      });
    });
    it('#4. Batch should become 2 row when inserting conditional data', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
           1527394274,
           1,
           2,
           3,
           4,
           100,
        ];
        let price2 = [
           1527394274,
           1,
           2,
           3,
           4,
           200,
        ];
        savePrice('single', 'tWAXUSD', '1h', price).then(()=>{
        savePrice('single', 'tWAXUSD', '1h', price).then(()=>{
          savePrice('single', 'tWAXUSD', '1h', price2).then(()=>{
            savePrice('batch', 'tWAXUSD', '1h', [price, price, price2]).then(()=>{
              priceModel.count({}, function(err, currentCount) {
                expect(currentCount).to.equal(2);
                done();
              }).catch((err) => {
                done(err);
              });
            });
          });
        });
        });
      });
    });
    it('#5. Batch should become 2 row when inserting different data', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
           1527394274,
           1,
           2,
           3,
           4,
           100,
        ];
        let price2 = [
           1527394274,
           1,
           2,
           3,
           4,
           200];
        savePrice('batch', 'tWAXUSD', '1h', [price, price2]).then(()=>{
          priceModel.count({}, function(err, currentCount) {
            expect(currentCount).to.equal(2);
            done();
          }).catch((err) => {
            done(err);
          });
        });
      });
    });
    it('#6. Batch should become 3 row when inserting different data', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
           1527394274,
           1,
           2,
           3,
           4,
           100];
        let price2 = [
           1527394275,
           2,
           3,
           4,
           5,
           200];
        let price3 = [
           1527394275,
           3,
           4,
           5,
           6,
           300,
        ];
        savePrice('batch', 'tWAXUSD', '1h', [price, price2, price3]).then(()=>{
          priceModel.count({}, function(err, currentCount) {
            expect(currentCount).to.equal(3);
            done();
          }).catch((err) => {
            done(err);
          });
        });
      });
    });
    it('#7. Batch should become 2 row when inserting different data', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
          [
           1527394274,
           1,
           2,
           3,
           4,
           100,
          ],
          [1527394274,
           1,
           2,
           3,
           4,
           100,
          ],
          [
           1527394275,
           2,
           3,
           4,
           5,
           200,
        ],
      ];
        savePrice('batch', 'tWAXUSD', '1h', price).then(()=>{
          priceModel.count({}, function(err, currentCount) {
            expect(currentCount).to.equal(2);
            done();
          }).catch((err) => {
            done(err);
          });
        });
      });
    });
    it('#8. Batch should become 4 row when inserting different pair', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
          [
           1527394274,
           1,
           2,
           3,
           4,
           100,
          ],
          [
           1527394274,
           1,
           2,
           3,
           4,
           100,
          ],
        [
           1527394275,
           2,
           3,
           4,
           5,
           200,
        ]];
        savePrice('batch', 'tWAXUSD', '1h', price).then(()=>{
          savePrice('batch', 'tEOSUSD', '1h', price).then(()=>{
            priceModel.count({}, function(err, currentCount) {
              expect(currentCount).to.equal(4);
              done();
            }).catch((err) => {
              done(err);
            });
          });
        });
      });
    });
    it('#9. Spelling mistake should throw an error', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
           1527394274,
           1,
           2,
           3,
           4,
           100,
        ];
        try {
        savePrice('spellingMistake', 'tWAXUSD', '1h', price);
        } catch (err) {
          expect(err).to.be(TypeError);
        };
      });
    });
    it('#10. Missing volume should throw an error', function(done) {
      priceModel.remove({}, function(err) {
        let price = [
           1527394274,
           1,
           2,
           3,
           4,
        ];
        try {
        savePrice('single', 'tWAXUSD', '1h', price);
        } catch (err) {
          expect(err).to.be(TypeError);
        }
      });
    });
});
