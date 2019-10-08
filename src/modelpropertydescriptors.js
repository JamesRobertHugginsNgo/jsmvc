/* global eventfulPropertyDescriptors */

/* exported modelPropertyDescriptors */
const modelPropertyDescriptors = {
  definedByModelPropertyDescriptors: {
    value: true
  },

  __propertyData: {
    writable: true
  },

  setProperty: {
    value(name, value = this[name], setter = (value, basicSetter) => { basicSetter(); },
      getter = (basicGetter) => { return basicGetter(); }) {

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
        set(value) {
          if (this.__propertyData[name] !== value) {
            const oldValue = this.__propertyData[name];
            setter.call(this, value, () => {
              if (this.definedByEventfulPropertyDescriptors && oldValue !== value) {
                this.__propertyData[name] = value;
                this.trigger('change', name, value, oldValue);
                this.trigger(`change:${name}`, value, oldValue);
              }
            });
          }
        },
        get() {
          return getter.call(this, () => {
            return this.__propertyData[name];
          });
        }
      });
    }
  },

  unsetProperty: {
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

/* exported modelFactory */
function modelFactory(obj = {}) {
  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByModelPropertyDescriptors) {
    Object.defineProperties(obj, modelPropertyDescriptors);
  }

  for (const key in obj) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (!propertyDescriptor.get && !propertyDescriptor.set) {
      obj.property(key);
    }
  }

  return obj;
}