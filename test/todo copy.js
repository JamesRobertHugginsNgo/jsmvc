/* global modelFactory viewFactory */

viewFactory.todo = (model) => {
  const entry = viewFactory.todoEntry(model.entry);
  entry.on('submit', () => {
    if (model.entry.entry) {
      model.list.push(modelFactory({ entry: model.entry.entry }));
      model.entry.entry = '';
    }
  });

  const list = viewFactory.todoList(model.list);

  return viewFactory.div({}, [
    entry,
    viewFactory.br(),
    list
  ], []);
};

viewFactory.todoEntry = (model) => {
  const baseElement = viewFactory.div({ 'class': 'card' }, [
    viewFactory.div({ 'class': 'card-body' }, [
      viewFactory.form({}, [
        viewFactory.div({ 'class': 'form-group' }, [
          viewFactory.label({ 'for': 'entry' }, [
            'To Do Entry'
          ], []),
          viewFactory.input({ 'id': 'entry', 'class': 'form-control', 'type': 'text', 'value': model.entry }, [], [
            (element) => {
              element.on('input', () => {
                model.entry = element.value
              });
              model.on('change:entry', () => {
                element.value = model.entry;
              })
            }
          ])
        ], []),
        viewFactory.button({ 'class': ['btn', 'btn-primary'].join(' '), 'type': 'button' }, [
          'Add'
        ], [
          (element) => {
            element.on('click', () => {
              baseElement.trigger('submit');
            });
          }
        ])
      ], [
        (element) => {
          element.on('submit', (event) => {
            event.preventDefault();
          });
        }
      ])
    ], [])
  ], []);

  return baseElement;
};

viewFactory.todoList = (collection) => {
  return viewFactory.div({ 'class': 'card' }, [
    viewFactory.ul({ 'class': ['list-group', 'list-group-flush'].join(' ') }, () => {
      return collection.map((model) => {
        return viewFactory.todoListItem(model);
      });
    }, [
      (element) => {
        collection.on('change', () => {
          element.render();
        });
      }
    ])
  ], []);
}

viewFactory.todoListItem = (model) => {
  return viewFactory.li({ 'class': 'list-group-item' }, [
    viewFactory.input({ 'type': 'checkbox' }, [], []),
    ' ',
    model.entry,
    ' ',
    viewFactory.div({ 'class': 'float-right' }, [
      viewFactory.button({ 'class': ['btn', 'btn-primary'].join(' ')}, [
        'Edit'
      ], []),
      ' ',
      viewFactory.button({ 'class': ['btn', 'btn-danger'].join(' ')}, [
        'Delete'
      ], [])
    ], [])
  ], []);
}