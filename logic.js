/* eslint-disable no-console */
console.log("Game loaded");
var isRunning = false;

                                var DEBUG_SKIP_INTRO = true;

/* ========= SCREEN MANAGEMENT ========= */

function showScreen(id) {
  var screens = document.querySelectorAll('section');
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.remove('active');
  }
  document.getElementById(id).classList.add('active');
}

showScreen('welcome-screen');

                                if (DEBUG_SKIP_INTRO) {
                                    showScreen('game-screen');
                                    } else {
                                    startIntro();
                                    }
setTimeout(function() {
  intro.style.animation = "scrollText 60s linear forwards";
}, 10);

var intro = document.getElementById("intro-scroll");

intro.addEventListener("animationend", function() {
  var btn = document.getElementById("mission-start");
  btn.style.display = "flex";
  setTimeout(function(){
    btn.style.opacity = "1";
  }, 50);
});

function startGame() {
  showScreen('game-screen');
}

/* ========= GRID ========= */

var grid = [
  [0,1,1,1,1,0,1,1,1,1,0],
  [1,1,2,2,1,1,1,2,2,1,1],
  [1,2,0,0,2,1,2,0,0,2,1],
  [1,2,0,0,0,3,0,0,0,2,1],
  [1,1,2,0,0,0,0,0,2,1,1],
  [1,1,1,2,0,0,0,2,1,1,1],
  [0,1,1,1,2,0,2,1,1,1,0],
  [0,0,1,1,1,2,1,1,1,0,0],
  [0,0,0,0,1,1,1,0,0,0,0]
];

var collectedComponents = {};

var originalGrid = JSON.parse(JSON.stringify(grid));

function renderGrid() {
  var gridElement = document.getElementById('grid');
  gridElement.innerHTML = '';

  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[y].length; x++) {
      var cell = document.createElement('div');
      cell.className = 'cell';

      if (grid[y][x] === 0) cell.classList.add('void');
      if (grid[y][x] === 1) cell.classList.add('path');
      if (grid[y][x] === 2) {
  cell.classList.add('component');

  var key = y + "_" + x;

  if (!collectedComponents[key]) {
    cell.innerHTML = "\u2B50";
  }
}
      if (grid[y][x] === 3) cell.classList.add('goal');

      gridElement.appendChild(cell);
    }
  }
}

renderGrid();

/* ========= SHIP ========= */

var ship = {
  x: 5,
  y: 8,
  direction: 'north'
};

var startState = {
  x: 5,
  y: 8,
  direction: 'north'
};

var directions = ['north', 'east', 'south', 'west'];

function renderShip() {
    // odebrat staré zvýraznení
document.querySelectorAll('.cell').forEach(function(c) {
  c.classList.remove('current');
});
  var gridEl = document.getElementById('grid');
  var shipEl = document.getElementById('ship');

  if (!shipEl) {
    shipEl = document.createElement('div');
    shipEl.id = 'ship';
    gridEl.appendChild(shipEl);
      
      var index = ship.y * grid[0].length + ship.x;
document.querySelectorAll('.cell')[index].classList.add('current');

  }

  var size = 42;
  shipEl.style.left = (ship.x * size) + 'px';
  shipEl.style.top = (ship.y * size) + 'px';

  var rotation = {
    north: 'rotate(0deg)',
    east: 'rotate(90deg)',
    south: 'rotate(180deg)',
    west: 'rotate(270deg)'
  };

  shipEl.style.transform = rotation[ship.direction];
}

var startState = {
  x: 5,
  y: 8,
  direction: 'north'
};

renderShip();

/* ========= COMMANDS ========= */

var COMMANDS = {
  MOVE: 'move',
  TURN_LEFT: 'turn_left',
  TURN_RIGHT: 'turn_right',
  CALL_F0: 'call_f0',
  CALL_F1: 'call_f1'
};

/* ========= f0 PROGRAM ========= */

var f0 = [
  { command: null, color: null },
  { command: null, color: null },
  { command: null, color: null },
  { command: null, color: null },
  { command: null, color: null },
  { command: null, color: null },
  { command: null, color: null }
];

var f1 = [
  { command: null, color: null },
  { command: null, color: null },
  { command: null, color: null },
  { command: null, color: null }
];

var activeSlot = {
  func: null,
  index: null
};

document.getElementById("mission-start").addEventListener("click", function () {
  showScreen("game-screen");
});

/* ========= SLOT UI ========= */

var slots = document.querySelectorAll('.slot');

for (var i = 0; i < slots.length; i++) {
  slots[i].addEventListener('click', function () {
    for (var j = 0; j < slots.length; j++) {
      slots[j].classList.remove('active');
    }

    this.classList.add('active');

    activeSlot.func = this.dataset.func;
    activeSlot.index = Number(this.dataset.index);
  });
}

/* ========= ADD COMMAND ========= */

function addCommand(command) {
  if (activeSlot.func === null) return;

  if (activeSlot.func === 'f0') {
    f0[activeSlot.index].command = command;
  }

  if (activeSlot.func === 'f1') {
  f1[activeSlot.index].command = command;
}

renderFunctions();
}

/* ========= COLOR ========= */

function setColor(color) {
  if (activeSlot.func === null) return;

  if (activeSlot.func === 'f0') {
    f0[activeSlot.index].color = color;
  }

  if (activeSlot.func === 'f1') {
    f1[activeSlot.index].color = color;
  }

  renderFunctions();
}

/* ========= RENDER f0 ========= */

function renderF0() {
  var slots = document.querySelectorAll('#f0 .slot');

  for (var i = 0; i < f0.length; i++) {
    var text = '';
    if (i === 0) text = 'f0';

    if (f0[i].command) text += ' ' + f0[i].command;

    if (f0[i].color === 1) text += ' ðŸ”µ';
    if (f0[i].color === 2) text += ' ðŸŒ¸';
    if (f0[i].color === 3) text += ' ðŸŸ ';

    slots[i].textContent = text;
  }
}

/* ========= PROGRAM EXECUTION ========= */

function getCurrentCellColor() {
  return grid[ship.y][ship.x];
}

function canExecute(step) {
  if (step.color === null) return true;
  return step.color === getCurrentCellColor();
}

function highlightFunction(id) {
  document.querySelectorAll('.function-row').forEach(row =>
    row.classList.remove('active')
  );

  document.getElementById(id).classList.add('active');
}

function highlightSlot(rowId, index) {
  document.querySelectorAll(`#${rowId} .slot`).forEach(s =>
    s.classList.remove('running')
  );

  const slots = document.querySelectorAll(`#${rowId} .slot`);
  if (slots[index]) slots[index].classList.add('running');
}

function runProgram(callback) {
  isRunning = true;
  var i = 0;

  function step() {
      if (!isRunning) return;
    if (i >= f0.length) {
      if (callback) callback();
      return;
    }

    highlightFunction('f0');
    highlightSlot('f0', i);

    var current = f0[i];

    if (current.command && canExecute(current)) {

      if (current.command === COMMANDS.CALL_F1) {
        runF1(function () {
          i++;
          setTimeout(step, 120);
        });
        return;
      }

      if (current.command === COMMANDS.CALL_F0) {
        runProgram(function () {
          i++;
          setTimeout(step, 120);
        });
        return;
      }

      executeCommand(current.command);
    }

    i++;
    setTimeout(step, 120);
  }

  step();
}

function runF1(callback) {
  var i = 0;

  function step() {
    if (i >= f1.length) {
      if (callback) callback();
      return;
    }

    highlightFunction('f1');
    highlightSlot('f1', i);

    var current = f1[i];

    if (current.command && canExecute(current)) {

      if (current.command === COMMANDS.CALL_F0) {
        runProgram(function () {
          i++;
          setTimeout(step, 120);
        });
        return;
      }

      if (current.command === COMMANDS.CALL_F1) {
        runF1(function () {
          i++;
          setTimeout(step, 120);
        });
        return;
      }

      executeCommand(current.command);
    }

    i++;
    setTimeout(step, 120);
  }

  step();
}

/* ========= EXECUTION ========= */

function executeCommand(cmd) {

  console.log("Before:", ship.direction);

  if (cmd === COMMANDS.MOVE) moveForward();

  if (cmd === COMMANDS.TURN_LEFT) {
    ship.direction = directions[(directions.indexOf(ship.direction) + 3) % 4];
    renderShip();
  }

  if (cmd === COMMANDS.TURN_RIGHT) {
    ship.direction = directions[(directions.indexOf(ship.direction) + 1) % 4];
    renderShip();
  }

  console.log("After:", ship.direction);
}

/* ========= MOVEMENT ========= */

function moveForward() {
  var dx = 0, dy = 0;

  if (ship.direction === 'north') dy = -1;
  if (ship.direction === 'south') dy = 1;
  if (ship.direction === 'east') dx = 1;
  if (ship.direction === 'west') dx = -1;

  var nx = ship.x + dx;
  var ny = ship.y + dy;

  if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length) return;
  if (grid[ny][nx] === 0) return;

  ship.x = nx;
ship.y = ny;

if (grid[ship.y][ship.x] === 2) {

  var key = ship.y + "_" + ship.x;

  if (!collectedComponents[key]) {
    collectedComponents[key] = true;
    renderGrid();
  }
}

renderShip();
checkWin();
}

function renderFunctions() {
  renderFunctionRow('f0', f0);
  renderFunctionRow('f1', f1);
}

function renderFunctionRow(id, fn) {
  var slots = document.querySelectorAll('#' + id + ' .slot');

  for (var i = 0; i < fn.length; i++) {

    slots[i].innerHTML = '';
    slots[i].className = "slot";

    if (i === 0) {
      slots[i].textContent = id;
      continue;
    }

    var step = fn[i];
    if (!step.command) continue;

    var icon = document.createElement("div");
    icon.className = "cmd-icon";

    if (step.command === COMMANDS.MOVE) icon.textContent = "M";
    if (step.command === COMMANDS.TURN_LEFT) icon.textContent = "L";
    if (step.command === COMMANDS.TURN_RIGHT) icon.textContent = "R";
    if (step.command === COMMANDS.CALL_F0) icon.textContent = "f0";
    if (step.command === COMMANDS.CALL_F1) icon.textContent = "f1";

    slots[i].appendChild(icon);

    if (step.color) {
  slots[i].classList.add("color-" + step.color);
}
  }
}


function stopProgram() {
  isRunning = false;
}

function resetGame() {

  stopProgram();

  ship.x = startState.x;
  ship.y = startState.y;
  ship.direction = startState.direction;

  grid = JSON.parse(JSON.stringify(originalGrid));
  collectedComponents = {};

  for (var i = 0; i < f0.length; i++) {
    f0[i].command = null;
    f0[i].color = null;
  }

  for (var i = 0; i < f1.length; i++) {
    f1[i].command = null;
    f1[i].color = null;
  }

  renderGrid();
  renderShip();
  renderFunctions();
}

function checkWin() {

  // pokud je lod zpet na startovní pozici
  if (
    ship.x === startState.x &&
    ship.y === startState.y
  ) {
    showScreen('end-screen');
  }
}

function revealDestination() {
  window.location.href = "https://www.donshot.cz/laserova-strelnice";
}

renderFunctions();







