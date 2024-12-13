import request from 'supertest';
import { describe, it } from 'mocha';
import app from '../app.ts';

let expect: Chai.ExpectStatic;

import './app.test.ts';
import './product.test';
import './auth.test.ts'
import './sqli.test.ts'

const getExpect =  async ()  => {
  const chai = await import('chai');
  expect = chai.expect;
};

describe('GET /', async () => {

  before(async () => {
    await getExpect();
  });

  after(async () => {
    console.log('All tests finished. Shutting down...');
    process.exit(0);
  });


  it('should return a 200 status', (done) => {
    request(app)
      .get('/')
      .end((err: any, res: any) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
