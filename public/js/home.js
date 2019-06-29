'use strict';

let loggedInUserEmail = '';
let feedIndexStartWith = 0;
let feedDataArray = '';
let feedIndexKey = "feedIndex";

// view latest posts when first enter into the home page
function viewRecentPosts() {
    $.ajax({
        url: '/api/forums',
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        processData: false,
        success: function (data, textStatus, jQxhr) {
            buildFirstPageFeed(data);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

// when next button is clicked
function goToNextPage() {
    $('#next').click(function () {
        feedIndexStartWith = parseInt(localStorage.getItem(feedIndexKey)) + 3;
        localStorage.setItem(feedIndexKey, feedIndexStartWith);
        // "prev" button must be made active
        if ($("#prev").hasClass('inactiveLink')) {
            $("#prev").removeClass('inactiveLink');
        }
        buildAnyPageFeed(feedDataArray, feedIndexStartWith);
    });
}

// when next button is clicked
function goToPrevPage() {
    $('#prev').click(function () {
        feedIndexStartWith = parseInt(localStorage.getItem(feedIndexKey)) - 3;
        localStorage.setItem(feedIndexKey, feedIndexStartWith);
        // "next" button must be made active
        if ($("#next").hasClass('inactiveLink')) {
            $("#next").removeClass('inactiveLink');
        }
        buildAnyPageFeed(feedDataArray, feedIndexStartWith);
    });
}

/**
 * Helps build the first page feed
 * 
 * @param {*} data 
 */
function buildFirstPageFeed(data) {
    feedDataArray = data["forums"];
    localStorage.setItem(feedIndexKey, 0);

    // next calling the common build feed page
    buildAnyPageFeed(feedDataArray, 0);
}

/**
 * Helps build any page feed
 * 
 * @param {*} feedDataArray -- all feed data
 * @param {*} startIndex  -- start index
 */
function buildAnyPageFeed(feedDataArray, startIndex) {
    let numberOfPosts = feedDataArray.length;
    // first emptying the 'allFeed' section
    $('#allFeed').empty();

    let endIndex = startIndex + 3;
    if (numberOfPosts <= endIndex) {
        endIndex = numberOfPosts;
        // since this page is the last page, the 'next' button should be disabled
        $("#next").addClass('inactiveLink');
    }
    if (startIndex == 0) {
        // since this page is the first page, the 'prev' button should be disabled
        $("#prev").addClass('inactiveLink');
    }
    let feedHTML = '';
    for (let i = startIndex; i < endIndex; i++) {
        console.log(i);
        let forumData = feedDataArray[i];
        feedHTML = feedHTML + buildEveryFeedItem(forumData);
    }
    $('#allFeed').append(feedHTML);
}

/**
 * returns HTML of any single feed item
 * 
 * @param {*} forumData 
 */
function buildEveryFeedItem(forumData) {
    let forumID = forumData.id;
    let title = forumData.title;
    let content = '';
    if (forumData.content.length > 100) {
        let wholeContent = forumData.content;
        content = wholeContent.substr(0, 100) + '...';
    } else {
        content = forumData.content;
    }

    let returnHTML = `<div class="post_log colm-4 border">`
        + `<span class="result">Title: ${title}</span>`
        + `<span class="result">Content: ${content}</span>`
        + `<a class="more-details" id="${forumID}">Learn More</a>`
        + `</div>`;

    return returnHTML;
}

// handles search
function handleSearch() {
    $('#search-icon').click(function () {
        feedIndexStartWith = 0;
        localStorage.setItem(feedIndexKey, feedIndexStartWith);
        // get the search text and trigger search
        let searchText = $("#search").val();
        triggerSearch(searchText);
        buildAnyPageFeed(feedDataArray, feedIndexStartWith);
    });
}

function triggerSearch(searchText) {
    if (searchText.trim() == '') {
        location.reload();
        return;
    }
    $.ajax({
        url: '/api/forums/topics?title=' + searchText,
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        processData: false,
        success: function (data, textStatus, jQxhr) {
            buildFirstPageFeed(data);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function handleMoreInfoLink() {
    $('#allFeed').on('click', '.more-details', function (event) {
        localStorage.setItem("forumId", $(this).attr('id'));
        console.log("Details page forum id: " + $(this).attr('id'));
        window.location = "/update-forum.html";
    });
}

/** 
 * The main function used to handle user login, new post creation,
 * display forum feed and update on existing post
 */
$(function handleHomePage() {
    loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    console.log(`Waiting for user ${loggedInUserEmail} to check out her home page`);
    viewRecentPosts();
    goToNextPage();
    goToPrevPage();
    handleSearch();
    handleMoreInfoLink();
});