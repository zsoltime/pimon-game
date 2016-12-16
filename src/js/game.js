'use strict';

function Game() {
  function init() {

    return {
      init: init,
    }
  }
}

document.addEventListener('DOMContentLoaded', function(e) {
  const game = Game();
  game.init();
});
