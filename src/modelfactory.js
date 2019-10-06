/* global eventfulPropertyDescriptors modelPropertyDescriptors */

/* exported modelFactory */
function modelFactory(obj = {}) {
  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByModelPropertyDescriptors) {
    Object.defineProperties(obj, modelPropertyDescriptors);
  }

  for (const key in obj) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(obj, key)
    if (!propertyDescriptor.get && !propertyDescriptor.set) {
      obj.property(key);
    }
  }

  return obj;
}

/* exported mf */
const mf = modelFactory;