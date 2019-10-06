"use strict";

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
              get: function get() {
                return this.__collectionData[key];
              },
              set: function set(value) {
                if (this.__collectionData[key] !== value) {
                  var oldValue = this.__collectionData[key];
                  this.__collectionData[key] = value;

                  if (this.definedByEventfulPropertyDescriptors) {
                    this.trigger('change', key, value, oldValue);
                    this.trigger("change:".concat(key), value, oldValue);
                  }
                }
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