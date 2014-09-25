/**
 * @module particles/utils/random
 */
'use strict';

exports.getInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.getFloat = function(min, max) {
  return Math.random() * (max - min) + min;
};
