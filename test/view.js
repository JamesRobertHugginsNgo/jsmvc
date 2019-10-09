/* global viewFactory */

const view = viewFactory('div', {}, [
  'TEST',
  '<strong>TEST</strong>',
  () => {
    console.log('TEST');
    return 'TEST 2';
  }
], [() => { console.log('CALLBACK'); }]);

view.renderPromise.then(() => { console.log('RENDER PROMISE'); });

document.body.appendChild(view);

console.log('SCRIPT DONE');