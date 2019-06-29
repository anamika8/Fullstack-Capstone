'use strict';

let loggedInUserEmail = '';
let forumId = '';

// see an existing post
function showExistingPost() {
    $.ajax({
        url: '/api/forums/' + forumId,
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        processData: false,
        success: function (data, textStatus, jQxhr) {
            populatePostContent(data);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

// update the post
function handleUpdatePost() {
    $('#query-form').submit(function () {
        event.preventDefault();

        const updateForum = {
            title: $("#title").val(),
            content: $("#mt-editor").val(),
            id: forumId
        };

        console.log(JSON.stringify(updateForum));

        $.ajax({
            url: '/api/forums/' + forumId,
            dataType: 'json',
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify(updateForum),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                window.location = "/forum.html";
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    })
}

function populatePostContent(data) {
    $("#title").val(data.title);
    $("#mt-editor").val(data.content);
}

function displayComments() {
    $.ajax({
        url: '/api/comments/' + forumId,
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        processData: false,
        success: function (data, textStatus, jQxhr) {
            populateCommentSection(data);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function populateCommentSection(data) {
    $("#all-comments").empty();

    let allComments = '';
    let numberOfComments = data.comments.length;
    if (numberOfComments == 0) {
        allComments = createAddCommentBox();
    } else {
        let commentArray = data.comments;
        for (let i = 0; i < numberOfComments; i++) {
            let commentInfo = commentArray[i];
            allComments += returnIndividualComment(commentInfo.content);
        }
        allComments += createAddCommentBox();
    }

    $("#all-comments").append(allComments);
}

/**
 * returns the pre-populated comment 
 * @param {*} commentContent 
 */
function returnIndividualComment(commentContent) {
    let returnHTML = `<div class="comment_log colm-4 border">`
        + `<span class="comment">${commentContent}</span>`
        + `</div>`;
    return returnHTML;
}

/**
 * Helps create a box for giving a new comment
 */
function createAddCommentBox() {
    let returnHTML = `<div class="comment_log colm-4 border">`
        + `<input type="text" class="colm-4" id="newComment" placeholder="Write your comment" maxlength="60">`
        + `</div>`;
    return returnHTML;
}

function handlePostComment() {
    $('#all-comments').on('keyup', '#newComment', function (event) {
        // enter button keycode = 13
        if (event.keyCode == 13) {
            let commentInfo = $("#newComment").val();
            postNewComment(commentInfo);
        }
    });
}

function postNewComment(commentInfo) {
    let newCommentBody = {
        user: loggedInUserEmail,
        forum: forumId,
        content: commentInfo
    };
    $.ajax({
        url: '/api/comments',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(newCommentBody),
        processData: false,
        success: function (data, textStatus, jQxhr) {
            location.reload();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

/** 
 * The main function used to handle user login, new post creation,
 * display forum feed and update on existing post
 */
$(function app_main() {
    loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    forumId = localStorage.getItem("forumId");
    console.log(`Waiting for user ${loggedInUserEmail} to update post or give comment`);
    showExistingPost();
    handleUpdatePost();
    displayComments();
    handlePostComment();
});