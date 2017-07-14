(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define('viewport', ['jquery'], factory) :
  (global.Viewport = factory(global.jQuery));
}(this, (function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  /*!
   * typeOf
   * Version: 0.0.1
   * Date: 2016/7/21
   * https://github.com/nuintun/viewport
   *
   * Original Author: http://www.jsbug.com/lab/samples/viewport/
   *
   * This is licensed under the MIT License (MIT).
   * For details, see: https://github.com/nuintun/viewport/blob/master/LICENSE
   */

  // Object to sting
  var toString = Object.prototype.toString;

  /**
   * typeOf
   *
   * @param {any} value
   * @param {String} type
   * @returns {Boolean}
   */
  function typeOf(value, type) {
    // Format type
    type = (type + '').toLowerCase();

    // Is array
    if (type === 'array' && Array.isArray) {
      return Array.isArray(value);
    }

    // Get real type
    var realType = toString.call(value).toLowerCase();

    // Switch
    switch (type) {
      case 'nan':
        // Is nan
        return realType === '[object number]' && value !== value;
      default:
        // Is other
        return realType === '[object ' + type + ']';
    }
  }

  /**
   * isString
   *
   * @param {any} value
   * @returns {Boolean}
   */
  function isString(value) {
    return typeOf(value, 'string');
  }

  /**
   * isArray
   *
   * @param {any} value
   * @returns {Boolean}
   */
  var isArray = Array.isArray || function(value) {
    return typeOf(value, 'array');
  };

  /**
   * isNumber
   *
   * @param {any} value
   * @returns {Boolean}
   */
  function isNumber(value) {
    return typeOf(value, 'number');
  }

  /**
   * isElement
   *
   * @param {any} value
   * @returns {Boolean}
   */
  function isElement(value) {
    // Is empty value
    if (!value) return false;

    // Tester element
    var tester = document.createElement('div');

    // If throw error is a element else not
    try {
      tester.appendChild(value);
    } catch (error) {
      return false;
    }

    // In <= IE8 HTMLElement.appendChild(document) don't throw error, so must be check nodeType
    return value.nodeType === 1;
  }

  /*!
   * Viewport
   * Version: 0.0.1
   * Date: 2016/7/21
   * https://github.com/Nuintun/viewport
   *
   * Original Author: http://www.jsbug.com/lab/samples/viewport/
   *
   * This is licensed under the MIT License (MIT).
   * For details, see: https://github.com/Nuintun/viewport/blob/master/LICENSE
   */

  // Expando ID
  var expando = 0;

  /**
   * patchThreshold
   *
   * @description Patch the threshold like css
   * - 1            ==> top: 1, right: 1, bottom: 1, left: 1
   * - [1]          ==> top: 1, right: 1, bottom: 1, left: 1
   * - [1, 2]       ==> top: 1, right: 2, bottom: 1, left: 2
   * - [1, 2, 3]    ==> top: 1, right: 2, bottom: 3, left: 2
   * - [1, 2, 3, 4] ==> top: 1, right: 2, bottom: 3, left: 4
   *
   * @param {Number|Array} threshold
   * @param {Boolean} absolute
   * @returns {Array}
   */
  function patchThreshold(threshold, absolute) {
    if (isNumber(threshold) && isFinite(threshold)) {
      if (absolute) {
        threshold = Math.abs(threshold);
      }

      threshold = [threshold, threshold, threshold, threshold];
    } else if (isArray(threshold)) {
      var value;
      var set = [];
      var length = threshold.length;

      for (var i = 0; i < length; i++) {
        if (set.length < 4) {
          value = threshold[i];

          if (isNumber(value) && isFinite(value)) {
            set.push(absolute ? Math.abs(value) : value);
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
   * patchViewport
   *
   * @description Patch the viewport if it is the window object
   * @param {window|HTMLElement} viewport
   * @returns {HTMLElement}
   */
  function patchViewport(viewport) {
    return viewport === window
      ? (document.compatMode === 'CSS1Compat' ? document.documentElement : document.body)
      : viewport;
  }

  /**
   * Viewport
   *
   * @param {window|HTMLElement} viewport
   * @param {Object} options
   * @constructor
   */
  function Viewport(viewport, options) {
    if (window !== window && isElement(viewport)) {
      throw new Error('Viewport must be window or a HTMLElement');
    }

    var context = this;

    context.events = {};
    context.id = expando++;
    context.viewport = $(viewport);
    context._viewport = $(patchViewport(viewport));

    // init
    context._initOptions(options);
    context._findTarget();
    context._init();
  }

  /**
   * @type {{
   *   _initOptions: Viewport._initOptions,
   *   _findTarget: Viewport._findTarget,
   *   _filterTarget: Viewport._filterTarget,
   *   _viewChange: Viewport._viewChange,
   *   _init: Viewport._init,
   *   on: Viewport.on,
   *   off: Viewport.off,
   *   emit: Viewport.emit,
   *   refresh: Viewport.refresh,
   *   destroy: Viewport.destroy
   * }}
   */
  Viewport.prototype = {
    _initOptions: function(options) {
      options = $.extend({
        delay: 150,
        target: null,
        threshold: 0,
        skipHidden: true,
        thresholdBorderReaching: 0
      }, options);

      var delay = options.delay;

      delay = isNumber(delay) && isFinite(delay) ? Math.abs(delay) : 150;

      options.delay = delay;
      options.threshold = patchThreshold(options.threshold);
      options.thresholdBorderReaching = patchThreshold(options.thresholdBorderReaching, true);

      this.options = options;
    },
    _findTarget: function() {
      var context = this;
      var options = context.options;
      var target = options.target;
      var _viewport = context._viewport;

      if (isString(target)) {
        target = _viewport.find(target);
      } else if (isElement(target) && $.contains(_viewport[0], target)) {
        target = $(target);
      } else if (target instanceof $) {
        target = target.filter(function() {
          return $.contains(_viewport[0], this);
        });
      } else {
        target = null;
      }

      context.target = target;
    },
    _filterTarget: function(width, height) {
      var result = [];
      var context = this;
      var target = context.target;

      // Target is not a jquery object or length is zero
      if (!(target instanceof $) || target.length === 0) return result;

      var options = context.options;
      var threshold = options.threshold;
      var skipHidden = options.skipHidden;

      // OffsetTop and offsetLeft
      var offsetTop = 0;
      var offsetLeft = 0;
      var viewport = context.viewport;

      // If not window adjust the offsetTop and offsetLeft
      if (viewport[0] !== window) {
        var viewportRect = viewport[0].getBoundingClientRect();

        offsetTop = viewportRect.top + (Math.round(parseFloat(viewport.css('border-top-width'))) || 0);
        offsetLeft = viewportRect.left + (Math.round(parseFloat(viewport.css('border-left-width'))) || 0);
      }

      // Filter elements by their rect info
      target.each(function(index, element) {
        var rect = element.getBoundingClientRect();

        // Hidden element
        if (rect.top === 0
          && rect.bottom === 0
          && rect.left === 0
          && rect.right === 0) {
          if (!skipHidden) {
            result.push(element);
          }
        } else {
          // Visible element
          var top = rect.top - offsetTop;
          var bottom = rect.bottom - offsetTop;
          var left = rect.left - offsetLeft;
          var right = rect.right - offsetLeft;

          // Adjust position
          if (!(top - threshold[2] >= height
              || right + threshold[3] <= 0
              || bottom + threshold[0] <= 0
              || left - threshold[1] >= width)) {
            result.push(element);
          }
        }
      });

      return result;
    },
    _viewChange: function(emitter, scrollTop, scrollLeft) {
      var context = this;
      var options = context.options;
      var viewport = context.viewport;
      var _viewport = context._viewport;
      var thresholdBorderReaching = options.thresholdBorderReaching;

      if (viewport[0] !== window && !viewport.is(':visible')) return;

      var width = viewport.innerWidth();
      var height = viewport.innerHeight();
      var scrollWidth = _viewport[0].scrollWidth;
      var scrollHeight = _viewport[0].scrollHeight;

      // Event object
      var event = {};

      // Scrollbar position
      event.scrollTop = viewport.scrollTop();
      event.scrollLeft = viewport.scrollLeft();
      event.offsetY = event.scrollTop - scrollTop;
      event.offsetX = event.scrollLeft - scrollLeft;

      // Event emitter
      event.emitter = emitter;

      // Event type
      event.type = 'viewchange';

      // Viewport size infos
      event.viewport = [width, height, scrollWidth, scrollHeight];

      // Target
      event.target = context._filterTarget(width, height);

      // Calculate viewport border reaching detail infos
      event.top = event.scrollTop - thresholdBorderReaching[0] <= 0;
      event.right = width + event.scrollLeft + thresholdBorderReaching[1] >= scrollWidth;
      event.bottom = height + event.scrollTop + thresholdBorderReaching[2] >= scrollHeight;
      event.left = event.scrollLeft - thresholdBorderReaching[3] <= 0;

      // Emit view change event
      context.emit(event.type, event);

      // Return scrollbar position
      return event;
    },
    _init: function() {
      // Delay trigger the scroll and resize event.
      var context = this;
      var id = context.id;
      var options = context.options;
      var viewport = context.viewport;
      var scrollTop = viewport.scrollTop();
      var scrollLeft = viewport.scrollLeft();
      var namespace = '.viewport-' + id;

      // View change callback
      function viewChange(e) {
        // Trigger the viewchange event internally.
        var event = context._viewChange(e.type, scrollTop, scrollLeft);

        // Cahce scroll position
        if (event) {
          scrollTop = event.scrollTop;
          scrollLeft = event.scrollLeft;
        }
      }

      // Event handler
      var handler;

      // Delay
      if (options.delay) {
        var timer;

        // Handler
        handler = function(e) {
          // Clear timer
          clearTimeout(timer);

          // Delay execute
          timer = setTimeout(function() {
            viewChange(e);
          }, options.delay);
        };
      } else {
        handler = viewChange;
      }

      // Bind event
      viewport.on('scroll' + namespace + ' resize' + namespace, handler);

      // Init event
      context._viewChange('init', scrollTop, scrollLeft);
    },
    on: function(event, handler) {
      var context = this;

      context.events[event] = context.events[event]
        || $.Callbacks('memory stopOnFalse');

      context.events[event].add(handler);

      return context;
    },
    off: function(event, handler) {
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
    emit: function(event) {
      var context = this;
      var data = [].slice.call(arguments, 1);

      context.events[event] = context.events[event]
        || $.Callbacks('memory stopOnFalse');

      this.events[event].fireWith(context, data);

      return context;
    },
    refresh: function(options) {
      var context = this;
      var viewport = context.viewport;

      // If set options
      if (arguments.length && typeOf(options, 'object')) {
        context._initOptions($.extend(context.options, options));
      }

      context._findTarget();
      context._viewChange('refresh', viewport.scrollTop(), viewport.scrollLeft());

      return context;
    },
    destroy: function() {
      var context = this;
      var viewport = context.viewport;
      var namespace = '.viewport-' + context.id;

      // Remove event listen
      viewport.off('scroll' + namespace);
      viewport.off('resize' + namespace);
    }
  };

  return Viewport;

})));
