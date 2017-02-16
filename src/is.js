/*!
 * typeOf
 * Version: 0.0.1
 * Date: 2016/7/21
 * https://github.com/Nuintun/viewport
 *
 * Original Author: http://www.jsbug.com/lab/samples/viewport/
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/Nuintun/viewport/blob/master/LICENSE
 */

// Object to sting
var toString = Object.prototype.toString;

/**
 * The type of data
 *
 * @param value
 * @param type
 * @returns {boolean}
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
 * Type of string
 *
 * @param value
 * @returns {boolean}
 */
export function stringType(value) {
  return typeOf(value, 'string');
}

/**
 * Type of array
 *
 * @param value
 * @returns {boolean}
 */
export function arrayType(value) {
  return typeOf(value, 'array');
}

/**
 * Type of number
 *
 * @param value
 * @returns {boolean}
 */
export function numberType(value) {
  return typeOf(value, 'number');
}

/**
 * Type of element
 *
 * @param value
 * @returns {boolean}
 */
export function elementType(value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
}
