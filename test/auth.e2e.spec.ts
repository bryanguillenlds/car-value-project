import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication; //instance of a nest app

  //before each e2e test, create a testing module
  //importing the main app module
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    //create a nest app using the module
    app = moduleFixture.createNestApplication();
    //initialize the app to start listeing to reqs
    await app.init();
  });

  it('handles signup request', () => {
    const testEmail = 'test@test.com';
    return request(app.getHttpServer()) //get server
      .post('/auth/signup') //attempt req
      .send({ testEmail, password: '123' }) //body of req
      .expect(201) //expect created status
      .then((res) => {
        //handle response
        const { id, email } = res.body; //get body
        expect(id).toBeDefined();
        expect(email).toEqual(testEmail);
      });
  });

  it('signup as new user and get currently logged in user', async () => {
    const testEmail = 'test2@test.com';
    const res = await request(app.getHttpServer()) //get server
      .post('/auth/signup') //attempt post req
      .send({ testEmail, password: '123' }) //send body of req
      .expect(201); //expect created status

    const cookie = res.get('Set-Cookie'); //get the cookie header

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami') //attempt get req
      .set('Cookie', cookie) //set cookie header
      .expect(200); //expect successful response

    expect(body.email).toEqual(testEmail); //Expect emails to match
  });
});
