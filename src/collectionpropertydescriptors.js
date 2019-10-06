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
      return this.__collectionData ? this.__collectionData.length : 0;
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
            get() {
              return this.__collectionData[key];
            },
            set(value) {
              if (this.__collectionData[key] !== value) {
                const oldValue = this.__collectionData[key];
                this.__collectionData[key] = value;

                if (this.definedByEventfulPropertyDescriptors) {
                  this.trigger('change', key, value, oldValue);
                  this.trigger(`change:${key}`, value, oldValue);
                }
              }
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

  toArray: {
    value() {
      return this.__collectionData.slice();
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

        this.trigger('change');

        return returnValue;
      }
    }
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
    }
  });