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


router.get("/", (req, res) => {
    Comment.find()
        .then(comments => {
            res.json({
                comments: comments.map(comment => comment.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});

// get comments by forum-id
router.get("/:id", (req, res) => {

    Forum
        .findById(req.params.id)
        .then(forums => {
            if (forums) {
                Comment
                    .find({ forum: forums._id })
                    .then(comments => {
                        res.json({
                            comments: comments.map(comment => comment.serialize())
                        });
                    })
            } else {
                const message = `Post does not exist`;
                console.error(message);
                return res.status(400).send(message);
            }
        });
});

router.post("/", (req, res) => {
    console.log(req.body);
    const requiredFields = ["content", "user", "forum"];
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
                    .findOne({ _id: req.body.forum })
                    .then(forum => {
                        if (forum) {
                            Comment
                                .create({
                                    content: req.body.content,
                                    user: user._id,
                                    forum: forum._id
                                })
                                .then(comment => Comment.findOne({ _id: comment._id }))
                                .then(comment => res.status(201).json(comment.serialize()))
                        } else {
                            const message = `Posts does not exist`;
                            console.error(message);
                            return res.status(400).send(message);
                        }
                    })
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

module.exports = { router };

