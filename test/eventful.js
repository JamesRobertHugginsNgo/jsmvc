/* global eventfulPropertyDescriptors */

const eventful = {};
Object.defineProperties(eventful, eventfulPropertyDescriptors);

eventful.addHandler('test1', (...args) => {
  console.log('test1A', ...args);
}, false, eventful, true);

eventful.addHandler('test2', (...args) => {
  console.log('test2', ...args);
}, false, eventful, true);

eventful.addHandler('test1', (...args) => {
  console.log('test1B', ...args);
}, false, eventful, true);

eventful.removeHandlers('test2');

eventful.triggerHandlers('test1', true, 0, 'text');
eventful.triggerHandlers('test2', true, 0, 'text');

console.log('DISABLE');
eventful.disableHandlers('test1');
eventful.triggerHandlers('test1', true, 0, 'text');

console.log('ENABLE');
eventful.enableHandlers('test1');
eventful.triggerHandlers('test1', true, 0, 'text');

console.log(eventful);