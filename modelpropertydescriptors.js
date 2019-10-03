/* exported modelPropertyDescriptors */
const modelPropertyDescriptors = {
  hasModelPropertyDescriptors: {
    value: true
  },

  __propertyData: {
    writable: true
  },

  property: {
    value(name, value = this[name], getter = function (returnFunction) { return returnFunction; },
      setter = function (value, mainFunction) { mainFunction(); }) {

      if (!this.__propertyData) {
        this.__propertyData = {};
      }

      if (value !== undefined) {
        this.__propertyData[name] = value;
      }

      delete this[name];

      Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        get() {
          return getter.call(this, () => {
            return this.__propertyData[name];
          });
        },
        set(value) {
          if (this.__propertyData[name] !== value) {
            const oldValue = this.__propertyData[name];

            setter.call(this, value, () => {
              this.__propertyData[name] = value;
            });

            if (this.hasEventfulPropertyDescriptors) {
              this.trigger('change', name, value, oldValue);
              this.trigger(`change:${name}`, value, oldValue);
            }
          }
        }
      })
    }
  },

  unproperty: {
    value(name) {
      const value = this.__propertyData[name];

      delete this.__propertyData[name];
      delete this[name];

      if (value !== undefined) {
        this[name] = value;
      }
    }
  },

  toJSON: {
    value() {
      return Object.assign({}, this.__propertyData);
    }
  }
};