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
});