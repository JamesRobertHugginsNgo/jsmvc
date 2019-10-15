"use strict";

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
    value: function value(name) {
      var _value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[name];

      var setter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (value, basicSetter) {
        return basicSetter();
      };
      var getter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (basicGetter) {
        return basicGetter();
      };
      var propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);

      if (!propertyDescriptor || !propertyDescriptor.get && !propertyDescriptor.set) {
        if (_value !== undefined) {
          if (!this.propertyData) {
            this.propertyData = {};
          }

          this.propertyData[name] = _value;
        }

        delete this[name];
        Object.defineProperty(this, name, {
          configurable: true,
          enumerable: true,
          set: function set(value) {
            var _this = this;

            if (!this.propertyData || this.propertyData[name] !== value) {
              var oldValue;

              if (this.propertyData && this.propertyData[name] !== undefined) {
                oldValue = this.propertyData[name];
              }

              setter.call(this, value, function () {
                if (!_this.propertyData) {
                  _this.propertyData = {};
                }

                _this.propertyData[name] = value;

                if (_this.definedBy_eventfulPropertyDescriptors) {
                  _this.triggerEvents('change', name, value, oldValue);

                  _this.triggerEvents("change:".concat(name), value, oldValue);
                }
              });
            }
          },
          get: function get() {
            var _this2 = this;

            return getter.call(this, function () {
              if (_this2.propertyData) {
                return _this2.propertyData[name];
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
    value: function value(name) {
      var propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);

      if (propertyDescriptor && (propertyDescriptor.get || propertyDescriptor.set)) {
        var value;

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
    value: function value() {
      var json = Object.assign({}, this.propertyData);

      for (var key in json) {
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

jsmvc.model = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (jsmvc.eventful) {
    obj = jsmvc.eventful(obj);
  }

  if (!obj.definedBy_modelPropertyDescriptors) {
    Object.defineProperties(obj, jsmvc.modelPropertyDescriptors);
  }

  for (var key in obj) {
    obj.setProperty(key);
  }

  return obj;
};