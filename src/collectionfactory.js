/* global eventfulPropertyDescriptors collectionPropertyDescriptors */

/* exported collectionFactory */
function collectionFactory(arr = [], obj = {}) {
  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByCollectionPropertyDescriptors) {
    Object.defineProperties(obj, collectionPropertyDescriptors);
  }
  
  obj.push(...arr);

  return obj;
}

/* exported cf */
const cf = collectionFactory;