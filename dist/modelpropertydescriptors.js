"use strict";

/* exported modelPropertyDescriptors */
var modelPropertyDescriptors = {
  definedByModelPropertyDescriptors: {
    value: true
  },
  __propertyData: {
    writable: true
  },
  property: {
    value: function value(name) {
      var _value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[name];

      var getter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (returnFunction) {
        return returnFunction();
      };
      var setter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (value, mainFunction) {
        mainFunction();
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
        get: function get() {
          var _this = this;

          return getter.call(this, function () {
            return _this.__propertyData[name];
          });
        },
        set: function set(value) {
          var _this2 = this;

          if (this.__propertyData[name] !== value) {
            var oldValue = this.__propertyData[name];
            setter.call(this, value, function () {
              _this2.__propertyData[name] = value;
            });

            if (this.definedByEventfulPropertyDescriptors) {
              this.trigger('change', name, value, oldValue);
              this.trigger("change:".concat(name), value, oldValue);
            }
          }
        }
      });
    }
  },
  unproperty: {
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