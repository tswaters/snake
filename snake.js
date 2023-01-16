var i = 0,
  ymax = 50,
  xmax = 50,
  height = 10,
  width = 10,
  delta_x,
  delta_y,
  current_x,
  current_y,
  moveSet = false,
  snake = [],
  length = 1,
  board,
  tiles = new Array(ymax),
  speed = 200;

function init() {
  var style = document.createElement("STYLE"),
    board = document.getElementById("board"),
    css = "";

  css +=
    "#board{ width:" + width * xmax + "px; height:" + height * ymax + "px;}";
  css +=
    "#board>div{position:absolute; border:0; height:" +
    height +
    "px; width:" +
    width +
    "px; }";
  for (var y = 0; y < ymax; y += 1) {
    css +=
      "#board>div:nth-child(" +
      ymax +
      "n+" +
      (y + 1) +
      "){ top: " +
      y * height +
      "px; }\n";
  }
  for (var x = 0; x < xmax; x += 1) {
    css +=
      "#board>div:nth-child(n+" +
      (1 + x * ymax) +
      "):nth-child(-n+" +
      (x * ymax + ymax) +
      "){ left: " +
      x * width +
      "px; }\n";
  }
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  for (var x = 0; x < xmax; x += 1) {
    tiles[x] = new Array(xmax);
    for (var y = 0; y < ymax; y += 1) {
      tiles[x][y] = document.createElement("DIV");
      board.appendChild(tiles[x][y]);
    }
  }

  document.body.addEventListener(
    "keydown",
    function (e) {
      switch (e.keyCode) {
        case 37:
          if (typeof delta_x == "undefined" && moveSet == false) {
            moveSet = true;
            delta_y = undefined;
            delta_x = -1;
          }
          break; // right
        case 39:
          if (typeof delta_x == "undefined" && moveSet == false) {
            moveSet = true;
            delta_y = undefined;
            delta_x = 1;
          }
          break; // left
        case 38:
          if (typeof delta_y == "undefined" && moveSet == false) {
            moveSet = true;
            delta_y = -1;
            delta_x = undefined;
          }
          break; // up
        case 40:
          if (typeof delta_y == "undefined" && moveSet == false) {
            moveSet = true;
            delta_y = 1;
            delta_x = undefined;
          }
          break; // down
        case 27:
          pauseGame();
          break; // esc
        case 32:
          resumeGame();
          break; // space
        //default: alert(e.keyCode);break;
      }
    },
    false
  );

  startGame(true);
}

function startGame(seed) {
  if (seed) {
    tid = -1;
    i = 0;
    s = 0;
    var o = document.querySelectorAll(
      "#board>div[class=food],#board>div[class=snake]"
    );
    for (var x = 0; x < o.length; x += 1) {
      o[x].className = "";
    }
    current_x = Math.floor(Math.random() * xmax);
    current_y = Math.floor(Math.random() * ymax);
    snake = [{ x: current_x, y: current_y }];
    paintSnake();
    addFood();
    moveSet = false;
  }
  tid = setInterval(iterateGame, speed);
}

function endGame() {
  debug("GAME OVER; SCORE: " + Math.floor((s * s * 1000) / i));
  debug("[SPACE] FOR NEW GAME");
  clearInterval(tid);
  delta_x = undefined;
  delta_y = undefined;
  moveSet = true;
  tid = -1;
  //startGame()
}
function resumeGame() {
  if (tid == -1) {
    debug("GAME " + (delta_x || delta_y ? "RESUMED" : "STARTING"));
    startGame(delta_x || delta_y ? false : true);
  }
}
function pauseGame() {
  debug("GAME PAUSED");
  clearInterval(tid);
  tid = -1;
}

function paintSnake() {
  for (var x = 0; x < snake.length; x += 1) {
    tiles[snake[x].x][snake[x].y].className = "snake";
  }
}

function addFood() {
  var open = document.querySelectorAll("#board>div:not(.snake):not(.food)");
  open[Math.floor(Math.random() * open.length)].className = "food";
}

function iterateGame() {
  if (delta_x || delta_y) {
    document.getElementById("timer").innerHTML = Math.floor(
      (s * s * 1000) / ++i
    );
  }

  if (delta_y) {
    current_y += delta_y;
  }
  if (delta_x) {
    current_x += delta_x;
  }
  if (delta_x || delta_y) {
    snake.push({ x: current_x, y: current_y });
  }

  moveSet = false;

  if (
    current_y == ymax ||
    current_y == -1 ||
    current_x == xmax ||
    current_x == -1
  ) {
    endGame();
    return;
  }

  if (
    (delta_x || delta_y) &&
    tiles[current_x][current_y].className == "snake"
  ) {
    endGame();
    return;
  }

  if (tiles[current_x][current_y].className == "food") {
    debug("NOM NOM NOM");
    s += 1;
    addFood();
  } else {
    if (delta_x || delta_y) {
      o = snake.shift();
      tiles[o.x][o.y].className = "";
    }
  }

  paintSnake();
}

var __debug = [];
function debug(text) {
  if (text) {
    __debug.push(text);
    if (__debug.length == 20) __debug.shift();
  }
  document.getElementById("_debug").innerHTML = __debug.join("<br>");
}

init();
