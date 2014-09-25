/**
 * @module particles/ParticleRing
 */
'use strict';

var Particle = require('./Particle');
var random = require('./utils/random');

function ParticleRing(radius, amount, startHue) {
  this.radius = radius;
  this.startHue = startHue;
  this.particles = new Array(amount);
  this.createParticles(amount);
}

ParticleRing.prototype.createParticles = function(amount) {
  var startHue = this.startHue;
  var radius = this.radius;
  var particles = this.particles;
  var particle;

  var minRadiusFactor = 0.7;
  var maxRadiusFactor = 1;

  var minScale = 0.01;
  var maxScale = 0.3;

  var rotationStep = 360 / this.particles.length;

  for (var i = 0; i < amount; i++) {
    particle = new Particle({
      scale: random.getFloat(minScale, maxScale),
      radius: radius * random.getFloat(minRadiusFactor, maxRadiusFactor),
      minRadius: radius * minRadiusFactor,
      maxRadius: radius * maxRadiusFactor,
      minScale: minScale,
      maxScale: maxScale,
      angle: rotationStep * i
    });
    particle.hue = startHue;

    particles[i] = particle;
  }
};

ParticleRing.prototype.render = function(context) {
  context.globalCompositeOperation = 'lighter';

  var particles = this.particles;

  for (var i = 0, l = particles.length; i < l; i++) {
    particles[i].render(context);
  }
};

module.exports = ParticleRing;
