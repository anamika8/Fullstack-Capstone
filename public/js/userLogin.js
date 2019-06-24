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
                alert(JSON.stringify(data));
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    })
}

/**
 * The main function used to handle user login.
 */
$(function handleLoginPage() {
    console.log('Login page ready. Waiting for user to login');
    handleLogin();
});