/* global jsmvc */

if (!window.jsmvc) {
  window.jsmvc = {};
}

jsmvc.modelPropertyDescriptors = {
  definedBy_modelPropertyDescriptors: {
    value: true
  },

  propertyData: {
    writable: true
  },

  setProperty: {
    value(name, value = this[name], setter = (value, basicSetter) => basicSetter(),
      getter = (basicGetter) => basicGetter()) {

      const propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);
      if (!propertyDescriptor || (!propertyDescriptor.get && !propertyDescriptor.set)) {
        if (value !== undefined) {
          if (!this.propertyData) {
            this.propertyData = {};
          }
          this.propertyData[name] = value;
        }

        delete this[name];

        Object.defineProperty(this, name, {
          configurable: true,
          enumerable: true,
          set(value) {
            if (!this.propertyData || this.propertyData[name] !== value) {
              let oldValue;
              if (this.propertyData && this.propertyData[name] !== undefined) {
                oldValue = this.propertyData[name];
              }

              setter.call(this, value, () => {
                if (!this.propertyData) {
                  this.propertyData = {};
                }
                this.propertyData[name] = value;

                if (this.definedBy_eventfulPropertyDescriptors) {
                  this.triggerEvents('change', name, value, oldValue);
                  this.triggerEvents(`change:${name}`, value, oldValue);
                }
              });
            }
          },
          get() {
            return getter.call(this, () => {
              if (this.propertyData) {
                return this.propertyData[name];
              }
              return;
            });
          }
        });
      }

      return this;
    }
  },

  unsetProperty: {
    value(name) {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);
      if (propertyDescriptor && (propertyDescriptor.get || propertyDescriptor.set)) {
        let value;
        if (this.propertyData) {
          value = this.propertyData[name];
        }

        delete this.propertyData[name];
        delete this[name];

        if (value !== undefined) {
          this[name] = value;
        }
      }

      return this;
    }
  },

  toJSON: {
    value() {
      const json = Object.assign({}, this.propertyData);
      for (const key in json) {
        if (json[key].definedBy_modelPropertyDescriptors) {
          json[key] = json[key].toJSON();
        }
        if (json[key].definedBy_collectionPropertyDescriptors) {
          json[key] = json[key].toArray();
        }
      }
      return json;
    }
  }
};

jsmvc.model = (obj = {}) => {
  if (jsmvc.eventful) {
    obj = jsmvc.eventful(obj);
  }

  if (!obj.definedBy_modelPropertyDescriptors) {
    Object.defineProperties(obj, jsmvc.modelPropertyDescriptors);
  }

  for (const key in obj) {
    obj.setProperty(key);
  }

  return obj;
};