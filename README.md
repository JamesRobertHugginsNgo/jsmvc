# JavaScript MVC

MVC design patter in JavaScript.

## Eventful

Enables the Model and View domain to manage event(-ish) functionalities.

### Eventful Property Descriptors

``` JavaScript
const eventful = {};
Object.defineProperties(eventful, viewPropertyDescriptors);
```

### Add Handler

``` JavaScript
const event = 'eventName';
const handler = () => { console.log('EVENT TRIGGERED'); };
const once = false; // Optional, defaults to false.
const owner = eventful; // Optional, defaults to itself.
const enabled = true; // Optional, sets initial value to handler's status.

eventful.addHandler(event, handler, once, owner, enabled);
```

### Remove Handler

``` JavaScript
// All arguments are optionals
const event = 'eventName';
const handler = () => { console.log('EVENT TRIGGERED'); };
const once = false;
const owner = eventful;

eventful.removeHandler(event, handler, once, owner);
```

### Enable Handler

``` JavaScript
// All arguments are optionals
const event = 'eventName';
const handler = () => { console.log('EVENT TRIGGERED'); };
const once = false;
const owner = eventful;

eventful.addHandler(event, handler, once, owner);
```

### Disable Handler

``` JavaScript
// All arguments are optionals
const event = 'eventName';
const handler = () => { console.log('EVENT TRIGGERED'); };
const once = false;
const owner = eventful;

eventful.removeHandler(event, handler, once, owner);
```

### Trigger Handlers

``` JavaScript
const args = [true, 123, 'string', { 'type': 'object' }];
eventful.triggerHandlers(event, ...args);
```

### Clean Up Handlers

Cleans up memory references.

``` JavaScript
eventful1.cleanUpHandlers();
eventful1 = null;
```

## Model Domain

Models holds the data.

### Model Property Descriptors

``` JavaScript
const model = ()
Object.defineProperties(model, modelPropertyDescriptors);
```

### Set Property

``` JavaScript
const name = 'propertyA';
const value = true;
const setter = (value, basicSetter) => { basicSetter(value); };
const getter = (basicGetter) => { return systemGetter(); };

model.setProperty(name, value, setter, getter);
```

### Unset Property

``` JavaScript
const name = 'propertyA';
const value = true;
const setter = (value, basicSetter) => { basicSetter(value); };
const getter = (basicGetter) => { return systemGetter(); };

model.unsetProperty(name, value, setter, getter);
```

## View Domain

Views are the user interfaces.

### View Property Descriptors

Adds view related properties and methods.

``` JavaScript
const view = document.createElement('div');
Object.defineProperties(view, viewPropertyDescriptors);
```

### Define Attributes

Adds the view's attributes definition.

``` JavaScript
const attributes = {
  'id': 'viewId',
  'class': 'viewClassName'
};

view.defineAttributes(attributes);
```

### Render Attributes

Renders the view's attributes definition.

``` JavaScript
const callback = () => {
  console.log('RENDER ATTRIBUTE CALLBACK');
};

view.renderAttributes(callback);

view.renderAttributesPromise.then((element) => {
  console.log('RENDER ATTRIBUTE DONE');
});
```

### Define Child Elements

Adds the view's child elements definition.

``` JavaScript
const childElements = [
  'TEXT CONTENT'
];

view.defineChildElements(childElements);
```

### Render Child Elements

Renders the view's child elements definition.

``` JavaScript
const callback = () => {
  console.log('RENDER CHILD ELEMENTS CALLBACK');
};

view.renderChildElements(callback);

view.renderChildElementsPromise.then((element) => {
  console.log('RENDER CHILD ELEMENTS DONE');
});
```

### Render

Renders the view's attributes and child elements definition.

``` JavaScript
function callback(element) {
  console.log('RENDER CALLBACK', element);
}

view.render(callback);

view.renderPromise
  .then(() => {
    console.log('RENDER DONE');
  });
```

### Factory

A simple way of generating views.

``` JavaScript

const attributes = { 'id': 'viewId', 'class': 'viewClassName' };
const childElements = ['TEXT CONTENT'];

function callback(element) {
  console.log('RENDER COMPLETE', element);
}

const view = viewFactory('div', attributes, childElements, callback);

view.renderPromise
  .then(() => {
    console.log('View Render Completed');
  });
```

### Sample Usage 1 - Simple

``` JavaScript
const vf = viewFactory;

const view = vf('div', { 'id': 'root', 'data-level': 0 }, [
  vf('h1', { 'id': 'heading', 'data-level': 1 }, [
    'HEADING TITLE'
  ], null),

  'BODY CONTENT TEXT',

  vf('p', { 'id': 'footer', 'data-level': 1 }, [
    vf('button', { 'type': 'button', 'data-level': 1 }, [
      'BUTTON 1 LABEL'
    ], (button1Element) => {
      button1Element.addEventListener('click', () => {
        console.log('BUTTON 1 CLICK');
      })
    }),

    vf('button', { 'type': 'button', 'data-level': 1 }, [
      'BUTTON 2 LABEL'
    ], (button2Element) => {
      button2Element.addEventListener('click', () => {
        console.log('BUTTON 2 CLICK');
      })
    })
  ], null)
], null);

document.body.appendChild(view);
```

## Controller Domain

The glue code connecting the models and the views.

Use JavaScript.