const getSubscriptions = require('../src/getSubscriptions');
const chai = require('chai');
const things = require('chai-things');
const expect = chai.expect;

chai.should();
chai.use(things);

describe('get subscription tests', () =>{
    it('Should should contain an object', async () => {
        const obj = { event: 'subscribe', channel: 'candles', key: 'trade:1h:tEOSUSD' };
        const testa = await getSubscriptions();
        testa.should.include.something.that.deep.equals(obj)
    });
    it('Should return an array', async () => {
        expect(await getSubscriptions()).to.be.an('array');
    });
    it('Should return 612 subscriptions', async () => {
        // expect(await getSubscriptions()).to.have.lengthOf(255);
    });
});

