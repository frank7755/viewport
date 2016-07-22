define("viewport", ["jquery","./is"], function(require, exports, module){
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
 * @param viewport
 * @returns {*}
 */
function patchViewport(viewport){
  return viewport === window
    ? (document.compatMode == 'CSS1Compat' ? document.documentElement : document.body)
    : viewport;
}

function Viewport(viewport, options){
  var context = this;

  context.events = {};
  context.id = expando++;
  context.viewport = $(patchViewport(viewport));

  context.__initOptions(options);
  context.__findTarget();
  context.__init();

  reference[context.id] = context;
}

Viewport.prototype = {
  __init: function (){
    // delay trigger the scroll or resize event.
    var timer;
    var context = this;
    var id = context.id;
    var options = context.options;
    var viewport = context.viewport;
    var scrollTop = viewport.scrollTop();
    var scrollLeft = viewport.scrollLeft();
    var namespace = '.viewport-' + id;

    viewport.on(
      'scroll' + namespace + ' resize' + namespace,
      function (){
        clearTimeout(timer);

        timer = setTimeout(function (){
          // trigger the viewchange event internally.
          var event = context.__changeViewport(scrollTop, scrollLeft);

          // cahce scroll position
          scrollTop = event.scrollTop;
          scrollLeft = event.scrollLeft;
        }, options.delay);
      }
    );

    // init event
    this.__changeViewport(0, 0);
  },
  __changeViewport: function (vertical, horizontal){
    var context = this;
    var options = context.options;
    var viewport = context.viewport;
    var thresholdBorderReaching = options.thresholdBorderReaching;

    if (!viewport.is(':visible')) return;

    var width = viewport.innerWidth();
    var height = viewport.innerHeight();
    var scrollWidth = viewport[0].scrollWidth;
    var scrollHeight = viewport[0].scrollHeight;

    // event
    var event = {};

    // scrollbar position
    event.scrollTop = viewport.scrollTop();
    event.scrollLeft = viewport.scrollLeft();
    event.offsetY = event.scrollTop - vertical;
    event.offsetX = event.scrollLeft - horizontal;

    // event type
    event.type = 'viewchange';

    // target
    event.target = context.__filterTargetInViewport(width, height);

    // calculate viewport border reaching detail infos
    event.top = event.scrollTop - thresholdBorderReaching[0] <= 0;
    event.right = width + event.scrollLeft + thresholdBorderReaching[1] >= scrollWidth;
    event.bottom = height + event.scrollTop + thresholdBorderReaching[2] >= scrollHeight;
    event.left = event.scrollLeft - thresholdBorderReaching[3] <= 0;

    // emit view change event
    context.emit(event.type, event);

    // return scrollbar position
    return event;
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
  __findTarget: function (){
    var context = this;
    var options = context.options;
    var target = options.target;
    var viewport = context.viewport;

    if (is.string(target)) {
      target = viewport.find(target);
    } else if (is.element(target) && $.contains(viewport[0], target)) {
      target = $(target);
    } else if (target instanceof $) {
      var element = null;

      target.each(function (index, value){
        if ($.contains(viewport[0], value)) {
          if (!element) {
            element = $(value);
          } else {
            element.add(value);
          }
        }
      });

      target = element;
    } else {
      target = null;
    }

    context.target = target;
  },
  __filterTargetInViewport: function (width, height){
    var rect;
    var result = [];
    var context = this;
    var target = context.target;

    // target is null
    if (target === null) return result;

    var options = context.options;
    var threshold = options.threshold;
    var skipHidden = options.skipHidden;

    // get viewport height and width
    var viewport = context.viewport;

    // adjust the offsetTop and offsetLeft
    var viewportRect = viewport[0].getBoundingClientRect();
    var offsetTop = Math.round(viewportRect.top + (parseInt(viewport.css('border-top-width')) || 0));
    var offsetLeft = Math.round(viewportRect.left + (parseInt(viewport.css('border-left-width')) || 0));

    // filter elements by their rect info
    for (var i = 0; i < target.length; i++) {
      rect = target[i].getBoundingClientRect();

      // hidden element
      if (rect.top == 0 && rect.bottom == 0 && rect.left == 0 && rect.right == 0) {
        if (!skipHidden) {
          result.push(target[i]);
        }
      } else {
        // visible element
        var top = rect.top - offsetTop;
        var bottom = rect.bottom - offsetTop;
        var left = rect.left - offsetLeft;
        var right = rect.right - offsetLeft;

        if (((top < -threshold[0] && bottom >= -threshold[0])
          || (top >= -threshold[0] && top <= height + threshold[2]))
          && ((left < -threshold[3] && right >= -threshold[3])
          || (left >= -threshold[3] && left <= width + threshold[1]))) {
          result.push(target[i]);
        }
      }
    }

    return result;
  },
  on: function (event, handler){
    var context = this;

    context.events[event] = context.events[event]
      || $.Callbacks('memory stopOnFalse');

    context.events[event].add(handler);

    return context;
  },
  off: function (event, handler){
    var context = this;

    switch (arguments.length) {
      case 0:
        context.events = {};
        break;
      case 1:
        delete context.events[event];
        break;
      default:
        context.events[event] && context.events[event].remove(handler);
        break;
    }

    return context;
  },
  emit: function (event){
    var context = this;
    var data = [].slice.call(arguments, 1);

    context.events[event] = context.events[event]
      || $.Callbacks('memory stopOnFalse');

    this.events[event].fireWith(context, data);

    return context;
  },
  refresh: function (){
    this.__findTarget();

    return this;
  },
  destroy: function (){
    var context = this;
    var viewport = context.viewport;
    var namespace = '.viewport-' + context.id;

    viewport.off('scroll' + namespace);
    viewport.off('resize' + namespace);

    delete reference[this.id];
  }
};

module.exports = Viewport;

});
