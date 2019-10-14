/* global jsmvc */

function todo() {
  const c = jsmvc.collection();

  const v = jsmvc.view;
  return v.div({ 'class': 'todo' }, [
    todoEntry(c),
    todoList(c),
    todoCompleteList(c)
  ], []);
}

function todoEntry(collection) {
  const v = jsmvc.view;
  let input;
  return v.div({ 'class': 'card' }, [
    v.div({ 'class': 'card-body' }, [
      v.div({ 'class': 'form-row' }, [
        v.div({ 'class': 'col form-group', 'style': 'margin-bottom: 0;' }, [
          input = v.input({ 'class': 'form-control', 'type': 'text' }, [], [])
        ], []),
        v.div({ 'class': 'col-auto' }, [
          v.button({ 'class': 'btn btn-primary', 'type': 'button' }, [
            'Add'
          ], [
            (element) => {
              element.on('click', () => {
                const m = jsmvc.model;
                collection.push(m({ completed: false, editable: false, entry: input.value }));
                input.value = '';
              });
            }
          ])
        ], [])
      ], [])
    ], [])
  ], []);
}

function todoList(collection) {
  const v = jsmvc.view;
  return v.div({ 'class': 'card' }, [
    v.div({ 'class': 'card-header' }, ['TO DO'], []),
    v.ul({ 'class': 'list-group' }, () => {
      if (collection.filter((item) => !item.completed).length === 0) {
        return v.li({ 'class': 'list-group-item' }, [
          'EMPTY'
        ], []);
      } else {
        return collection.map((item, index) => {
          if (!item.completed) {
            let input;
            return v.li({ 'class': 'list-group-item' }, [
              v.div({ 'class': 'form-row' }, [
                v.div({ 'class': 'col-auto' }, [
                  v.input({ 'type': 'checkbox' }, [], [
                    (element) => {
                      element.on('click', () => {
                        collection.splice(index, 1);
                        item.completed = true;
                        collection.push(item);
                      });
                    }
                  ])
                ], []),
                v.div({ 'class': 'col' }, [
                  () => {
                    input = null;

                    if (item.editable) {
                      return input = v.input({ 'class': 'form-control', 'type': 'text', 'value': item.entry }, [], []);
                    }

                    return item.entry;
                  }
                ], [
                  (element) => {
                    item.on('change:editable', () => {
                      element.render();
                    });
                  }
                ]),
                v.div({ 'class': 'col-auto' }, [
                  () => {
                    if (item.editable) {
                      return [
                        v.button({ 'class': 'btn btn-secondary' }, [
                          'Cancel'
                        ], [
                          (element) => {
                            element.on('click', () => {
                              item.editable = false;
                            });
                          }
                        ]),
                        ' ',
                        v.button({ 'class': 'btn btn-secondary' }, [
                          'Save'
                        ], [
                          (element) => {
                            element.on('click', () => {
                              if (input) {
                                item.entry = input.value;
                              }
                              item.editable = false;
                            });
                          }
                        ])
                      ];
                    }

                    return v.button({ 'class': 'btn btn-secondary' }, [
                      'Edit'
                    ], [
                      (element) => {
                        element.on('click', () => {
                          item.editable = true;
                        });
                      }
                    ]);
                  },
                  ' ',
                  v.button({ 'class': 'btn btn-danger' }, [
                    'Delete'
                  ], [
                    (element) => {
                      element.on('click', () => {
                        collection.splice(index, 1);
                      });
                    }
                  ])
                ], [
                  (element) => {
                    item.on('change:editable', () => {
                      element.render();
                    });
                  }
                ])
              ], [])
            ], []);
          }
        });
      }
    }, [
      (element) => {
        collection.on('change', () => {
          element.render();
        });
      }
    ])
  ], []);
}

function todoCompleteList(collection) {
  const v = jsmvc.view;
  return v.div({ 'class': 'card' }, [
    v.div({ 'class': 'card-header' }, [
      'COMPLETED'
    ], []),
    v.ul({ 'class': 'list-group' }, () => {
      if (collection.filter((item) => item.completed).length === 0) {
        return v.li({ 'class': 'list-group-item' }, [
          'EMPTY'
        ], []);
      } else {
        return collection.map((item, index) => {
          if (item.completed) {
            let input;
            return v.li({ 'class': 'list-group-item' }, [
              v.div({ 'class': 'form-row' }, [
                v.div({ 'class': 'col-auto' }, [
                  v.input({ 'checked': true, 'type': 'checkbox' }, [], [
                    (element) => {
                      element.on('click', () => {
                        collection.splice(index, 1);
                        item.completed = false;
                        collection.push(item);
                      });
                    }
                  ])
                ], []),
                v.div({ 'class': 'col' }, [
                  () => {
                    input = null;

                    if (item.editable) {
                      return input = v.input({ 'class': 'form-control', 'type': 'text', 'value': item.entry }, [], []);
                    }

                    return v.s({}, [item.entry], []);
                  }
                ], [
                  (element) => {
                    item.on('change:editable', () => {
                      element.render();
                    });
                  }
                ]),
                v.div({ 'class': 'col-auto' }, [
                  () => {
                    if (item.editable) {
                      return [
                        v.button({ 'class': 'btn btn-secondary' }, [
                          'Cancel'
                        ], [
                          (element) => {
                            element.on('click', () => {
                              item.editable = false;
                            });
                          }
                        ]),
                        ' ',
                        v.button({ 'class': 'btn btn-secondary' }, [
                          'Save'
                        ], [
                          (element) => {
                            element.on('click', () => {
                              if (input) {
                                item.entry = input.value;
                              }
                              item.editable = false;
                            });
                          }
                        ])
                      ];
                    }

                    return v.button({ 'class': 'btn btn-secondary' }, [
                      'Edit'
                    ], [
                      (element) => {
                        element.on('click', () => {
                          item.editable = true;
                        });
                      }
                    ]);
                  },
                  ' ',
                  v.button({ 'class': 'btn btn-danger' }, [
                    'Delete'
                  ], [
                    (element) => {
                      element.on('click', () => {
                        collection.splice(index, 1);
                      });
                    }
                  ])
                ], [
                  (element) => {
                    item.on('change:editable', () => {
                      element.render();
                    });
                  }
                ])
              ], [])
            ], []);
          }
        });
      }
    }, [
      (element) => {
        collection.on('change', () => {
          element.render();
        });
      }
    ])
  ], []);
}

const todoElement = document.getElementById('todo');

const config = {};

todoElement.appendChild(todo(config));