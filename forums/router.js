"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

const { Forum } = require("./models");
const { User } = require('../users/models');

const router = express.Router();


router.use(bodyParser.json());

router.get("/", (req, res) => {
    Forum.find()
        .then(res => {
            res.json({
                res: res.map(forum => forum.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});

router.get("/:id", (req, res) => {
    Forum
        .findById(req.params.id)
        .then(forum => res.json(forum.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});

router.post("/", (req, res) => {
    console.log(req.body);
    const requiredFields = ["title", "content", "user"];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    User
        .findOne({ email: req.body.user })
        .then(user => {
            if (user) {
                Forum
                    .create({
                        title: req.body.title,
                        content: req.body.content,
                        user: user._id
                    })
                    .then(forum => Forum.findOne({ _id: forum._id }))
                    .then(forum => res.status(201).json(forum.serialize()))
            } else {
                const message = `User not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});



router.put("/:id", (req, res) => {
    // ensure that the id in the request path and the one in request body match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message =
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).json({ message: message });
    }


    const toUpdate = {};
    const updateableFields = ["title", "content"];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Forum
        // all key/value pairs in toUpdate will be updated -- that's what `$set` does
        .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
        .then(updatedForum => res.status(200).json(updatedForum.serialize()))
        .catch(err => res.status(500).json({ message: "Internal server error" }));
});

router.delete("/:id", (req, res) => {
    Forum.findByIdAndRemove(req.params.id)
        .then(forum => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }));
});


module.exports = { router };

