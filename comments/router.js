"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

const { Forum } = require("../forums/models");
const { User } = require('../users/models');
const { Comment } = require("./models");

const router = express.Router();


router.use(bodyParser.json());