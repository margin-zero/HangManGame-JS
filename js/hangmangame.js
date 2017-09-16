// global variables

var questions,
    categories,
    category_id = -1,
    questions_count = 0,
    errors_left = 5,
    score_total = 0,
    score_won = 0,
    score_lost = 0;
    game_in_progress = false;

// load categories and questions from JSON files

$.getJSON("./questions.json", function(json) {
    questions = json.questions;
});

$.getJSON("./categories.json", function(json) {
    categories = json.categories;
    $.each(categories, function( index, value ) {
        $(".category-list-container").append("<a href='#'>" + value + "</a>");
      });
});


$(document).ready(function() {
    HangManGameEventFunctions();
    HangManGameRun();
});

// functions

function HangManGameRun() {

    HangManGameInit();
    HangManGameRefreshInfo();
    

}

function HangManGameInit() {

    category_id = -1;
    questions_count = 0;
    errors_left = 5;

    // remove answer tiles
    $(".game-table").empty();

    // remove .clicked class from letters
    $(".game-letters>div.clicked").removeClass("clicked");

    // reset score variables
    score_total = 0;
    score_won = 0;
    score_lost = 0;

    //reset game status
    game_in_progress = false;
}


function HangManGameRefreshInfo() {
    $(".game-info>.left>p>a").text(categories[category_id]);
    $(".game-info>.right>p>span").text(errors_left);
    
    $(".game-score span.total").text(score_total);
    $(".game-score span.won").text(score_won);
    $(".game-score span.lost").text(score_lost);

    if (category_id >= 0) {
        $(".game-buttons>a").show();
    }
    else
    {
        $(".game-buttons>a").hide();
    };
}


// assign functions for object events

function HangManGameEventFunctions() {
    
    // click on category name - game screen
    $(".game-info>.left a").click(function() {
        GameCategoryClick($(this));
    });

    $(".category-list-container>a").click(function() {
        CategoryListClick($(this));
    })
}



// definitions of object events functions

function GameCategoryClick($this) {
    $(".category-list").show();
}

function CategoryListClick($this) {
    if (category_id != $($this).index()-1) {
        
        category_id = $($this).index()-1;
        if (game_in_progress) {
            score_total += 1;
            score_lost += 1;
            game_in_progress = false;
        };
        errors_left = 5;
    };
    $(".category-list").hide();

    HangManGameRefreshInfo();
}