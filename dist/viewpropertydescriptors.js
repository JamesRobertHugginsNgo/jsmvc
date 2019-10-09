"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global eventfulPropertyDescriptors */

/* exported viewPropertyDescriptors */
var viewPropertyDescriptors = {
  definedByViewPropertyDescriptors: {
    value: true
  },
  __attributes: {
    writable: true
  },
  defineAttributes: {
    value: function value(attributes) {
      this.__attributes = attributes;
      return this;
    }
  },
  renderAttributesPromise: {
    writable: true
  },
  renderAttributes: {
    value: function value(callbacks) {
      var _this = this;

      // Remove attributes from the view before inserting attributes back.
      if (this.hasAttributes()) {
        var attributeKeys = [];

        for (var index = 0, length = this.attributes.length; index < length; index++) {
          attributeKeys.push(this.attributes[index].name);
        }

        attributeKeys.forEach(function (key) {
          return _this.removeAttribute(key);
        });
      } // Recursive function use to insert attributes to the view.
      // Recursion is used to handle values that is not a number type or a string type.
      // Returns either undefine or a promise.


      var doRenderAttributes = function doRenderAttributes(value, key) {
        if (typeof value === 'function') {
          return doRenderAttributes(value(), key);
        }

        if (_typeof(value) === 'object') {
          if (value === null) {
            return;
          }

          if (value instanceof Promise) {
            return value.then(function (finalValue) {
              return doRenderAttributes(finalValue, key);
            });
          }

          if (Array.isArray(value)) {
            var _promises = [];
            value.forEach(function (item) {
              var result = doRenderAttributes(item, key);

              if (result instanceof Promise) {
                _promises.push(result);
              }
            });

            if (_promises.length !== 0) {
              return Promise.all(_promises);
            } else {
              return;
            }
          }

          var promises = [];

          for (var newKey in value) {
            var _result = doRenderAttributes(value[newKey], newKey);

            if (_result instanceof Promise) {
              promises.push(_result);
            }
          }

          if (promises.length !== 0) {
            return Promise.all(promises);
          } else {
            return;
          }
        }

        if (typeof value === 'boolean') {
          if (value) {
            return doRenderAttributes('', key);
          }
        }

        if (value !== undefined && key) {
          _this.setAttribute(key, String(value));
        }
      }; // Insert attributes to the view.


      var result = doRenderAttributes(this.__attributes, null); // A common function to finalize and call the callbacks argument.
      // Returns either undefined or a promise.

      var doCallbacks = function doCallbacks() {
        if (!callbacks) {
          return;
        }

        if (!Array.isArray(callbacks)) {
          callbacks = [callbacks];
        }

        var promises = [];
        callbacks.forEach(function (callback) {
          var result = callback(_this);

          if (result instanceof Promise) {
            promises.push(result);
          }
        });

        if (promises.length !== 0) {
          return Promise.all(promises);
        }
      }; // Call callbacks and set promise.
      // The following allows the callback to be called right away when result isnt a Promise.
      // With Promise.resolve().then(...), the callback would always have to wait.


      if (result instanceof Promise) {
        this.renderAttributesPromise = result.then(function () {
          return doCallbacks();
        }).then(function () {
          return _this;
        });
      } else {
        var result2 = doCallbacks();

        if (result2 instanceof Promise) {
          this.renderAttributesPromise = result2.then(function () {
            return _this;
          });
        } else {
          this.renderAttributesPromise = Promise.resolve(this);
        }
      }

      return this;
    }
  },
  __childElements: {
    writable: true
  },
  defineChildElements: {
    value: function value(childElements) {
      this.__childElements = childElements;
      return this;
    }
  },
  renderChildElementsPromise: {
    writable: true
  },
  renderChildElements: {
    value: function value(callbacks) {
      var _this2 = this;

      var reRenderChildElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }

      var docFragment = document.createDocumentFragment();

      var doRenderChildElements = function doRenderChildElements(childElement, placeholder) {
        // if (!placeholder) {
        //   placeholder = this.appendChild(document.createTextNode(' '));
        // }
        if (typeof childElement === 'function') {
          return doRenderChildElements(childElement(), placeholder);
        }

        if (_typeof(childElement) === 'object' && !(childElement instanceof HTMLElement || childElement instanceof Text)) {
          if (childElement === null) {
            placeholder.parentNode.removeChild(placeholder);
            return;
          }

          if (childElement instanceof Promise) {
            return childElement.then(function (finalChildElements) {
              return doRenderChildElements(finalChildElements, placeholder);
            });
          }

          if (Array.isArray(childElement)) {
            var _promises3 = [];
            childElement.forEach(function (item) {
              var newPlaceholder = placeholder.parentNode.insertBefore(document.createTextNode(' '), placeholder);
              var result = doRenderChildElements(item, newPlaceholder);

              if (result instanceof Promise) {
                _promises3.push(result);
              }
            });
            placeholder.parentNode.removeChild(placeholder);

            if (_promises3.length !== 0) {
              return Promise.all(_promises3);
            } else {
              return;
            }
          }

          var _promises2 = [];

          for (var key in childElement) {
            var newPlaceholder = placeholder.parentNode.insertBefore(document.createTextNode(' '), placeholder);

            var _result2 = doRenderChildElements(childElement[key], newPlaceholder);

            if (_result2 instanceof Promise) {
              _promises2.push(_result2);
            }
          }

          placeholder.parentNode.removeChild(placeholder);

          if (_promises2.length !== 0) {
            return Promise.all(_promises2);
          } else {
            return;
          }
        }

        if (typeof childElement === 'string') {
          var tempElement = document.createElement('div');
          tempElement.innerHTML = childElement;
          var newChildElements = [];

          for (var index = 0, length = tempElement.childNodes.length; index < length; index++) {
            newChildElements.push(tempElement.childNodes[index]);
          }

          return doRenderChildElements(newChildElements, placeholder);
        }

        if (childElement instanceof HTMLElement || childElement instanceof Text) {
          placeholder.parentNode.insertBefore(childElement, placeholder);
        }

        placeholder.parentNode.removeChild(placeholder);
      }; // Insert child elements to the view.


      var result = doRenderChildElements(this.__childElements, docFragment.appendChild(document.createTextNode(' ')));
      this.appendChild(docFragment);

      var complete = function complete() {
        // A common function to finalize and call the callbacks argument.
        // Returns either undefined or a promise.
        var doCallbacks = function doCallbacks() {
          if (!callbacks) {
            return;
          }

          if (!Array.isArray(callbacks)) {
            callbacks = [callbacks];
          }

          var promises = [];
          callbacks.forEach(function (callback) {
            var result = callback(_this2);

            if (result instanceof Promise) {
              promises.push(result);
            }
          });

          if (promises.length !== 0) {
            return Promise.all(promises);
          }
        }; // Call callbacks and set promise.
        // The following allows the callback to be called right away when result isnt a Promise.
        // With Promise.resolve().then(...), the callback would always have to wait.


        if (result instanceof Promise) {
          return result.then(function () {
            return doCallbacks();
          });
        } else {
          return doCallbacks();
        }
      };

      var promises = [];

      if (reRenderChildElement) {
        this.__childElements.forEach(function (childElement) {
          if (childElement.definedByViewPropertyDescriptors) {
            promises.push(childElement.render().renderPromise);
          }
        });
      }

      if (promises.length !== 0) {
        this.renderChildElementsPromise = Promise.all(promises).then(function () {
          return complete();
        }).then(function () {
          return _this2;
        });
      } else {
        var result2 = complete();

        if (result2 instanceof Promise) {
          this.renderChildElementsPromise = result2.then(function () {
            return _this2;
          });
        } else {
          this.renderChildElementsPromise = Promise.resolve(this);
        }
      }

      return this;
    }
  },
  renderPromise: {
    writable: true
  },
  render: {
    value: function value(callbacks) {
      var _this3 = this;

      var reRenderChildElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // A common function to finalize and call the callbacks argument.
      // Returns either undefined or a promise.
      var doCallbacks = function doCallbacks() {
        if (!callbacks) {
          return;
        }

        if (!Array.isArray(callbacks)) {
          callbacks = [callbacks];
        }

        var promises = [];
        callbacks.forEach(function (callback) {
          var result = callback(_this3);

          if (result instanceof Promise) {
            promises.push(result);
          }
        });

        if (promises.length !== 0) {
          return Promise.all(promises);
        }
      };

      var promises = [];

      if (this.__attributes) {
        promises.push(this.renderAttributes().renderAttributesPromise);
      }

      if (this.__childElements) {
        promises.push(this.renderChildElements(null, reRenderChildElement).renderChildElementsPromise);
      }

      if (promises.length !== 0) {
        this.renderPromise = Promise.all(promises).then(function () {
          return doCallbacks();
        }).then(function () {
          return _this3;
        });
      } else {
        var result2 = doCallbacks();

        if (result2 instanceof Promise) {
          this.renderPromise = result2.then(function () {
            return _this3;
          });
        } else {
          this.renderPromise = Promise.resolve(this);
        }
      }

      return this;
    }
  }
};
/* exported viewFactory */

function viewFactory(element, attributes, childElements, callbacks) {
  if (typeof element === 'string') {
    element = document.createElement(element);
  }

  if (!element.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(element, eventfulPropertyDescriptors);
  }

  if (element.hasAttributes()) {
    for (var index = 0, length = element.attributes.length; index < length; index++) {
      var _element$attributes$i = element.attributes[index],
          name = _element$attributes$i.name,
          value = _element$attributes$i.value;

      if (_typeof(attributes) === 'object' && attributes !== null) {
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
    var tempChildElements = [];

    for (var _index = 0, _length = element.childNodes.length; _index < _length; _index++) {
      tempChildElements.push(element.childNodes[_index]);
    }

    if (tempChildElements.length > 0) {
      var _childElements;

      if (Array.isArray(childElements)) {
        childElements = childElements.slice();
      } else {
        if (childElements == null) {
          childElements = [];
        } else {
          childElements = [childElements];
        }
      }

      (_childElements = childElements).unshift.apply(_childElements, tempChildElements);
    }
  }

  if (!element.definedByViewPropertyDescriptors) {
    Object.defineProperties(element, viewPropertyDescriptors);
  }

  return element.defineAttributes(attributes).defineChildElements(childElements).render(callbacks, false);
}

['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'viewFactoryl', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (element) {
  viewFactory[element] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return viewFactory.apply(void 0, [element].concat(args));
  };
});