'use strict';

function createMat() {
  // var size = 4;
  var size = gLevel.SIZE;
  var board = [];
  for (var i = 0; i < size; i++) {
    var row = [];
    for (var j = 0; j < size; j++) {
      row.push('');
    }
    board.push(row);
  }
  return board;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timer() {
  var startTime = Date.now();
  gGameInterval = setInterval(function () {
    var elapsedTime = Date.now() - startTime;
    document.querySelector('.timer').innerHTML = (elapsedTime / 1000).toFixed(0);
  }, 1000);
}

function preventRightClick() {
  document.addEventListener('contextmenu', function (rClick) {
    rClick.preventDefault();
  });
}