"use strict";

const mongoose = require("mongoose");

const forumSchema = mongoose.Schema({
    title: 'string',
    content: 'string',
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    posted: { type: Date, default: Date.now },
    updated: { type: Date }
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
        posted: this.posted,
        updated: this.updated
    };
};

const Forum = mongoose.model('Forum', forumSchema);

module.exports = { Forum };
