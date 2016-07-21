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

/**
 * emit event
 * @param context
 * @param event
 * @param args
 */
function emit(context, event, args){
  args = [].slice.call(args, 0);

  args.unshift(event);

  context.emit.apply(context, args);
}

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
  if (is.number(threshold) && !is.nan(threshold) && !is.infinite(threshold)) {
    threshold = [threshold, threshold, threshold, threshold];
  } else if (is.array(threshold)) {
    var value;
    var set = [];
    var length = threshold.length;

    for (var i = 0; i < length; i++) {
      if (set.length < 4) {
        value = threshold[i];

        if (is.number(threshold) && !is.nan(threshold) && !is.infinite(threshold)) {
          set.push(value);
        }
      } else {
        break;
      }
    }

    switch (set.length) {
      case 0:
        threshold = [0, 0, 0, 0];
        break;
      case 1:
        threshold = [set[0], set[0], set[0], set[0]];
        break;
      case 2:
        threshold = [set[0], set[1], set[0], set[1]];
        break;
      case 3:
        threshold = [set[0], set[1], set[2], set[1]];
        break;
      default:
        threshold = set;
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
  this.events = {};
  this.id = expando++;
  this.viewport = $(patchViewport(viewport));

  this.__initOptions(options);
  this.__findTarget();
  this.__init();

  reference[this.id] = this;
}

Viewport.prototype = {
  __init: function (){

  },
  __initOptions: function (options){
    options = $.extend({
      delay: 150,
      target: null,
      threshold: 0,
      skipHidden: true,
      thresholdBorderReaching: 0
    }, options);

    options.threshold = patchThreshold(options.threshold);
    options.thresholdBorderReaching = patchThreshold(options.thresholdBorderReaching);

    this.options = options;
  },
  __filterTargetInViewport: function (){

  },
  __findTarget: function (){
    this.target = this.options.target
      ? this.viewport.find(this.options.target)
      : null;
  },
  on: function (event, handler){
    this.events[event] = this.events[event]
      || $.Callbacks('memory stopOnFalse');

    this.events[event].add(handler);

    return this;
  },
  off: function (event, handler){
    switch (arguments.length) {
      case 0:
        this.events = {};
        break;
      case 1:
        delete this.events[event];
        break;
      default:
        this.events[event] && this.events[event].remove(handler);
        break;
    }

    return this;
  },
  emit: function (event){
    var data = [].slice.call(arguments, 0);

    this.events[event] = this.events[event]
      || $.Callbacks('memory stopOnFalse');

    this.events[event].fireWith(this, data);

    return this;
  },
  refresh: function (){
    this.__findTarget();

    return this;
  },
  destroy: function (){
    delete reference[this.id];
  }
};

module.exports = Viewport;
