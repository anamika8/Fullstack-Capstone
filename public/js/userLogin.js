'use strict';


// when user clicks on the Login button
function handleLogin() {
    $('.login-form').submit(function () {
        event.preventDefault();
        $.ajax({
            url: '/api/auth/login',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ "email": $('#email').val(), "password": $('#user-password').val() }),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                window.location = "/forum.html";
                // setting the email-id in localStorage, to be later retrieved for posting & seeing posts
                localStorage.setItem("loggedInUserEmail", $('#email').val());
                console.log(`User ${loggedInUserEmail} is logged in`);
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
    console.log('User about to login');
    handleLogin();
});