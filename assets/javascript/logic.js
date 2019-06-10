var numResults;
var pages;
var startYear;
var endYear;
var searchTerm;
var searchArticles = $('#search');
var resetForm = $("#reset");

var resultsDiv = $("#resultsDiv");

var articleCount = 1;

//wait until jQuery and JavaScript loaded before executing:
//$(document).ready(function(){

//console.log("hello world");

var queryUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=2Ze13BVW4XjyIoc8WfpTp3XbdBVnNlds&q=";


function setVariables() {
    searchTerm = $("#searchTerm").val();
    console.log("search term: " + searchTerm);
    numResults = $("#numResults").val();
    console.log("number of results: " + numResults);
    pages = Math.ceil(numResults / 10) - 1;
    startYear = $("#startYear").val();
    console.log("start year: " + startYear);
    endYear = $("#endYear").val();
    console.log("end year: " + endYear);
}

function buildQueryString() {
    queryUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=2Ze13BVW4XjyIoc8WfpTp3XbdBVnNlds&q=";
    queryUrl = queryUrl + searchTerm;
    // TODO: Make sure on the front end the year and numresponses are int values || step attribute in html on the input element
    if (startYear !== "") {
        queryUrl = queryUrl + "&begin_date=" + startYear + "0101";
    }
    if (endYear !== "") {
        queryUrl = queryUrl + "&end_date=" + endYear + "1231";
    }
}

function populatePage(responseData) {
    for (article in responseData) {
        var newDiv = $("<div>").addClass("result");
        var newAnchor = $("<a>").attr("href", responseData.web_url);
        var headline = $("<h2>").text(articleCount + ": " + responseData.headline.main);
        newAnchor.append(headline);
        newDiv.append(newAnchor);
        newDiv.append($("<p>").text(responseData.snippet));
        articleCount++;
    }
}

// assuming the search button is the form submit button

// searchArticles.on({
//     click: function(event) {
//         event.preventDefault();
//       console.log("It worked!");
//     }
// });

searchArticles.on("click", function(event) {
    event.preventDefault();
    resultsDiv.empty();
    setVariables();
    buildQueryString();
    console.log("query url: " + queryUrl);
    for (var i = 0; i <= pages; i++) {
        var tempUrl = queryUrl + "&page=" + i;
        $.ajax({
            url: tempUrl,
            method: "GET"
        }).then(function (response) {
            console.log(JSON.stringify(response));
            // console.log("response: " + response.response.docs);
            // populatePage(response.response.docs);
        });
    }
    // clear form data
});

//})
