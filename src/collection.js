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
    get() {
      if (this.collectionData) {
        return this.collectionData.length;
      }
      return 0;
    }
  },

  finalizeData: {
    value(startingLength) {
      while (startingLength !== this.length) {
        if (startingLength < this.length) {
          const key = String(startingLength);

          Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            set(value) {
              if (this.collectionData[key] !== value) {
                const oldValue = this.collectionData[key];
                this.itemSetter.call(this, value, () => {
                  this.collectionData[key] = value;
                  if (this.definedBy_eventfulPropertyDescriptors) {
                    this.trigger('change', key, value, oldValue);
                    this.trigger(`change:${key}`, value, oldValue);
                  }
                });
              }
            },
            get() {
              return this.itemGetter(() => this.collectionData[key]);
            }
          });

          startingLength++;
        } else {
          delete this[String(startingLength - 1)];

          startingLength--;
        }
      }
    }
  },

  itemSetter: {
    value(value, basicSetter) {
      basicSetter();
    }
  },
  itemGetter: {
    value(basicGetter) {
      return basicGetter();
    }
  },

  toArray: {
    value() {
      const array = this.collectionData.slice();
      array.forEach((value, index) => {
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

['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift']
  .forEach((method) => {
    jsmvc.collectionPropertyDescriptors[method] = {
      value(...args) {
        if (!this.collectionData) {
          this.collectionData = [];
        }

        const startingLength = this.length;
        const returnValue = Array.prototype[method].call(this.collectionData, ...args);
        this.finalizeData(startingLength);

        if (this.definedBy_eventfulPropertyDescriptors) {
          this.triggerEvents('change');
        }

        return returnValue;
      }
    };
  });

['concat', 'includes', 'indexOf', 'join', 'lastIndexOf', 'slice', 'toSource', 'toString', 'toLocaleString', 'entries',
  'every', 'filter', 'find', 'findIndex', 'forEach', 'keys', 'map', 'reduce', 'reduceRight', 'some', 'values']
  .forEach((method) => {
    jsmvc.collectionPropertyDescriptors[method] = {
      value(...args) {
        if (!this.collectionData) {
          this.collectionData = [];
        }
        return Array.prototype[method].call(this.collectionData, ...args);
      }
    };
  });

jsmvc.collection = (arr = [], obj = {}) => {
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

  obj.push(...arr);

  return obj;
};