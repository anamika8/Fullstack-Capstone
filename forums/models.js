"use strict";

const mongoose = require("mongoose");
const { UserSchema } = require("../users/models");

const forumSchema = mongoose.Schema({
    title: 'string',
    content: 'string',
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    posted: { type: Date, default: Date.now },
    comments: [commentSchema]
});


const commentSchema = mongoose.Schema({ content: 'string' });

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
        user: this.user,
        posted: this.created,
        comments: this.comments
    };
};

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
UserSchema.methods.serialize = function () {
    return {
        id: this._id,
        name: this.firstName + " " + this.lastName
    };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
//const Post = mongoose.model("Post", blogSchema);

const User = mongoose.model('User', UserSchema);
const Forum = mongoose.model('Forum', forumSchema);

module.exports = { User, Forum };
