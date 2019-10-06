# JavaScript MVC

Another JavaScript implementation of the MVC design pattern, through the use of JavaScript object's property descriptors, with factory functions for convenience.

## Eventful

## Eventful Property Descriptors

``` JavaScript
const eventfulObject = {};

// Initialize
Object.defineProperties(eventfulObject, eventfulPropertyDescriptors);

// Add Event Handlers
eventfulObject.on('event1', function handler(value) {
  console.log('event1', value);
});
eventfulObject.on('event2', function handler(value) {
  console.log('event2', value);
});

// Remove Event Handler
eventfulObject.off('event2');

// Trigger Event Handlers
eventfulObject.trigger('event1', 123); // Logs "event1 123"
eventfulObject.trigger('event2', 'abc'); // Logs nothing

// Cleanup
eventfulObject.removeEventReferences();
eventfulObject = null;
```

Adds the following properties to an object.

Property | Description
-- | --
__eventData | Type:<br>[eventfulEventDataObject]<br><br>Holds event related data to be managed.
__eventReferences | Type:<br>[eventfulEventReferenceObject]
definedByEventfulPropertyDescriptors | Type:<br>boolean
off | Type:<br>(string, function, boolean, object) => object
on | Type:<br>(string, function, boolean, object) => object
removeEventReferences | Type:<br>(object, eventfulEventDataObject) => object
trigger | -

## Model

Coming soon...

### Property Descriptors

Coming soon...

### Factory

Coming soon...

## Collection

Coming soon...

### Property Descriptors

Coming soon...

### Factory

Coming soon...

## View

Coming soon...

### Property Descriptors

Coming soon...

### Factory

Coming soon...