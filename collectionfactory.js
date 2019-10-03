/* global eventfulPropertyDescriptors collectionPropertyDescriptors */

/* exported collectionFactory */
function collectionFactory(arr = []) {
  let obj = {};

  Object.defineProperties(obj, collectionPropertyDescriptors);

  obj.push(...arr);

  Object.defineProperties(obj, eventfulPropertyDescriptors);

  return obj;
}

/* exported cf */
const cf = collectionFactory;