/*!
 * viewport
 * Version: 0.0.1
 * Date: 2016/7/21
 * https://github.com/Nuintun/viewport
 *
 * Original Author: http://www.jsbug.com/lab/samples/viewport/
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/Nuintun/viewport/blob/master/LICENSE
 */

'use strict';

var $ = require('jquery');
var is = require('./is');

var expando = 0;
var reference = {};
var AP = Array.prototype;

// ES5 15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
AP.filter || (AP.filter = function (fn, context){
  var result = [], val;

  for (var i = 0, len = this.length >>> 0; i < len; i++) {
    if (i in this) {
      val = this[i]; // in case fn mutates this

      if (fn.call(context, val, i, this)) {
        result.push(val);
      }
    }
  }

  return result;
});

/**
 * patch the threshold like css
 * - 1            ==> top: 1, right: 1, bottom: 1, left: 1
 * - [1]          ==> top: 1, right: 1, bottom: 1, left: 1
 * - [1, 2]       ==> top: 1, right: 2, bottom: 1, left: 2
 * - [1, 2, 3]    ==> top: 1, right: 2, bottom: 3, left: 2
 * - [1, 2, 3, 4] ==> top: 1, right: 2, bottom: 3, left: 4
 * @param threshold
 * @returns {*}
 */
function patchThreshold(threshold){
  if (is.number(threshold)) {
    threshold = [threshold, threshold, threshold, threshold];
  } else if (is.array(threshold)) {
    threshold = threshold.filter(function (value){
      return is.number(value);
    });

    switch (threshold.length) {
      case 0:
        threshold = [0, 0, 0, 0];
        break;
      case 1:
        threshold = [threshold[0], threshold[0], threshold[0], threshold[0]];
        break;
      case 2:
        threshold = [threshold[0], threshold[1], threshold[0], threshold[1]];
        break;
      case 3:
        threshold = [threshold[0], threshold[1], threshold[2], threshold[1]];
        break;
      default:
        threshold = threshold.slice(0, 4);
        break;
    }
  } else {
    threshold = [0, 0, 0, 0];
  }

  return threshold;
}

/**
 * patch the viewport if it is the window object
 * @param container
 * @returns {*}
 */
function patchViewport(container){
  return container === window
    ? (document.compatMode == 'CSS1Compat' ? document.documentElement : document.body)
    : container;
}

function Viewport(viewport, options){
  this.id = expando++;
  this.viewport = $(patchViewport(viewport));
  this.options = $.extend({
    delay: 150,
    target: null,
    threshold: 0,
    includeHiddens: false,
    thresholdBorderReaching: 0
  }, options);

  reference[this.id] = this;
}

Viewport.prototype = {
  __init: function (){

  },
  __filterTargetInViewport: function (){

  },
  __findTarget: function (){
    this.target = this.options.target
      ? this.viewport.find(this.options.target)
      : null;
  },
  refresh: function (){

  },
  destroy: function (){
    delete reference[this.id];
  }
};
