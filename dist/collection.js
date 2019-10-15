"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* global jsmvc */
if (!window.jsmvc) {
  window.jsmvc = {};
}

jsmvc.collectionPropertyDescriptors = {
  definedBy_collectionPropertyDescriptors: {
    value: true
  },
  collectionData: {
    writable: true
  },
  length: {
    get: function get() {
      if (this.collectionData) {
        return this.collectionData.length;
      }

      return 0;
    }
  },
  finalizeData: {
    value: function value(startingLength) {
      var _this = this;

      while (startingLength !== this.length) {
        if (startingLength < this.length) {
          (function () {
            var key = String(startingLength);
            Object.defineProperty(_this, key, {
              configurable: true,
              enumerable: true,
              set: function set(value) {
                var _this2 = this;

                if (this.collectionData[key] !== value) {
                  var oldValue = this.collectionData[key];
                  this.itemSetter.call(this, value, function () {
                    _this2.collectionData[key] = value;

                    if (_this2.definedBy_eventfulPropertyDescriptors) {
                      _this2.trigger('change', key, value, oldValue);

                      _this2.trigger("change:".concat(key), value, oldValue);
                    }
                  });
                }
              },
              get: function get() {
                var _this3 = this;

                return this.itemGetter(function () {
                  return _this3.collectionData[key];
                });
              }
            });
            startingLength++;
          })();
        } else {
          delete this[String(startingLength - 1)];
          startingLength--;
        }
      }
    }
  },
  itemSetter: {
    value: function value(_value, basicSetter) {
      basicSetter();
    }
  },
  itemGetter: {
    value: function value(basicGetter) {
      return basicGetter();
    }
  },
  toArray: {
    value: function value() {
      var array = this.collectionData.slice();
      array.forEach(function (value, index) {
        if (value.definedBy_modelPropertyDescriptors) {
          array[index] = value.toJSON();
        }

        if (value.definedBy_collectionPropertyDescriptors) {
          array[index] = value.toArray();
        }
      });
      return array;
    }
  }
};
['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function (method) {
  jsmvc.collectionPropertyDescriptors[method] = {
    value: function value() {
      var _Array$prototype$meth;

      if (!this.collectionData) {
        this.collectionData = [];
      }

      var startingLength = this.length;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var returnValue = (_Array$prototype$meth = Array.prototype[method]).call.apply(_Array$prototype$meth, [this.collectionData].concat(args));

      this.finalizeData(startingLength);

      if (this.definedBy_eventfulPropertyDescriptors) {
        this.triggerEvents('change');
      }

      return returnValue;
    }
  };
});
['concat', 'includes', 'indexOf', 'join', 'lastIndexOf', 'slice', 'toSource', 'toString', 'toLocaleString', 'entries', 'every', 'filter', 'find', 'findIndex', 'forEach', 'keys', 'map', 'reduce', 'reduceRight', 'some', 'values'].forEach(function (method) {
  jsmvc.collectionPropertyDescriptors[method] = {
    value: function value() {
      var _Array$prototype$meth2;

      if (!this.collectionData) {
        this.collectionData = [];
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_Array$prototype$meth2 = Array.prototype[method]).call.apply(_Array$prototype$meth2, [this.collectionData].concat(args));
    }
  };
});

jsmvc.collection = function () {
  var _obj;

  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!Array.isArray(arr)) {
    obj = arr;
    arr = [];
  }

  if (jsmvc.eventful) {
    obj = jsmvc.eventful(obj);
  }

  if (!obj.definedBy_collectionPropertyDescriptors) {
    Object.defineProperties(obj, jsmvc.collectionPropertyDescriptors);
  }

  (_obj = obj).push.apply(_obj, _toConsumableArray(arr));

  return obj;
};