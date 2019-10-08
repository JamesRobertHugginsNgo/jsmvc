/* global eventfulPropertyDescriptors */

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

      const renderAttributes = (value, key) => {
        if (value == null || value === false) {
          return value;
        }

        if (value instanceof Promise) {
          return value
            .then((finalValue) => {
              return renderAttributes(finalValue, key);
            });
        }

        if (Array.isArray(value)) {
          const promises = [];
          value.forEach((item, index) => {
            value[index] = renderAttributes(item);
            if (value[index] instanceof Promise) {
              promises.push(
                value[index]
                  .then((finalItem) => {
                    value[index] = finalItem;
                  })
              );
            }
          });
          if (promises.length > 0) {
            return Promise.all(promises)
              .then(() => {
                return renderAttributes(value.join(' '), key);
              });
          }
          return renderAttributes(value.join(' '), key);
        }

        if (typeof value === 'object') {
          const promises = [];
          for (const key in value) {
            promises.push(renderAttributes(value[key], key));
          }
          return Promise.all(promises);
        }

        if (typeof value === 'function') {
          return renderAttributes(value(), key);
        }

        if (typeof value === 'boolean') {
          renderAttributes('', key);
          return value;
        }

        if (key) {
          this.setAttribute(key, value);
        }
        return value;
      };

      const renderChildElement = (childElement, placeHolder) => {
        placeHolder = placeHolder || this.appendChild(document.createElement('span'));

        if (Array.isArray(childElement)) {
          placeHolder.parentNode.removeChild(placeHolder);
          return renderChildElements(childElement);
        } else if (typeof childElement === 'function') {
          return renderChildElement(childElement(this), placeHolder);
        } else if (childElement instanceof Promise) {
          return childElement
            .then((finalChildElement) => {
              return renderChildElement(finalChildElement, placeHolder);
            });
        }

        let returnValue;

        if (childElement instanceof HTMLElement || childElement instanceof Text) {
          placeHolder.parentNode.insertBefore(childElement, placeHolder);
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
          return childElements
            .then((finalChildElements) => {
              return renderChildElements(finalChildElements);
            });
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

/* exported viewFactory */
function viewFactory(element, attributes, childElements, callBacks) {
  if (typeof element === 'string') {
    element = document.createElement(element);
  }

  if (!element.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(element, eventfulPropertyDescriptors);
  }

  if (element.hasAttributes()) {
    for (let index = 0, length = element.attributes.length; index < length; index++) {
      const { name, value } = element.attributes[index];

      if (typeof attributes === 'object' && attributes !== null) {
        attributes = Object.assign({}, attributes);
      } else {
        if (attributes == null) {
          attributes = {};
        } else {
          attributes = {
            'original attributes': attributes
          };
        }
      }

      attributes[name] = value;
    }
  }

  if (element.firstChild) {
    const tempChildElements = [];
    for (let index = 0, length = element.childNodes.length; index < length; index++) {
      tempChildElements.push(element.childNodes[index]);
    }

    if (tempChildElements.length > 0) {
      if (Array.isArray(childElements)) {
        childElements = childElements.slice();
      } else {
        if (childElements == null) {
          childElements = [];
        } else {
          childElements = [childElements];
        }
      }

      childElements.unshift(...tempChildElements);
    }
  }

  if (!element.definedByViewPropertyDescriptors) {
    Object.defineProperties(element, viewPropertyDescriptors);
  }

  return element
    .setAttributes(attributes)
    .setChildElements(childElements)
    .render(callBacks, true);
}

['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi',
  'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
  'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
  'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head',
  'header', 'hr', 'viewFactoryl', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li',
  'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol',
  'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp',
  'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup',
  'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var',
  'video', 'wbr']
  .forEach((element) => {
    viewFactory[element] = (...args) => {
      return viewFactory(element, ...args);
    };
  });