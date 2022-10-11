'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Button$1 = require('./Button.js');
var ButtonCounter = require('./ButtonCounter.js');

const Button = Object.assign(Button$1.ButtonComponent, {
  Counter: ButtonCounter.Counter
});

exports.Button = Button;
