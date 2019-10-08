/* exported eventfulPropertyDescriptors */
const eventfulPropertyDescriptors = {
  definedByEventfulPropertyDescriptors: {
    value: true
  },

  __handlerData: {
    writable: true
  },

  __handlerReferences: {
    writable: true
  },

  addHandler: {
    value(name, handler, once = false, owner = this, enabled = true) {
      const handlerData = { handler, once, owner, enabled };

      if (this.addEventListener) {
        const eventListener = (...args) => {
          if (handlerData.enabled) {
            handler(...args);
            if (handlerData.once) {
              this.removeHandlers(handlerData.name, handlerData.handler, handlerData.once, handlerData.owner, null,
                { calledFromEventListener: true });
            }
          }
        };
        this.addEventListener(name, eventListener, { once });

        handlerData.listener = eventListener;
      }

      if (!this.__handlerData) {
        this.__handlerData = {};
      }
      if (!this.__handlerData[name]) {
        this.__handlerData[name] = [];
      }
      this.__handlerData[name].push(handlerData);

      if (owner && owner !== this && owner.definedByEventfulPropertyDescriptors) {
        if (!owner.__handlerReferences) {
          owner.__handlerReferences = {};
        }
        if (!owner.__handlerReferences[name]) {
          owner.__handlerReferences[name] = [];
        }
        owner.__handlerReferences[name].push({ emitter: this, handlerData });
      }

      return this;
    }
  },

  removeHandlers: {
    value(name, handler, once, owner, enabled, options = {}) {
      if (!this.__handlerData) {
        return this;
      }

      for (const key in this.__handlerData) {
        if (name == null || name === key) {
          let index = 0;
          while (index < this.__handlerData[key].length) {
            const handlerData = this.__handlerData[key][index];
            if ((handler == null || handler === handlerData.handler)
              && (once == null || once === handlerData.once)
              && (owner == null || owner === handlerData.owner)
              && (enabled == null || enabled === handlerData.enabled)) {

              if (this.removeEventListener && !options.calledFromEventListener) {
                this.removeEventListener(key, handlerData.listener);
              }

              this.__handlerData[key].splice(index, 1);

              if (owner && owner !== this && owner.definedByEventfulPropertyDescriptors && owner.__handlerReferences
                && owner.__handlerReferences[key] && !options.calledFromCleanUpHandlers) {

                let index2 = 0;
                while (index2 > owner.__handlerReferences[key].length) {
                  const handlerReferences = owner.__handlerReferences[key][index2];
                  if (handlerReferences.emitter === this && handlerReferences.handlerData === handlerData) {
                    owner.__handlerReferences.splice(index2, 1);
                  } else {
                    index2++;
                  }
                }
              }
            } else {
              index++;
            }
          }

          if (name != null) {
            break;
          }
        }
      }

      return this;
    }
  },

  enableHandlers: {
    value(name, handler, once, owner, enabled) {
      if (!this.__handlerData) {
        return this;
      }

      for (const key in this.__handlerData) {
        if (name == null || name === key) {
          this.__handlerData[key].forEach((handlerData, index) => {
            if ((handler == null || handler === handlerData.handler)
              && (once == null || once === handlerData.once)
              && (owner == null || owner === handlerData.owner)
              && (enabled == null || enabled === handlerData.enabled)) {

              this.__handlerData[key][index].enabled = true;
            }
          });
        }
      }

      return this;
    }
  },

  disableHandlers: {
    value(name, handler, once, owner, enabled) {
      if (!this.__handlerData) {
        return this;
      }

      for (const key in this.__handlerData) {
        if (name == null || name === key) {
          this.__handlerData[key].forEach((handlerData, index) => {
            if ((handler == null || handler === handlerData.handler)
              && (once == null || once === handlerData.once)
              && (owner == null || owner === handlerData.owner)
              && (enabled == null || enabled === handlerData.enabled)) {

              this.__handlerData[key][index].enabled = false;
            }
          });
        }
      }

      return this;
    }
  },

  triggerHandlers: {
    value(name, ...args) {
      if (!this.__handlerData || !this.__handlerData[name]) {
        return this;
      }

      this.__handlerData[name].forEach((handlerData) => {
        if (handlerData.handler.enabled) {
          handlerData.handler.call(handlerData.context, ...args);
        }
      });

      this.removeHandlers(name, null, true, null, true);

      return this;
    }
  },

  cleanUpHandlers: {
    value() {
      this.removeHandlers();

      if (!this.__handlerReferences) {
        return this;
      }

      for (const key in this.__handlerReferences) {
        this.__handlerReferences[key].forEach((handlerReference) => {
          const { handler, once } = handlerReference.eventData;
          handlerReference.emitter.removeHandlers(key, handler, once, this, null, { calledFromCleanUpHandlers: true });
        });
      }

      return this;
    }
  }
};