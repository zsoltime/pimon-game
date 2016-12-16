'use strict';

function Game() {
  const dom = {};
  const PI = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
  let index = 0;
  let sequenceTimeout = 800;
  let playing = false;
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
    dom.game.addEventListener('click', handleClick);
    dom.restart.addEventListener('click', reset);
  }

  function handleClick(event) {
    if (!event.target.classList.contains('button')) {
      return;
    }

    if (event.target.id === 'start') {
      start();
      return;
    }

    if (playing) {
      if (checkSequence(event.target)) {
        // @todo indicate somehow when successfully finished sequence
        console.log('right on spot ', event.target.dataset.value);
      }
    }

    wait(10)
    .then(_ => event.target.classList.add('active'))
    .then(_ => wait(200))
    .then(_ => event.target.classList.remove('active'));
  }

  function toggleKeypad() {
    dom.disabled.classList.toggle('active');
  }

  function reset() {
    index = 0;
    clicks = 0;
    playing = false;

    dom.start.classList.remove('disabled');
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
    wait(sequenceTimeout)
    .then(_ => dom.modal.classList.add('active'));
  }

  function playSequence() {
    toggleKeypad();
    // @todo should disable keypad and enable again once finished
    for (let i = 0; i <= index; i++) {
      wait(sequenceTimeout * i)
      .then(_ => {
        // @todo refactor flash()
        if (PI[i] === '.') {
          document.getElementById('point').classList.add('play');
        }
        else {
          document.getElementById('_' + PI[i]).classList.add('play');
        }
      })
      .then(_ => wait(sequenceTimeout))
      .then(_ => {
        if (i === index) {
          toggleKeypad();
        }

        if (PI[i] === '.') {
          document.getElementById('point').classList.remove('play');
        }
        else {
          document.getElementById('_' + PI[i]).classList.remove('play');
        }
      });
    }
  }

  function flash() {}

  function checkSequence(button) {
    if (PI[clicks] === button.dataset.value) {
      button.classList.add('correct');
      wait(200)
      .then(_ => button.classList.remove('correct'));

      if (clicks === index) {
        clicks = 0;
        index += 1;
        wait(sequenceTimeout * .5)
        .then(_ => playSequence());
        return true;
      }
      else if (clicks < index) {
        clicks += 1;
      }
    }
    else {
      button.classList.add('wrong');
      wait(sequenceTimeout)
      .then(_ => button.classList.remove('wrong'));
      gameover();
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
