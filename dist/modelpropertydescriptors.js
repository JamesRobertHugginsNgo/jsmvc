"use strict";

/* global eventfulPropertyDescriptors */

/* exported modelPropertyDescriptors */
var modelPropertyDescriptors = {
  definedByModelPropertyDescriptors: {
    value: true
  },
  __propertyData: {
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

      if (!this.__propertyData) {
        this.__propertyData = {};
      }

      if (_value !== undefined) {
        this.__propertyData[name] = _value;
      }

      delete this[name];
      Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        set: function set(value) {
          var _this = this;

          if (this.__propertyData[name] !== value) {
            var oldValue = this.__propertyData[name];
            setter.call(this, value, function () {
              if (_this.definedByEventfulPropertyDescriptors) {
                _this.__propertyData[name] = value;

                _this.trigger('change', name, value, oldValue);

                _this.trigger("change:".concat(name), value, oldValue);
              }
            });
          }
        },
        get: function get() {
          var _this2 = this;

          return getter.call(this, function () {
            return _this2.__propertyData[name];
          });
        }
      });
    }
  },
  unsetProperty: {
    value: function value(name) {
      var value = this.__propertyData[name];
      delete this.__propertyData[name];
      delete this[name];

      if (value !== undefined) {
        this[name] = value;
      }
    }
  },
  toJSON: {
    value: function value() {
      return Object.assign({}, this.__propertyData);
    }
  }
};
/* exported modelFactory */

function modelFactory() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByModelPropertyDescriptors) {
    Object.defineProperties(obj, modelPropertyDescriptors);
  }

  for (var key in obj) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (!propertyDescriptor.get && !propertyDescriptor.set) {
      obj.setProperty(key);
    }
  }

  return obj;
}