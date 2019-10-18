/* global jsmvc */

/**
 * An object property descriptor used to add eventful properties to an object.
 * @memberof jsmvc
 * 
 * @property {object} definedBy_eventfulPropertyDescriptors Adds a flag used to determin if the object was defined with jsmvc.eventfulPropertyDescriptors
 * @property {object} eventfulEnabled Adds a property representing the object's enable state
 * @property {object} enableEventful Adds a method used to set the enable state to enabled
 * @property {object} disableEventful Adds a method used to set the enable state to disabled
 * @property {object} eventfulData Adds a property to hold event related data
 * @property {object} eventfulReferences Adds a property to hold event related data of another object
 * @property {object} addEvent Adds a method for adding event handler to an event
 * @property {object} removeEvents Adds a method for removing event handler to an event
 * @property {object} triggerEvents Adds a method for triggering event handler of an event
 * @property {object} addEmitterEvent Adds a method for adding event handler to an event of another object
 * @property {object} removeEmitterEvents Adds a method for removing event handler to an event of another object
 * @property {object} on Alias to addEvent method
 * @property {object} off Alias to removeEvents method
 * @property {object} trigger Alias to triggerEvents method
 * @property {object} listenTo Alias to addEmitterEvent method
 * @property {object} stopListening Alias to removeEmitterEvents method
 * 
 * @example
 * const obj = {};
 * Object.defineProperties(obj, jsmvc.eventfulPropertyDescriptors);
 * 
 * // Add an event handler
 * obj.on('test', () => { console.log('test1'); });
 * 
 * // Add another event handler
 * const handler = () => { console.log('test2'); };
 * obj.on('test', handler);
 * 
 * // Remove event handler
 * obj.off('test', handler);
 * 
 * obj.trigger('test')
 */
jsmvc.eventfulPropertyDescriptors = {
  definedBy_eventfulPropertyDescriptors: {
    value: true
  },

  eventfulEnabled: {
    writable: true
  },

  enableEventful: {
    value() {
      this.eventfulEnabled = true;
    }
  },

  disableEventful: {
    value() {
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
    value(name, handler, once = false, owner = this) {
      const eventfulData = { handler, once, owner };

      if (this instanceof EventTarget) {
        const listener = (...args) => {
          const { handler, once, owner } = eventfulData;
          handler(...args);
          if (once) {
            this.removeEvents(name, handler, once, owner);
          }
        };
        this.addEventListener(name, listener, { once });
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
        owner.eventfulReferences[name].push({ emitter: this, eventfulData });
      }

      return this;
    }
  },

  removeEvents: {
    value(name, handler, once, owner) {
      if (this.eventfulData) {
        for (const key in this.eventfulData) {
          if (name == null || key === name) {
            let index1 = 0;
            while (index1 < this.eventfulData[key].length) {
              const eventfulData = this.eventfulData[key][index1];

              if ((handler == null || eventfulData.handler === handler)
                && (once == null || eventfulData.once === once)
                && (owner == null || eventfulData.owner === owner)) {

                if (this instanceof EventTarget) {
                  this.removeEventListener(key, eventfulData.listener);
                }

                this.eventfulData[key].splice(index1, 1);

                if (owner && owner !== this && owner.definedBy_eventfulPropertyDescriptors) {
                  if (owner.eventfulReferences[key]) {
                    let index2 = 0;
                    while (index2 > owner.eventfulReferences[key].length) {
                      const eventfulReference = owner.eventfulReferences[key][index2];
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
    value(name, ...args) {
      if (this.eventfulEnabled !== false && this.eventfulData && this.eventfulData[name]) {
        this.eventfulData[name].forEach(({ handler, owner }) => {
          handler.call(owner, ...args);
        });

        this.removeEvents(name, null, true, null);
      }

      return this;
    }
  },

  addEmitterEvent: {
    value(emitter, name, handler, once) {
      if (emitter.definedBy_eventfulPropertyDescriptors) {
        emitter.addEvent(name, handler, once, this);
      }

      return this;
    }
  },

  removeEmitterEvents: {
    value(emitter, name, handler, once) {
      if (this.eventfulReferences) {
        for (const key in this.eventfulReferences) {
          if (name == null || key === name) {
            const emitters = [];

            for (let index = 0, length = this.eventfulReferences[key].length; index < length; index++) {
              const eventfulReference = this.eventfulReferences[key][index];
              if (emitter == null || eventfulReference.emitter === emitter) {
                if (emitters.indexOf(eventfulReference.emitter) === -1) {
                  emitters.push(eventfulReference.emitter);
                }
              }

              if (emitter != null) {
                break;
              }
            }

            emitters.forEach((emitter) => {
              if (emitter.definedBy_eventfulPropertyDescriptors) {
                emitter.removeEvents(key, handler, once, this);
              }
            });

            if (name != null) {
              break;
            }
          }
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

/**
 * A factory function used to define jsmvc.eventfulPropertyDescriptors to an object.
 * @memberof jsmvc
 * 
 * @function
 * @argument {object} obj
 * @returns {object}
 * 
 * @example
 * const obj = {};
 * obj = jsmvc.eventful(obj);
 */
jsmvc.eventful = (obj = {}) => {
  if (!obj.definedBy_eventfulPropertyDescriptors) {
    Object.defineProperties(obj, jsmvc.eventfulPropertyDescriptors);
  }

  return obj;
};
