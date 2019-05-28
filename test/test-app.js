'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');


// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');


chai.use(chaiHttp);



