'use strict';
const MINE = '💣';
const FLAG = '🚩';

var gBoard;
var gGameInterval;
var gClicksCounter = 0;
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
  gGame.isOn = true;
  gBoard = buildBoard();
  renderBoard(gBoard);
  setMinesNegsCount();
  preventRightClick();
  console.log(gBoard);
}

function buildBoard() {
  var board = createMat();
  var idx = getRandomIntInclusive(0, board.length - 1);
  var jdx = getRandomIntInclusive(0, board.length - 1);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;

      if ((i === idx && j === jdx) || (i === jdx && j === idx)) {
        board[i][j].isMine = true;
      }
      // if ((i === 0 && j === 1) || (i === 2 && j === 3)) {
      //   board[i][j].isMine = true;
      // }
    }
  }
  return board;
}

function renderBoard(board) {
  var strHTML = `<table border="0"><tbody>`;
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < board.length; j++) {
      var currCell = board[i][j];
      var cellClass = `cell cell${i}-${j}`;

      strHTML += `<td class="floor ${cellClass}"
       onmousedown="whichButton(event, ${i}, ${j})" onclick="cellClicked(${i}, ${j})">`;

      if (currCell.isShown && currCell.isMine) strHTML += MINE;
      if (currCell.isShown && !currCell.isMine)
        strHTML += currCell.minesAroundCount;
      if (!currCell.isShown && currCell.isMarked) strHTML += FLAG;

      strHTML += `</td>`;
    }
    strHTML += `</tr>`;
  }
  strHTML += `</tbody></table>`;
  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
}

function getMinesAmount(pos) {
  var count = 0;
  // debugger
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

function setMinesNegsCount() {
  // debugger;
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

function cellClicked(i, j) {
  if (!gGame.isOn) return;
  checkIfStartTime();
  checkGameOver(i, j);
  checkGameVictory(i, j);
  if (gBoard[i][j].minesAroundCount >= 1) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    console.log(gGame.shownCount);
  }
  console.log(i, j);
  renderBoard(gBoard);
}

function checkIfStartTime() {
  gClicksCounter++;
  if (gClicksCounter === 1) {
    timer();
  }
}

function whichButton(ev, i, j) {
  checkIfStartTime();
  if (ev.button === 2) {
    (gBoard[i][j].isMarked) ? gBoard[i][j].isMarked = false : gBoard[i][j].isMarked = true;
    renderBoard(gBoard);
  } 
  return;
}


function checkGameOver(i, j) {
  if (gBoard[i][j].isMine) {
    gGame.isOn = false;
    clearInterval(gGameInterval);

      for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
          if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
        }
      }

  }

}

function checkGameVictory(i, j) {
  if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
    for (var i = 0; i < gLevel.SIZE; i++) {
      for (var j = 0; j < gLevel.SIZE; j++) {
        if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) return; 
      }
    }
  }
  console.log('You Won');
}