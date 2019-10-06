"use strict";

/* global eventfulPropertyDescriptors modelPropertyDescriptors */

/* exported modelFactory */
function modelFactory() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByModelPropertyDescriptors) {
    Object.defineProperties(obj, modelPropertyDescriptors);
  }

  for (var key in obj) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (!propertyDescriptor.get && !propertyDescriptor.set) {
      obj.property(key);
    }
  }

  return obj;
}
/* exported mf */


var mf = modelFactory;