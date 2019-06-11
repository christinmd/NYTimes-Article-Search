//==================================================
//added scroll back to top button:
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("topBtn").style.display = "block";
  } else {
    document.getElementById("topBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//==================================================

var searchTerm;
var numResults;
var startYear;
var endYear;

var pages;
var articleCount;

var resultsDiv = $("#resultsDiv");

var queryUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=2Ze13BVW4XjyIoc8WfpTp3XbdBVnNlds&q=";

function setVariables() {
    searchTerm = $("#searchTerm").val();
    // Checks to make sure the user passed in a value, then calculates the number of pages we'll need to request.
    // Had to add this conditional because, without it, pages would initiate to undefined if the user didn't specify number of results, which
    // was preventing the ajax for loop in the search click handler from running
    if ($("#numResults").val() !== "") {
        numResults = $("#numResults").val();
        // Math.ceil just rounds up (opposite of Math.floor())
        // numResults defaults to 10 in the search on click handler so 'pages' will be 0 if the user inputs 10 or less or nothing at all,
        // which will only run the ajax for loop once
        pages = Math.ceil(numResults / 10) - 1;
    }
    startYear = $("#startYear").val();
    endYear = $("#endYear").val();
}

function buildQueryString() {
    // our API query endpoint URL
    queryUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=2Ze13BVW4XjyIoc8WfpTp3XbdBVnNlds&q=";
    // adds the search term to the end of the url
    queryUrl = queryUrl + searchTerm;
    // adds the start and end year parameters if the user inputs any, otherwise the queryUrl is left alone
    if (startYear !== "") {
        queryUrl = queryUrl + "&begin_date=" + startYear + "0101";
    }
    if (endYear !== "") {
        queryUrl = queryUrl + "&end_date=" + endYear + "1231";
    }
}

// So this function is what was causing us most of our trouble, but the bug was a pretty small one
function populatePage(responseData) {
    // Here, responseData represents the object endpoint, response.response.docs, that we passed in to the populatePage function below.
    // Because response.response.docs is an array, we can use a for of loop to iterate through every index, which allows us to look at
    // each article's object data separately.
    // Initially, when trying to populate the text and attributes of the new elements being created, I had typed 'responseData.web_url', etc.
    // But responseData is an array so it should actually be 'article.web_url' because 'article' is the reference to the object we're currently looking at
    // in the array - and, as Joe likes to say, 'article' could be anything - it could be 'taco' and we would reference taco.web_url
    for (article of responseData) {
        // once we're in the loop, the process is pretty familiar - just creating and appending the appropriate elements with the appropriate data
        var newDiv = $("<div>").addClass("result");
        var newAnchor = $("<a>");
        newAnchor.attr("href", article.web_url);
        newAnchor.attr("target", "_blank");
        var headline = $("<h2>").text(article.headline.main);
        // var headline = $("<h2>").text(articleCount + ": " + article.headline.main);
        newAnchor.append(headline);
        newDiv.append(newAnchor);
        newDiv.append($("<p>").text(article.snippet));
        resultsDiv.append(newDiv);
        articleCount++;
    }
}

// 
$("#search").on("click", function(event) {
    // prevents the page from refreshing when we click the search button, which is the default behavior
    event.preventDefault();
    // clear the resultsDiv and resets our starting data every time we run a new search
    resultsDiv.empty();
    pages = 0;
    numResults = 10;
    articleCount = 1;
    // the rest of the data is set based on what the user passes into the form and is handled in the setVariables function
    setVariables();
    // then we build our API query url with the buildQueryString function, which builds the appropriate query based on the user input
    buildQueryString();
    // we run this for loop because the NYT API returns results in batches of 10 at a time - so if the user wants 40 results, we have to send 4 ajax queries
    // we set the limit of the for loop to 'pages', which is calculated in the setVariables function based on what the user passes in to the 'number of records to retrieve' input
    for (var i = 0; i <= pages; i++) {
        // this tempUrl variable handles the page results issue above by generating a new query url built upon the main queryUrl we build in the buildQueryString function
        var tempUrl = queryUrl + "&page=" + i;
        $.ajax({
            url: tempUrl,
            method: "GET"
        }).then(function (response) {
            // the JSON info returned by our API calls stores the article information in an array called 'docs' so that's what we pass in to the populatePage function
            populatePage(response.response.docs);
        });
    }
});

// removes all of the current results from the page
$("#reset").on("click", function(event) {
    event.preventDefault();
    resultsDiv.empty();
});

