/* global mf cf vf */

const obj = mf({ data1: 123, data2: 'abc' });

obj.on('change', () => {
  console.log('MODEL CHANGE');
});

obj.data1 = null;

console.log(obj.toJSON(), obj);

const arr = cf([ 123, 'abc']);

arr.on('change', () => {
  console.log('COLLECTION CHANGE');
});

arr.push(true, 'abc');
arr[1] = 'TEXT';

console.log(arr.toArray(), arr);

const link = vf(document.getElementById('link'), { 'data-id': 'new_id' }, [
  ' ',
  vf.span({}, [
    'SPAN'
  ], []),
], []);

link.promise.then(() => {
  console.log('LINK DONE');
})

console.log(link);