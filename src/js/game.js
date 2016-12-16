'use strict';

function Game() {

  const dom = {};
  const PI = '3.141592653589793238462643383279502884197169399375105820974944592';
  let index = 0;
  let sequenceTimeout = 800;
  let playing = false;
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
    dom.restart = document.getElementById('restart');
    dom.digits = document.getElementById('digits');
    dom.modal = document.getElementById('modal');
  }

  function bindEvents() {
    game.addEventListener('click', handleClick);
    restart.addEventListener('click', reset);
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
      gameover();
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

  function reset() {
    index = 0;
    clicks = 0;
    playing = false;
    // @todo enable start button
    dom.start.classList.remove('disabled');
    // @todo hide modal
    dom.modal.classList.remove('active');
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

  function gameover() {
    dom.digits.textContent = index - 1;
    dom.modal.classList.add('active');
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
