/* exported collectionPropertyDescriptors */
const collectionPropertyDescriptors = {
  hasCollectionPropertyDescriptors: {
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
      if (startingLength !== this.length) {
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

                  if (this.hasEventfulPropertyDescriptors) {
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

        if (this.hasEventfulPropertyDescriptors) {
          this.trigger('change');
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

Object.getOwnPropertyNames(Array.prototype).forEach((method) => {
  if (typeof Array.prototype[method] === 'function') {
    collectionPropertyDescriptors[method] = {
      value(...args) {
        if (!this.__collectionData) {
          this.__collectionData = [];
        }

        const startingLength = this.length;
        const returnValue = Array.prototype[method].call(this.__collectionData, ...args);
        this.finalizeData(startingLength);

        return returnValue;
      }
    }
  }
});