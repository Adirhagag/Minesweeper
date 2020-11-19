'use strict';

function cellClicked(i, j) {
  checkIfStartTime();
  if (!gGame.isOn) return;
  var isWon = checkGameStatus(i, j);
  expandShown(gBoard, { i: i, j: j });
  if (gBoard[i][j].isMarked === true) return;
  if (
    gBoard[i][j].minesAroundCount >= 1 ||
    (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine)
  ) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    console.log(gGame.shownCount);
  } else {
    gGame.shownCount++;
  }
  if (!isWon) checkGameVictory(i, j);
  
  renderBoard(gBoard);
}


function checkIfStartTime() {
  gClicksCounter++;
  if (gClicksCounter === 1) {
    gGame.isOn = true;
    timer();
  }
}

function checkGameStatus(i, j) {
  if (gBoard[i][j].isMine) {
    if (gLives > 1) {
      gLives--;
      livesUpdate();
      console.log(gLives);
      gBoard[i][j].isShown = true;
      var isWon = checkGameVictory(i, j);
      return isWon;
    } else {
      gameOverCase();
    }
  }
}

function checkGameVictory(i, j) {
  var elSmiley = document.querySelector('.smiley');
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
        if (!gBoard[i][j].isShown) return;
      }
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) return;
    }
  }
  gGame.isOn = false;
  clearInterval(gGameInterval);
  elSmiley.innerText = WIN_SMILEY;
  return true;
}

function onRightClick(ev, i, j) {
  checkIfStartTime();
  if (!gGame.isOn) return;
  if (ev.button === 2) {
    //right click identify number
    gBoard[i][j].isMarked
      ? (gBoard[i][j].isMarked = false)
      : (gBoard[i][j].isMarked = true);
    renderBoard(gBoard);
  }
  checkGameVictory();
  return;
}

function expandShown(board, pos) {
  if (board[pos.i][pos.j].isMine) return;
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i >= gLevel.SIZE) continue;
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j >= gLevel.SIZE) continue;
      if (i === pos.i && j === pos.j) continue;

      var cell = board[i][j];
      if (cell.isMine || cell.isMarked) continue;
      else if (!cell.isShown) {
        cell.isShown = true;
        gGame.shownCount++;
      }
    }
  }
}

function livesUpdate() {
  var elLives = document.querySelector('.lives');
  if (gLives === 3) elLives.innerText = FULL_LIVES;
  if (gLives === 2) elLives.innerText = TWO_LIVES;
  else if (gLives === 1) elLives.innerText = ONE_LIVES;
}

function checkIfTimeEnds() {
  if (gLevel.SIZE === 4) {
    if (gGame.secsPassed === 120) {
      gameOverCase();
    }
  } else if (gLevel.SIZE === 8) {
    if (gGame.secsPassed === 720) {
      gameOverCase();
    }
  } else if (gLevel.SIZE === 12) {
    if (gGame.secsPassed === 1800) {
      gameOverCase();
    }
  }
}
