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
        $(".category-list-container").append("<a href='#' class='categoryListItem'>" + value + "</a>");
      });
});


$(document).ready(function() {
    assignEventFunctions();
    gameRun();
});

// functions

function gameRun() {
    gameInit();
    gameRefreshInfo();
}




function gameInit() {

    // remove answer tiles
    $(".game-table").empty();

    // remove .clicked class from letters
    $(".game-letters>div.clicked").removeClass("clicked");

    //reset game status
    game_in_progress = false;

    // hide letters
    $(".game-letters").hide();

    // show game info text and remove coloring classes
    $(".information").removeClass("success").removeClass("failure");
    $(".information").show();
}



function gameRefreshInfo() {

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

function assignEventFunctions() {
    
    // click on category name - game screen
    $("#gameCategoryName").click(function() {
        gameCategoryNameClick();
    });

    // click on category name - category list
    $(".categoryListItem").click(function() {
        categoryListItemClick($(this));
    })

    // click on "new game" button
    $("#newGame").click(function() {
        newGameClick($(this));
    })

    // click on letter
    $(".game-letters>div").click(function() {
        letterClick($(this));
    })
}



// definitions of object events functions

function gameCategoryNameClick() {
    $(".category-list").show();
}



function categoryListItemClick($this) {

    if (category_id != $($this).index()-1) { // if category was changed
        current_questions = [];              // reset current questions set
        category_id = $($this).index()-1;    // set new current category ID
        score_total = 0;                     // reset score
        score_lost = 0;
        score_won = 0;
        game_in_progress = false;            // game is not in progress until "New game" button is clicked
        
        errors_left = 5;                     // reset errors count
        question_id = 0;                     // set current question to 0
        questions_count = 0;                 // reset question count

        $.each(questions, function( index, value ) { // check all questions, select questions with current category and put them into current questions table
            if (value.category==categories[category_id]) {
                questions_count += 1;        // count questions in current category
                current_questions.push(value.question.toUpperCase()); // all questions to uppercase
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
    
    // finally hide category list
    $(".category-list").hide();

    $(".information").text("click 'New Game' button to start new riddle");

    gameInit();         // init game after category change
    gameRefreshInfo();  // refresh game info
}

function newGameClick($this) {
    if (game_in_progress) { 
        score_total += 1;
        score_lost += 1;
    };
    gameInit();
    game_in_progress = true;
    errors_left = 5;

    $(".game-letters").show();
    $(".information").hide();

    initQuestion();
    gameRefreshInfo();
}




function initQuestion() {
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



function letterClick($this) {

    var letter_count = 0,
        i;

    if (errors_left>=0) {

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

            i = 0;

            $(".game-table>div:not(.space").each(function(){
                if ($(this).text().trim()=="") { i += 1;};
            });

            if (i==0) {  // i = 0 means no white space characters in question, so answer is completed
                $(".game-letters").hide();
                $(".information").text("You have won!").addClass("success");
                $(".information").show();

                game_in_progress = false;
                score_total += 1;
                score_won += 1;
            };
        }
    };
    if (errors_left<0) {
        $(".game-letters").hide();
        $(".information").text("You have lost... The answer is: " + current_questions[question_id-1]).addClass("failure");
        $(".information").show();

        game_in_progress = false;

        score_total += 1;
        score_lost += 1;

        errors_left = 0;
    };

    gameRefreshInfo();
   
}


// generic functions

function randomNumber(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}