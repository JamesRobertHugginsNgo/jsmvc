/* global eventfulPropertyDescriptors */

/* exported collectionPropertyDescriptors */
const collectionPropertyDescriptors = {
  definedByCollectionPropertyDescriptors: {
    value: true
  },

  __collectionData: {
    writable: true
  },

  length: {
    get() {
      if (this.__collectionData) {
        return this.__collectionData.length;
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
              if (this.__collectionData[key] !== value) {
                const oldValue = this.__collectionData[key];
                this.itemSetter.call(this, value, () => {
                  this.__collectionData[key] = value;
                  if (this.definedByEventfulPropertyDescriptors) {
                    this.trigger('change', key, value, oldValue);
                    this.trigger(`change:${key}`, value, oldValue);
                  }
                });
              }
            },
            get() {
              return this.itemGetter(() => this.__collectionData[key]);
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
      const array = this.__collectionData.slice();
      array.forEach((value, index) => {
        if (value.definedByModelPropertyDescriptors) {
          array[index] = value.toJSON();
        }
        if (value.definedByCollectionPropertyDescriptors) {
          array[index] = value.toArray();
        }
      });
      return array;
    }
  }
};

['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift']
  .forEach((method) => {
    collectionPropertyDescriptors[method] = {
      value(...args) {
        if (!this.__collectionData) {
          this.__collectionData = [];
        }

        const startingLength = this.length;
        const returnValue = Array.prototype[method].call(this.__collectionData, ...args);
        this.finalizeData(startingLength);

        if (this.definedByEventfulPropertyDescriptors) {
          this.triggerHandlers('change');
        }

        return returnValue;
      }
    };
  });

['concat', 'includes', 'indexOf', 'join', 'lastIndexOf', 'slice', 'toSource', 'toString', 'toLocaleString', 'entries',
  'every', 'filter', 'find', 'findIndex', 'forEach', 'keys', 'map', 'reduce', 'reduceRight', 'some', 'values']
  .forEach((method) => {
    collectionPropertyDescriptors[method] = {
      value(...args) {
        if (!this.__collectionData) {
          this.__collectionData = [];
        }
        return Array.prototype[method].call(this.__collectionData, ...args);
      }
    };
  });

/* exported collectionFactory */
function collectionFactory(arr = [], obj = {}) {
  if (!Array.isArray(arr)) {
    obj = arr;
    arr = [];
  }

  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByCollectionPropertyDescriptors) {
    Object.defineProperties(obj, collectionPropertyDescriptors);
  }

  obj.push(...arr);

  return obj;
}