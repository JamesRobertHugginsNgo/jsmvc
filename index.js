/* global eventProperties modelProperties */

console.log(modelProperties);

const obj = {};
Object.defineProperties(obj, eventProperties);
Object.defineProperties(obj, modelProperties);

obj.property('prop1');

obj.on('change', () => {
  console.log('CHANGE');
});

obj.prop1 = '000';

// obj.push('123');
// obj.push('456');
// obj.push('789', '789', '789', '789');

// console.log('POP', obj.pop());

// obj[0] = 'abc';

console.log('OBJECT', obj, obj.hasModelProperties);