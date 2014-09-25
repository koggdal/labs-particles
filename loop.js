/**
 * @module particles/loop
 */
'use strict';

var Emitter = require('prime/emitter');
var raf = require('raf');

var timer = 0;

var loop = {
  on: Emitter.prototype.on,
  off: Emitter.prototype.off,
  emit: Emitter.prototype.emit,

  frame: 0,

  start: function() {
    timer = raf(tick);
  },

  stop: function() {
    raf.cancel(timer);
  }
};

function tick() {
  timer = raf(tick);

  loop.frame++;

  loop.emit('frame', Emitter.EMIT_SYNC);
}

module.exports = loop;
