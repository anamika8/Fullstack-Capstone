'use strict';

// when user clicks on the Login button
function handleSignup() {
    $('.signup-form').submit(function () {
        event.preventDefault();
        hideErrorMessage();

        // verify password and verify-password fields are same
        if ($('#user-password').val() != $('#verify-password').val()) {
            let newHTMLValues = `<strong>Password abd Verify Password fields do not match!</strong>`;
            showErrorMessage(newHTMLValues);
        }

        // capture the signup data
        const newUser = {
            email: $('#email').val(),
            password: $('#user-password').val(),
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
        };

        $.ajax({
            url: '/api/users',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(newUser),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                window.location = "/login.html";
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
                showErrorMessage(errorThrown);
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
    $('#errorMessage').html(newHTMLValues);
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
 * The main function used to handle user login.
 */
$(function handleSignupPage() {
    console.log('Signup page ready. Waiting for user to signup');
    handleSignup();
});