"use strict";

/* global jsmvc */
if (!window.jsmvc) {
  window.jsmvc = {};
}

jsmvc.eventfulPropertyDescriptors = {
  definedBy_eventfulPropertyDescriptors: {
    value: true
  },
  eventfulEnabled: {
    writable: true
  },
  enableEventful: {
    value: function value() {
      this.eventfulEnabled = true;
    }
  },
  disableEventful: {
    value: function value() {
      this.eventfulEnabled = false;
    }
  },
  eventfulData: {
    writable: true
  },
  eventfulReferences: {
    writable: true
  },
  addEvent: {
    value: function value(name, handler) {
      var _this = this;

      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var owner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;
      var eventfulData = {
        handler: handler,
        once: once,
        owner: owner
      };

      if (this instanceof EventTarget) {
        var listener = function listener() {
          var handler = eventfulData.handler,
              once = eventfulData.once,
              owner = eventfulData.owner;
          handler.apply(void 0, arguments);

          if (once) {
            _this.removeEvents(name, handler, once, owner);
          }
        };

        this.addEventListener(name, listener, {
          once: once
        });
        eventfulData.listener = listener;
      }

      if (!this.eventfulData) {
        this.eventfulData = {};
      }

      if (!this.eventfulData[name]) {
        this.eventfulData[name] = [];
      }

      this.eventfulData[name].push(eventfulData);

      if (owner && owner !== this && owner.definedBy_eventfulPropertyDescriptors) {
        if (!owner.eventfulReferences) {
          owner.eventfulReferences = {};
        }

        if (!owner.eventfulReferences[name]) {
          owner.eventfulReferences[name] = [];
        }

        owner.eventfulReferences[name].push({
          emitter: this,
          eventfulData: eventfulData
        });
      }

      return this;
    }
  },
  removeEvents: {
    value: function value(name, handler, once, owner) {
      if (this.eventfulData) {
        for (var key in this.eventfulData) {
          if (name == null || key === name) {
            var index1 = 0;

            while (index1 < this.eventfulData[key].length) {
              var eventfulData = this.eventfulData[key][index1];

              if ((handler == null || eventfulData.handler === handler) && (once == null || eventfulData.once === once) && (owner == null || eventfulData.owner === owner)) {
                if (this instanceof EventTarget) {
                  this.removeEventListener(key, eventfulData.listener);
                }

                this.eventfulData[key].splice(index1, 1);

                if (owner && owner !== this && owner.definedBy_eventfulPropertyDescriptors) {
                  if (owner.eventfulReferences[key]) {
                    var index2 = 0;

                    while (index2 > owner.eventfulReferences[key].length) {
                      var eventfulReference = owner.eventfulReferences[key][index2];

                      if (eventfulReference.emitter === this && eventfulReference.eventfulData === eventfulData) {
                        owner.eventfulReferences.splice(index2, 1);
                      } else {
                        index2++;
                      }
                    }
                  }
                }
              } else {
                index1++;
              }
            }

            if (name != null) {
              break;
            }
          }
        }
      }

      return this;
    }
  },
  triggerEvents: {
    value: function value(name) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.eventfulEnabled !== false && this.eventfulData && this.eventfulData[name]) {
        this.eventfulData[name].forEach(function (_ref) {
          var handler = _ref.handler,
              owner = _ref.owner;
          handler.call.apply(handler, [owner].concat(args));
        });
        this.removeEvents(name, null, true, null);
      }

      return this;
    }
  },
  addEmitterEvent: {
    value: function value(emitter, name, handler, once) {
      if (emitter.definedBy_eventfulPropertyDescriptors) {
        emitter.addEvent(name, handler, once, this);
      }

      return this;
    }
  },
  removeEmitterEvents: {
    value: function value(emitter, name, handler, once) {
      var _this2 = this;

      if (this.eventfulReferences) {
        var _loop = function _loop(key) {
          if (name == null || key === name) {
            var emitters = [];

            for (var index = 0, length = _this2.eventfulReferences[key].length; index < length; index++) {
              var eventfulReference = _this2.eventfulReferences[key][index];

              if (emitter == null || eventfulReference.emitter === emitter) {
                if (emitters.indexOf(eventfulReference.emitter) === -1) {
                  emitters.push(eventfulReference.emitter);
                }
              }

              if (emitter != null) {
                break;
              }
            }

            emitters.forEach(function (emitter) {
              if (emitter.definedBy_eventfulPropertyDescriptors) {
                emitter.removeEvents(key, handler, once, _this2);
              }
            });

            if (name != null) {
              return "break";
            }
          }
        };

        for (var key in this.eventfulReferences) {
          var _ret = _loop(key);

          if (_ret === "break") break;
        }
      }

      return this;
    }
  }
};
jsmvc.eventfulPropertyDescriptors.on = jsmvc.eventfulPropertyDescriptors.addEvent;
jsmvc.eventfulPropertyDescriptors.off = jsmvc.eventfulPropertyDescriptors.removeEvents;
jsmvc.eventfulPropertyDescriptors.trigger = jsmvc.eventfulPropertyDescriptors.triggerEvents;
jsmvc.eventfulPropertyDescriptors.listenTo = jsmvc.eventfulPropertyDescriptors.addEmitterEvent;
jsmvc.eventfulPropertyDescriptors.stopListening = jsmvc.eventfulPropertyDescriptors.removeEmitterEvents;

jsmvc.eventful = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!obj.definedBy_eventfulPropertyDescriptors) {
    Object.defineProperties(obj, jsmvc.eventfulPropertyDescriptors);
  }

  return obj;
};