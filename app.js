var value = 0;

document.getElementById("myButton").addEventListener("click", function(e) {
  e.preventDefault();
  value++;
  this.innerHTML = value;
  //sets the HTML text inside the button to display the number of times it has been clicked
});

document.addEventListener("keypress", handleKeyPress);

function handleKeyPress(event) {
  var keyPressed = event.key; //event.key contains the key that was pressed

  document.getElementById("text").innerHTML = "Key Pressed: " + keyPressed;
  //sets the HTML text to display the key pressed
}

//for game code
//global variables go under here:

var interval;
var started = false;
var clickedArray = [];
var time = 0;
var ready = true;
var numCompleted = 0;

//run functions under here:
setUp();

//function definitions go under here:

function randomAnswers() {
  var answers = [1, 1, 2, 2, 3, 3, 4, 4, 5];

  answers.sort(function(item) {
    return 0.5 - Math.random();
  });

  return answers;
}

function hide(cell) {
  cell.style.backgroundColor = "blue";
  cell.innerHTML = "";
  cell.clicked = false;
}

function complete(cell) {
  numCompleted++;
  cell.completed = true;
  cell.style.backgroundColor = "purple";
}

function reveal(cell) {
  cell.style.backgroundColor = "red";
  cell.innerHTML = cell.value;
  cell.clicked = true;
}

function startTimer() {
  if (started == false) {
    interval = setInterval(function() {
      time++;
      document.getElementById("timer").innerHTML = "Time Elapsed: " + time;
    }, 1000);
    started = true;
  }
}

function setUp() {
  var grid = document.getElementsByTagName("td");

  var answers = randomAnswers();
  for (var i = 0; i < grid.length; i++) {
    var cell = grid[i];

    cell.completed = false;
    cell.clicked = false;
    cell.value = answers[i];

    cell.addEventListener("mouseenter", function() {
      if (this.completed == false && this.clicked == false)
        this.style.background = "orange";
    });

    cell.addEventListener("mouseleave", function() {
      if (this.completed == false && this.clicked == false)
        this.style.background = "blue";
    });

    cell.addEventListener("click", function() {
      if (ready == false) return;
      startTimer();
      if (this.clicked == false && this.completed == false) {
        clickedArray.push(this);
        reveal(this);
      }

      if (clickedArray.length == 2) {
        if (clickedArray[0].value == clickedArray[1].value) {
          //if a matching pair is found
          complete(clickedArray[0]);
          complete(clickedArray[1]);

          clickedArray = [];

          if (numCompleted == 8) {
            alert("You won in " + time + " seconds!");
            clearInterval(interval);
          }
        } else {
          //if a matching pair is not found
          ready = false;
          document.getElementById("gridTable").style.border = "5px solid red";

          setTimeout(function() {
            //after a 500ms delay
            hide(clickedArray[0]);
            hide(clickedArray[1]);

            clickedArray = [];

            ready = true;
            document.getElementById("gridTable").style.border =
              "5px solid black";
          }, 500);
        }
      }
    });
  }
  document.addEventListener("keydown", function(event) {
    if (event.key > 0 && event.key < 10) {
      grid[event.key - 1].click();
    }
  });
  document.getElementById("restart").addEventListener("click", function() {
    location.reload();
  });
}
