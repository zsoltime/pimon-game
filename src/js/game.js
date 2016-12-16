'use strict';

function Game() {

  const dom = {};
  const PI = '3.141592653589793238462643383279502884197169399375105820974944592';
  let index = 0;
  let sequenceTimeout = 800;
  let playing = false;
  let userSequence = []; // @todo ?
  // let maxIndex = 0;
  let clicks = 0;

  function init() {
    cacheDOM();
    bindEvents();
  }

  function cacheDOM() {
    dom.game = document.getElementById('game');
    dom.start = document.getElementById('start');
    dom.disabled = document.getElementById('disable');
  }

  function bindEvents() {
    game.addEventListener('click', handleClick);
  }

  function handleClick(event) {
    if (!event.target.classList.contains('button')) {
      return;
    }

    if (event.target.id === 'start') {
      start();
      return;
    }
    // @todo don't check if not playing
    if (!checkSequence(event.target.dataset.value)) {
      console.log('game over')
    }
    else {
      console.log('right on spot ', event.target.dataset.value);
    }

    wait(10)
    .then(_ => event.target.classList.add('active'))
    .then(_ => wait(200))
    .then(_ => event.target.classList.remove('active'));
  }

  function disableKeypad() {
    dom.disabled.classList.add('active');
  }

  function enableKeypad() {
    dom.disabled.classList.remove('active');
  }

  function start() {
    if (playing) {
      return;
    }

    playing = true;
    dom.start.classList.add('disabled');

    wait(sequenceTimeout * 0.5)
    .then(_ => playSequence());
    return;
  }

  function playSequence() {
    // @todo should disable keypad and enable again once finished
    for (let i = 0; i <= index; i++) {
      wait(sequenceTimeout * i)
      .then(_ => {
        if (PI[i] === '.') {
          document.getElementById('point').classList.add('play');
        }
        else {
          document.getElementById('_' + PI[i]).classList.add('play');
        }
      })
      .then(_ => wait(sequenceTimeout))
      .then(_ => {
        if (PI[i] === '.') {
          document.getElementById('point').classList.remove('play');
        }
        else {
          document.getElementById('_' + PI[i]).classList.remove('play');
        }
      });
    }
  }

  function checkSequence(lastNumber) {
    if (PI[clicks] === lastNumber) {
      // clicks += 1;
      if (clicks === index) {
        clicks = 0;
        index += 1;
        playSequence();
      }
      else if (clicks < index) {
        clicks += 1;
      }

      return true;
    }
    else {
      // @todo gameover
      return false;
    }
  }

  function wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
    });
  }

  return {
    init: init
  }
}

document.addEventListener('DOMContentLoaded', function(e) {
  const game = Game();
  game.init();
});
