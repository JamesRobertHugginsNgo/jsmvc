/* global modelFactory viewFactory */

viewFactory.todo = (collection) => {
  const baseElement = viewFactory.div({}, [
    viewFactory.div({ 'class': 'form-group' }, [
      viewFactory.input({ 'class': 'form-control', 'type': 'text' }, [], [
        (element) => {
          element.addHandler('keyup', (event) => {
            if (event.which === 13 && element.value) {
              collection.push(modelFactory({ entry: element.value }));
              element.value = '';
            }
          });
        }
      ])
    ], []),

    viewFactory.div({}, [
      () => {
        if (collection.length > 0) {
          return viewFactory.ul({ 'class': 'list-group', 'data': { 'data-test': true } }, collection.map((model, index) => {
            return viewFactory.li({
              'class': ['list-group-item', 'd-flex', 'justify-content-between', 'align-items-center']
            }, [
              viewFactory.span({}, [
                viewFactory.input({ 'type': 'checkbox' }, [], []),
                ' ',
                model.entry
              ], []),
              viewFactory.span({}, [
                viewFactory.button({ 'class': ['btn', 'btn-danger'], 'type': 'button' }, [
                  'Remove'
                ], [
                  (element) => {
                    element.addHandler('click', () => {
                      collection.splice(index, 1);
                    });
                  }
                ])
              ], [])
            ], []);
          }), []);
        }
      }
    ], [
      (element) => {
        collection.addHandler('change', () => {
          console.log('COLLECTION CHANGED');
          element.render();
        });
      }
    ])
  ], []);

  return baseElement;
};
