"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

const { Forum } = require("./models");

const config = require('../config');
const router = express.Router();


router.use(bodyParser.json());

router.get("/", (req, res) => {
    Forum.find()
        .then(res => {
            res.json({
                res: res.map(forum => forum.serialize())
            });
        })

});

module.exports = { router };

