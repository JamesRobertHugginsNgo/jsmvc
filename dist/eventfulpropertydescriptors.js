"use strict";

/* exported eventfulPropertyDescriptors */
var eventfulPropertyDescriptors = {
  definedByEventfulPropertyDescriptors: {
    value: true
  },
  __eventData: {
    writable: true
  },
  __eventReferences: {
    writable: true
  },
  on: {
    value: function value(name, handler) {
      var _this = this;

      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;
      var eventData = {
        name: name,
        handler: handler,
        once: once,
        context: context
      };

      if (this.addEventListener) {
        eventData.listener = once ? function () {
          handler.apply(void 0, arguments);

          _this.off(name, handler, once, context, {
            calledFromListener: true
          });
        } : handler;
        this.addEventListener(name, eventData.listener, {
          once: once
        });
      }

      if (!this.__eventData) {
        this.__eventData = [];
      }

      this.__eventData.push(eventData);

      if (context && context !== this && context.definedByEventfulPropertyDescriptors) {
        if (!context.__eventReferences) {
          context.__eventReferences = [];
        }

        context.__eventReferences.push({
          emitter: this,
          eventData: eventData
        });
      }

      return this;
    }
  },
  off: {
    value: function value(name, handler, once, context) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      if (!this.__eventData) {
        return this;
      }

      var index = 0;

      while (index < this.__eventData.length) {
        var eventData = this.__eventData[index];

        if ((name == null || name === eventData.name) && (handler == null || handler === eventData.handler) && (once == null || once === eventData.once) && (context == null || context === eventData.context)) {
          if (this.removeEventListener && !options.calledFromListener) {
            this.removeEventListener(eventData.name, eventData.listener);
          }

          this.__eventData.splice(index, 1);

          if (context && context !== this && context.definedByEventfulPropertyDescriptors && context.__eventReferences) {
            var index2 = 0;

            while (index2 > context.__eventReferences.length) {
              var eventReference = context.__eventReferences[index2];

              if (eventReference.emitter === this && eventReference.eventData === eventData) {
                context.__eventReferences.splice(index2, 1);
              } else {
                index2++;
              }
            }
          }
        } else {
          index++;
        }
      }

      return this;
    }
  },
  trigger: {
    value: function value(name) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!this.__eventData) {
        return this;
      }

      this.__eventData.forEach(function (eventData) {
        if (name === eventData.name) {
          var _eventData$handler;

          (_eventData$handler = eventData.handler).call.apply(_eventData$handler, [eventData.context].concat(args));
        }
      });

      this.off(name, null, true, null);
      return this;
    }
  },
  removeEventReferences: {
    value: function value(emitter, eventData) {
      if (!this.__eventReferences) {
        return this;
      }

      var eventReferences = Array.from(this.__eventReferences);
      eventReferences.forEach(function (eventReference) {
        if ((emitter == null || emitter === eventReference.emitter) && (eventData == null || eventData === eventReference.eventData)) {
          var _eventReference$event = eventReference.eventData,
              name = _eventReference$event.name,
              handler = _eventReference$event.handler,
              once = _eventReference$event.once,
              context = _eventReference$event.context;
          eventReference.emitter.off(name, handler, once, context);
        }
      });
      return this;
    }
  }
};