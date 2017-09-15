// global variables

var questions,
    categories,
    category_id = -1,
    questions_count,
    errors_left = 5;

// load categories and questions from JSON files

$.getJSON("./questions.json", function(json) {
    questions = json.questions;
});

$.getJSON("./categories.json", function(json) {
    categories = json.categories;
});


$(document).ready(function() {
    HangManGameRun();
});

// functions

function HangManGameRun() {

    HangManResetVariables();
    
    $(".game-info>.left>p>a").text(categories[category_id]);
    $(".game-info>.right>p>span").text(errors_left);
    
}

function HangManResetVariables() {

    category_id = -1;
    errors_left = 5;

    
}





 