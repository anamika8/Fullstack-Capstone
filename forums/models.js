"use strict";

const mongoose = require("mongoose");
//const { UserSchema } = require("../users/models");
const { User } = require('../users/models');

const commentSchema = mongoose.Schema({ content: 'string' });

const forumSchema = mongoose.Schema({
    title: 'string',
    content: 'string',
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    posted: { type: Date, default: Date.now },
    comments: [commentSchema]
});


forumSchema.pre('find', function (next) {
    this.populate('user');
    next();
});

forumSchema.pre('findOne', function (next) {
    this.populate('user');
    next();
});

forumSchema.methods.serialize = function () {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        user: this.user.firstName + " " + this.user.lastName,
        posted: this.created,
        comments: this.comments
    };
};



// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
//const Post = mongoose.model("Post", blogSchema);

//const User = mongoose.model('User', UserSchema);
const Forum = mongoose.model('Forum', forumSchema);

module.exports = { Forum };
