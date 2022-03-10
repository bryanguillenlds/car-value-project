import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

//run before each e2e test
global.beforeEach(async () => {
  //try to run this test without handling err
  try {
    //remove the test db file
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});

//run after every e2e test
global.afterEach(async () => {
  //retrieve handle of connection
  const conn = getConnection();
  //close it
  await conn.close();
});
