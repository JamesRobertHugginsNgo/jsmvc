"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* global eventfulPropertyDescriptors collectionPropertyDescriptors */

/* exported collectionFactory */
function collectionFactory() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByCollectionPropertyDescriptors) {
    Object.defineProperties(obj, collectionPropertyDescriptors);
  }

  obj.push.apply(obj, _toConsumableArray(arr));
  return obj;
}
/* exported cf */


var cf = collectionFactory;