/**
 * @module particles/Particle
 */
'use strict';

var loop = require('./loop');
var canvas = require('./canvas');
var random = require('./utils/random');

var textures = {};
var textureWidth = 0;
var textureHeight = 0;

var initCallback = null;
var loaded = 0;

function Particle(optOptions) {
  var options = optOptions || {};
  this.hue = 0;
  this.scale = options.scale || 1;
  this.radius = options.radius || 1;
  this.minRadius = options.minRadius || 0;
  this.maxRadius = options.maxRadius || 1;
  this.minScale = options.minScale || 0;
  this.maxScale = options.maxScale || 1;
  this.angle = options.angle || 0;

  this.scaleSpeed = random.getFloat(0.05, 0.1) / 100;
  this.radiusSpeed = random.getFloat(0.001 * canvas.unit, 0.05 * canvas.unit);
  this.scaleDirection = Math.round(Math.random()) ? 1 : -1;
  this.radiusDirection = Math.round(Math.random()) ? 1 : -1;

  var self = this;
  loop.on('frame', function() {
    self.tick();
  });
}

Particle.prototype.tick = function() {
  var unit = canvas.unit;
  var flickerOffset = random.getFloat(-0.002 * unit, 0.002 * unit);
  var newScale = this.calculateScale() + flickerOffset;
  this.scale = Math.max(0, Math.min(1, newScale));
  this.radius = this.calculateRadius();
};

Particle.prototype.calculateScale = function() {
  var newScale = this.scale + this.scaleSpeed * this.scaleDirection;
  if (newScale > this.maxScale) {
    newScale = this.maxScale;
    this.scaleDirection = -1;
  } else if (newScale < this.minScale) {
    newScale = this.minScale;
    this.scaleDirection = 1;
  }

  return newScale;
};

Particle.prototype.calculateRadius = function() {
  var newRadius = this.radius + this.radiusSpeed * this.radiusDirection;
  if (newRadius > this.maxRadius) {
    newRadius = this.maxRadius;
    this.radiusDirection = -1;
  } else if (newRadius < this.minRadius) {
    newRadius = this.minRadius;
    this.radiusDirection = 1;
  }

  return newRadius;
};

Particle.prototype.render = function(context) {
  var width = textureWidth * this.scale;
  var height = textureHeight * this.scale;

  var angle = (this.angle % 90) * Math.PI / 180;

  var quadrant = Math.ceil(this.angle / 90);
  var sin = Math.sin(angle) * this.radius;
  var cos = Math.cos(angle) * this.radius;

  var x = (quadrant === 1 || quadrant === 3) ? sin : cos;
  var y = (quadrant === 1 || quadrant === 3) ? cos : sin;

  if (quadrant > 2) x *= -1;
  if (quadrant === 1 || quadrant === 4) y *= -1;

  // Adjust the texture to render center at the right position
  x -= width / 2;
  y -= height / 2;

  var texture = textures[this.hue];
  if (texture) {
    context.drawImage(texture, x, y, width, height);
  }
};

function initTexture(unitSize, hue) {
  var innerRadius = unitSize * 2;
  var outerRadius = innerRadius + unitSize * 10;
  var padding = unitSize * 0.5;
  var center = padding + outerRadius;

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  canvas.width = center * 2;
  canvas.height = center * 2;

  var gradient = context.createRadialGradient(
    center, center, innerRadius,
    center, center, outerRadius
  );
  gradient.addColorStop(0, 'white');
  gradient.addColorStop(0.2, 'hsl(' + hue + ', 100%, 50%)');
  gradient.addColorStop(1, 'transparent');

  context.fillStyle = gradient;

  context.arc(center, center, outerRadius, 0, Math.PI * 2, false);
  context.fill();

  textures[hue] = canvas;

  textureWidth = canvas.width;
  textureHeight = canvas.height;
};

Particle.initTextures = function(callback) {
  initCallback = callback;
  for (var i = 0; i < 360; i++) {
    initTexture(canvas.unit, i);
  }
  callback();
};

module.exports = Particle;
