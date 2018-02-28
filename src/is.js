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
export function typeOf(value, type) {
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
export function isString(value) {
  return typeOf(value, 'string');
}

/**
 * isArray
 *
 * @param {any} value
 * @returns {Boolean}
 */
export var isArray =
  Array.isArray ||
  function(value) {
    return typeOf(value, 'array');
  };

/**
 * isNumber
 *
 * @param {any} value
 * @returns {Boolean}
 */
export function isNumber(value) {
  return typeOf(value, 'number');
}

/**
 * isElement
 *
 * @param {any} value
 * @returns {Boolean}
 */
export function isElement(value) {
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
