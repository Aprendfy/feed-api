import supertest from 'supertest';
import chai from 'chai';
import app from './../../src/app.js';
import UserApp from './../../src/v1/models/admin/user';

global.app = app;
global.expect = chai.expect;
global.request = supertest(app);

global.UserApp = UserApp;