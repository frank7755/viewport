/*!
 * is
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

var toString = Object.prototype.toString;

// type judge
var is = {
  type: function (value, type){
    // format type
    type = (type + '').toLowerCase();

    // is array
    if (type === 'array' && Array.isArray) {
      return Array.isArray(value);
    }

    // get real type
    var realType = toString.call(value).toLowerCase();

    // switch
    switch (type) {
      case 'nan':
        // nan
        return realType === '[object number]' && value !== value;
      default :
        // other
        return realType === '[object ' + type + ']';
    }
  },
  fn: function (fn){
    return is.type(fn, 'function');
  },
  string: function (string){
    return is.type(string, 'string');
  },
  array: function (array){
    return is.type(array, 'array');
  },
  number: function (number){
    return is.type(number, 'number');
  },
  nil: function (nil){
    return is.type(nil, 'null');
  },
  regexp: function (regexp){
    return is.type(regexp, 'regexp');
  },
  date: function (date){
    return is.type(date, 'date');
  },
  nan: function (nan){
    return is.number(nan) && nan !== nan;
  },
  int: function (int){
    return is.number(int) && parseInt(int, 10) === int;
  },
  boolean: function (boolean){
    return is.type(boolean, 'boolean');
  },
  error: function (error){
    return is.type(error, 'error');
  }
};

module.exports = is;
