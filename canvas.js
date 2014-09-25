/**
 * @module particles/canvas
 */
'use strict';

var Emitter = require('prime/emitter');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var emitter = new Emitter();
var unit = 1;
var width = width;
var height = height;
var pixelWidth = pixelWidth;
var pixelHeight = pixelHeight;

function getDevicePixelRatio() {
  return window.devicePixelRatio || 1;
}

function setSize(w, h) {
  var dpr = getDevicePixelRatio();

  width = w;
  height = h;
  pixelWidth = w * dpr;
  pixelHeight = h * dpr;

  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // var diag = Math.sqrt(width * width + height * height);
  var diag = Math.sqrt(Math.pow(pixelWidth, 2) + Math.pow(pixelHeight, 2));
  unit = Math.min(pixelWidth, pixelHeight) / 100;

  emitter.emit('resize');
}

function fillScreen() {
  setSize(window.innerWidth, window.innerHeight);
}

Object.defineProperties(exports, {
  unit: {
    get: function () { return unit; }
  },
  dpr: {
    get: function () { return getDevicePixelRatio(); }
  },
  width: {
    get: function () { return pixelWidth; }
  },
  height: {
    get: function () { return pixelHeight; }
  },
  cssWidth: {
    get: function () { return width; }
  },
  cssHeight: {
    get: function () { return height; }
  }
});

exports.element = canvas;
exports.context = context;

exports.on = emitter.on.bind(emitter);
exports.off = emitter.off.bind(emitter);
exports.emit = emitter.emit.bind(emitter);

exports.init = function() {
  fillScreen();
  window.addEventListener('resize', fillScreen);
};
