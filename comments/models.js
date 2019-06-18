"use strict";

const mongoose = require("mongoose");


//const commentSchema = mongoose.Schema({ content: 'string' });

const commentSchema = mongoose.Schema({
    content: 'string',
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    forumID: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum' },
    commented: { type: Date, default: Date.now }

});
