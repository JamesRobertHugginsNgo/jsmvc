/* exported viewPropertyDescriptors */
const viewPropertyDescriptors = {
  definedByViewPropertyDescriptors: {
    value: true
  },

  __attributes: {
    writable: true
  },

  setAttributes: {
    value(attributes) {
      this.__attributes = attributes;
      return this;
    }
  },

  __childElements: {
    writable: true
  },

  setChildElements: {
    value(childElements) {
      this.__childElements = childElements;
      return this;
    }
  },

  promise: {
    writable: true
  },

  render: {
    value(callBacks, calledFromFactory = false) {
      if (this.hasAttributes()) {
        const attributeKeys = [];
        for (let index = 0, length = this.attributes.length; index < length; index++) {
          attributeKeys.push(this.attributes[index].name);
        }
        attributeKeys.forEach((key) => {
          this.removeAttribute(key);
        });
      }

      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }

      const renderAttribute = (key, value) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return renderAttributes(value);
        } else if (typeof value === 'function') {
          return renderAttribute(key, value(this));
        } else if (value instanceof Promise) {
          return value.then((finalAttribute) => { return renderAttribute(finalAttribute); });
        } else if (value != null) {
          this.setAttribute(key, value);
        }
      };

      const renderAttributes = (attributes) => {
        if (typeof attributes === 'function') {
          return renderAttributes(attributes(this));
        } else if (attributes instanceof Promise) {
          return attributes.then((finalAttributes) => { return renderAttributes(finalAttributes); });
        } else if (typeof attributes === 'object' && attributes != null) {
          return Promise.all(Object.keys(attributes).map((key) => renderAttribute(key, attributes[key])));
        }
      };

      const renderChildElement = (childElement, placeHolder) => {
        placeHolder = placeHolder || this.appendChild(document.createElement('span'));

        if (Array.isArray(childElement)) {
          placeHolder.parentNode.removeChild(placeHolder);
          return renderChildElements(childElement);
        } else if (typeof childElement === 'function') {
          return renderChildElement(childElement(this), placeHolder);
        } else if (childElement instanceof Promise) {
          return childElement.then((finalChildElement) => { return renderChildElement(finalChildElement, placeHolder); });
        }

        let returnValue;

        if (childElement instanceof HTMLElement || childElement instanceof Text) {
          placeHolder.parentNode.insertBefore(childElement, placeHolder)
          if (childElement.definedByViewPropertyDescriptors) {
            returnValue = childElement.promise;
          }
        } else if (typeof childElement === 'string') {
          const tempElement = document.createElement('div');
          tempElement.innerHTML = childElement;
          while (tempElement.firstChild) {
            placeHolder.parentNode.insertBefore(tempElement.firstChild, placeHolder);
          }
        }

        placeHolder.parentNode.removeChild(placeHolder);
        return returnValue;
      };

      const renderChildElements = (childElements) => {
        if (typeof childElements === 'function') {
          return renderChildElements(childElements(this));
        } else if (childElements instanceof Promise) {
          return childElements.then((finalChildElements) => { return renderChildElements(finalChildElements); });
        } else if (childElements instanceof HTMLElement) {
          return renderChildElement(childElements);
        } else if (Array.isArray(childElements)) {
          return Promise.all(childElements.map((childElement) => { return renderChildElement(childElement); }));
        } else if (childElements != null) {
          return renderChildElements([childElements]);
        }
      };

      this.promise = Promise.all([renderAttributes(this.__attributes), renderChildElements(this.__childElements)])
        .then(() => {
          const promises = [];
          if (!calledFromFactory && this.__childElements && Array.isArray(this.__childElements)) {
            this.__childElements.forEach((childElement) => {
              if (childElement.definedByViewPropertyDescriptors) {
                promises.push(childElement.render().promise);
              }
            });
          }
          return Promise.all(promises);
        })
        .then(() => {
          if (callBacks) {
            callBacks = Array.isArray(callBacks) ? callBacks : [callBacks];
            return Promise.all(callBacks.map((callBack) => { return callBack(this); }));
          }
        })
        .then(() => {
          return this;
        });

      return this;
    }
  }
};