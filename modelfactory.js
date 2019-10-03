/* global eventfulPropertyDescriptors modelPropertyDescriptors */

/* exported modelFactory */
function modelFactory(obj = {}) {
  if (!obj.hasModelPropertyDescriptors) {
    const keys = Object.keys(obj);

    Object.defineProperties(obj, modelPropertyDescriptors);

    keys.forEach((key) => {
      obj.property(key);
    });
  }

  if (!obj.hasEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  return obj;
}

/* exported mf */
const mf = modelFactory;