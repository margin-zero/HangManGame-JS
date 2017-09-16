// global variables

var questions,
    categories,
    current_questions = [],
    question_id = 0,
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

    // remove answer tiles
    $(".game-table").empty();

    // remove .clicked class from letters
    $(".game-letters>div.clicked").removeClass("clicked");

    //reset game status
    game_in_progress = false;
}


function HangManGameRefreshInfo() {
    if (category_id>=0) {
        $(".game-info>.left>p>a").text(categories[category_id] + " - (" + current_questions.length +")");
    };
    
    $(".game-info>.right>p>span").text(errors_left);
    
    $(".game-score span.total").text(score_total);
    $(".game-score span.won").text(score_won);
    $(".game-score span.lost").text(score_lost);

    if ((question_id) < questions_count) {
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
        GameCategoryClick();
    });

    // click on category name - category list
    $(".category-list-container>a").click(function() {
        CategoryListClick($(this));
    })

    // click on "new game" button
    $(".game-buttons>a").click(function() {
        NewGameClick($(this));
    })

    // click on letter
    $(".game-letters>div").click(function() {
        GameLetterClick($(this));
    })
}



// definitions of object events functions

function GameCategoryClick() {
    $(".category-list").show();
}

function CategoryListClick($this) {

    if (category_id != $($this).index()-1) {
        current_questions = [];
        category_id = $($this).index()-1;
        score_total = 0;
        score_lost = 0;
        score_won = 0;
        game_in_progress = false;
        
        errors_left = 5;
        question_id = 0;
        questions_count = 0;

        $.each(questions, function( index, value ) {

            if (value.category==categories[category_id]) {
                questions_count += 1;
                current_questions.push(value.question.toUpperCase());
            };
        });  

        // let's toss questions
        let i,id1,id2,tmp;

        for (i=0;i<100;i++) {
            id1 = randomNumber(0,current_questions.length-1);
            id2 = randomNumber(0,current_questions.length-1);
            tmp = current_questions[id1];
            current_questions[id1] = current_questions[id2];
            current_questions[id2] = tmp;
        };
    };
    
    $(".category-list").hide();

    HangManGameInit();
    HangManGameRefreshInfo();
}

function NewGameClick($this) {
    if (game_in_progress) { 
        score_total += 1;
        score_lost += 1;
    };
    HangManGameInit();
    game_in_progress = true;

    GameInitQuestion();
    HangManGameRefreshInfo();
}

function GameInitQuestion() {
    var question = current_questions[question_id],
        i;

    alert(question + "   questionID: "+question_id+"   questions.length="+current_questions.length);

    for (i=0; i<current_questions[question_id].length; i++) {
        if (current_questions[question_id].charAt(i) != " ") {
            $(".game-table").append("<div> </div>");
        } 
        else {
            $(".game-table").append("<div class='space'></div>");
        };

    };
    question_id +=1;
}



function GameLetterClick($this) {
    
    var letter_count = 0,
        i;

    if (game_in_progress) {
        if (!$($this).hasClass("clicked")) {
            $($this).addClass("clicked");
        };

        for (i=0;i<current_questions[question_id-1].length; i++) {
            if (current_questions[question_id-1].charAt(i) == $($this).text()) {
                $(".game-table>div").eq(i).text($($this).text());
                letter_count += 1;
            };
        };

        if (letter_count == 0) {
            errors_left -= 1;           
        };

        HangManGameRefreshInfo();
        // alert($($this).index());
        // alert($($this).text());
    };
}


// generic functions

function randomNumber(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}