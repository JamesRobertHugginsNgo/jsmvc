/* global mf cf vf */

vf.listItem = (model) => {
  return vf.li(null, [
    vf.input({ 'type': 'checkbox' }),
    model.text,
    vf.button({ 'type': 'button' }, 'Edit'),
    vf.button({ 'type': 'button' }, 'Delete'),
  ], [
    (element) => {
      model.on('change', () => {
        element.render();
      });
    }
  ]);
}

vf.list = (collection) => {
  return vf.ol({}, () => {
    return collection.map((item) => {
      return vf.listItem(item);
    });
  }, [
    (element) => {
      collection.on('change', () => {
        element.render();
      });
    }
  ]);
}

const listItemCollection = cf([
  mf({ text: 'List Item' }),
  mf({ text: 'List Item' }),
  mf({ text: 'List Item' }),
  mf({ text: 'List Item' })
]);
const listView = vf.list(listItemCollection);

document.body.appendChild(listView);