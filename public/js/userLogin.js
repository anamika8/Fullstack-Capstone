'use strict';

// when user clicks on the Login button
function handleLogin() {
    $('.login-form').submit(function () {
        event.preventDefault();
        hideErrorMessage();
        $.ajax({
            url: '/api/auth/login',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ "email": $('#email').val(), "password": $('#user-password').val() }),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                localStorage.removeItem('loggedInUserEmail');
                // setting the email-id in localStorage, to be later retrieved for posting & seeing posts
                localStorage.setItem("loggedInUserEmail", $('#email').val());
                window.location = "/forum.html";
            },
            error: function (jqXhr, textStatus, errorThrown) {
                let errorToShow = `Incorrect e-mail or password`;
                showErrorMessage(errorToShow);
                console.log(errorThrown);
            }
        });
    })
}

/**
 * Display the error section
 * 
 * @param errorMessage 
 */
function showErrorMessage(errorMessage) {
    $('#errorMessage').html(errorMessage);
    $('#errorMessage').removeClass('hidden');
}

/**
 * Hide the error section
 * 
 * @param errorMessage 
 */
function hideErrorMessage() {
    $('#errorMessage').html("");
    if (!$("#errorMessage").hasClass("hidden")) {
        $('#errorMessage').addClass('hidden');
    }
}

/** 
 * The main function used to handle user login, new post creation,
 * display forum feed and update on existing post
 */
$(function app_main() {
    console.log('User about to login');
    handleLogin();
});