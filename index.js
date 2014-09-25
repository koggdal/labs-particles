'use strict';

var raf = require('raf');

var canvas = require('./canvas');
var loop = require('./loop');
var Particle = require('./Particle');
var ParticleRing = require('./ParticleRing');

var context = canvas.context;
var rings = [];

canvas.init();

Particle.initTextures(function() {
  create();
  start();
});

function create() {
  rings.push(new ParticleRing(canvas.unit * 50, 200, 330));
  rings.push(new ParticleRing(canvas.unit * 40, 150, 300));
  rings.push(new ParticleRing(canvas.unit * 30, 120, 270));
  rings.push(new ParticleRing(canvas.unit * 20, 100, 240));
  rings.push(new ParticleRing(canvas.unit * 10, 50, 210));
}

function start() {
  loop.start();

  loop.on('frame', tick);
}

function tick() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.save();

  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(((loop.frame / 30) % 360) * Math.PI / 180);

  for (var i = 0, l = rings.length; i < l; i++) {
    rings[i].render(context);
  }

  context.restore();
}