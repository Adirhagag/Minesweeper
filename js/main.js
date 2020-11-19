'use strict';
const MINE = '<img src="img/bomb.png" alt="">';
const FLAG = '🚩';
const EMPTY = '';
const LOSE_SMILEY = '🙈';
const WIN_SMILEY = '🕺🏽';
const NORMAL_SMILEY = '🐒';
const FULL_LIVES = '❤️ ❤️ ❤️';
const TWO_LIVES = '❤️ ❤️ 💔';
const ONE_LIVES = '❤️ 💔 💔';
const DEAD = '💔 💔 💔';

var gBoard;
var gGameInterval;
var gClicksCounter = 0;
var gLives = 3;
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

function initGame() {
  gBoard = buildBoard();
  setMinesNegsCount();
  preventRightClick();
}

function buildBoard() {
  var board = createMat();
  var counter = 0;
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }
  while (counter < gLevel.MINES) {
    var minesPos = getRandomLocation();
    if (board[minesPos.i][minesPos.j].isMine === true) {
      counter--;
    }
    board[minesPos.i][minesPos.j].isMine = true;
    counter++;
  }
  return board;
}

function renderBoard(board) {
  var strHTML = `<table border="0"><tbody>`;
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < board.length; j++) {
      var currCell = board[i][j];
      var cellClass = `cell`;
      var cellContent = '';
      if (currCell.isShown) cellClass += ' reveal';

      if (currCell.isShown && currCell.isMine) cellContent = MINE;
      else if (currCell.isShown && !currCell.isMine) {
        currCell.minesAroundCount === 0
          ? (currCell.cellContent = '')
          : (cellContent = currCell.minesAroundCount);
      } else if (!currCell.isShown && currCell.isMarked) cellContent = FLAG;

      strHTML += `<td class="${cellClass}"
       onmousedown="onRightClick(event, ${i}, ${j})" onclick="cellClicked(${i}, ${j})">
       ${cellContent}</td>`;
    }
    strHTML += `</tr>`;
  }
  strHTML += `</tbody></table>`;
  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
}

function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (!gBoard[i][j].isMine) {
        var pos = { i: i, j: j };
        var count = getMinesAmount(pos);
        gBoard[i][j].minesAroundCount = count;
      }
    }
  }
  renderBoard(gBoard);
}

function getMinesAmount(pos) {
  var count = 0;
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j >= gBoard.length) continue;
      if (i === pos.i && j === pos.j) continue;
      if (gBoard[i][j].isMine) count++;
    }
  }
  return count;
}

function levelChoose(num) {
  if (num === 1) {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
  } else if (num === 2) {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
  } else if (num === 3) {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
  }
  restartGame();
}

function gameOverCase() {
  var elSmiley = document.querySelector('.smiley');
  var elLives = document.querySelector('.lives');
  gGame.isOn = false;
  clearInterval(gGameInterval);
  elLives.innerText = DEAD;
  elSmiley.innerText = LOSE_SMILEY;
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
    }
  }
}

function restartGame() {
  var elTimer = document.querySelector('.timer');
  var elSmiley = document.querySelector('.smiley');
  var elLives = document.querySelector('.lives');
  clearInterval(gGameInterval);
  elSmiley.innerText = NORMAL_SMILEY;
  elLives.innerText = FULL_LIVES;
  elTimer.innerText = '00';
  gLives = 3;
  gGame.isOn = false;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gClicksCounter = 0;
  gBoard = buildBoard();
  setMinesNegsCount();
  preventRightClick();
}


