"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* global eventfulPropertyDescriptors */

/* exported collectionPropertyDescriptors */
var collectionPropertyDescriptors = {
  definedByCollectionPropertyDescriptors: {
    value: true
  },
  __collectionData: {
    writable: true
  },
  length: {
    get: function get() {
      return this.__collectionData ? this.__collectionData.length : 0;
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

                if (this.__collectionData[key] !== value) {
                  var oldValue = this.__collectionData[key];
                  this.itemSetter.call(this, value, function () {
                    _this2.__collectionData[key] = value;

                    if (_this2.definedByEventfulPropertyDescriptors) {
                      _this2.trigger('change', key, value, oldValue);

                      _this2.trigger("change:".concat(key), value, oldValue);
                    }
                  });
                }
              },
              get: function get() {
                var _this3 = this;

                return this.itemGetter(function () {
                  return _this3.__collectionData[key];
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
      return this.__collectionData.slice();
    }
  }
};
['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function (method) {
  collectionPropertyDescriptors[method] = {
    value: function value() {
      var _Array$prototype$meth;

      if (!this.__collectionData) {
        this.__collectionData = [];
      }

      var startingLength = this.length;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var returnValue = (_Array$prototype$meth = Array.prototype[method]).call.apply(_Array$prototype$meth, [this.__collectionData].concat(args));

      this.finalizeData(startingLength);
      this.trigger('change');
      return returnValue;
    }
  };
});
['concat', 'includes', 'indexOf', 'join', 'lastIndexOf', 'slice', 'toSource', 'toString', 'toLocaleString', 'entries', 'every', 'filter', 'find', 'findIndex', 'forEach', 'keys', 'map', 'reduce', 'reduceRight', 'some', 'values'].forEach(function (method) {
  collectionPropertyDescriptors[method] = {
    value: function value() {
      var _Array$prototype$meth2;

      if (!this.__collectionData) {
        this.__collectionData = [];
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_Array$prototype$meth2 = Array.prototype[method]).call.apply(_Array$prototype$meth2, [this.__collectionData].concat(args));
    }
  };
});
/* exported collectionFactory */

function collectionFactory() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByCollectionPropertyDescriptors) {
    Object.defineProperties(obj, collectionPropertyDescriptors);
  }

  obj.push.apply(obj, _toConsumableArray(arr));
  return obj;
}