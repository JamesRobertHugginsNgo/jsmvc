/* exported eventfulPropertyDescriptors */
const eventfulPropertyDescriptors = {
  hasEventfulPropertyDescriptors: {
    value: true
  },

  __eventData: {
    writable: true
  },

  __eventReferences: {
    writable: true
  },

  on: {
    value(name, handler, once = false, context = this) {
      const eventData = {
        name,
        handler,
        once,
        context
      };

      if (this.addEventListener) {
        eventData.listener = once
          ? (...args) => {
            handler(...args);
            this.off(name, handler, once, context, { calledFromListener: true });
          }
          : handler;
        this.addEventListener(name, eventData.listener, { once });
      }

      if (!this.__eventData) {
        this.__eventData = [];
      }
      this.__eventData.push(eventData);

      if (context && context !== this && context.hasEventfulPropertyDescriptors) {
        if (!context.__eventReferences) {
          context.__eventReferences = [];
        }
        context.__eventReferences.push({
          emitter: this,
          eventData
        });
      }

      return this;
    }
  },

  off: {
    value(name, handler, once, context, options = {}) {
      if (!this.__eventData) {
        return this;
      }

      let index = 0;
      while (index < this.__eventData.length) {
        const eventData = this.__eventData[index];
        if ((name == null || name === eventData.name)
          && (handler == null || handler === eventData.handler)
          && (once == null || once === eventData.once)
          && (context == null || context === eventData.context)) {

          if (this.removeEventListener && !options.calledFromListener) {
            this.removeEventListener(eventData.name, eventData.listener);
          }

          this.__eventData.splice(index, 1);

          if (context && context !== this && context.hasEventfulPropertyDescriptors && context.__eventReferences) {
            let index2 = 0
            while (index2 > context.__eventReferences.length) {
              const eventReference = context.__eventReferences[index2];
              if (eventReference.emitter === this && eventReference.eventData === eventData) {
                context.__eventReferences.splice(index2, 1);
              } else {
                index2++;
              }
            }
          }

          // if (this.addEventListener) {
          //   this.addEventListener(name, (...args) => {
          //     this.trigger(name, ...args);
          //   });
          // }

        } else {
          index++;
        }
      }

      return this;
    }
  },

  trigger: {
    value(name, ...args) {
      this.__eventData.forEach((eventData) => {
        if (name === eventData.name) {
          eventData.handler.call(eventData.context, ...args);
        }
      });

      this.off(name, null, true, null);

      return this;
    }
  },

  removeEventReferences: {
    value(emitter, eventData) {
      if (!this.__eventReferences) {
        return this;
      }

      const eventReferences = Array.from(this.__eventReferences);
      eventReferences.forEach((eventReference) => {
        if ((emitter == null || emitter === eventReference.emitter)
          && (eventData == null || eventData === eventReference.eventData)) {

          const { name, handler, once, context } = eventReference.eventData;
          eventReference.emitter.off(name, handler, once, context);
        }
      });

      return this;
    }
  }
};