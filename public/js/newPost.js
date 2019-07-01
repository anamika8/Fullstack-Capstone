'use strict';

let loggedInUserEmail = '';

// create a new post
function handleNewPost() {
    $('#query-form').submit(function () {
        event.preventDefault();

        const newForum = {
            title: $("#title").val(),
            content: $("#ck-editor").val(),
            user: localStorage.getItem("loggedInUserEmail")
        };

        console.log(JSON.stringify(newForum));

        $.ajax({
            url: '/api/forums',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(newForum),
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

/** 
 * The main function used to handle user login, new post creation,
 * display forum feed and update on existing post
 */
$(function app_main() {
    loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    console.log(`Waiting for user ${loggedInUserEmail} to create new post`);
    handleNewPost();
});