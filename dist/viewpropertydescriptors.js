"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* exported viewPropertyDescriptors */
var viewPropertyDescriptors = {
  definedByViewPropertyDescriptors: {
    value: true
  },
  __attributes: {
    writable: true
  },
  setAttributes: {
    value: function value(attributes) {
      this.__attributes = attributes;
      return this;
    }
  },
  __childElements: {
    writable: true
  },
  setChildElements: {
    value: function value(childElements) {
      this.__childElements = childElements;
      return this;
    }
  },
  promise: {
    writable: true
  },
  render: {
    value: function value(callBacks) {
      var _this = this;

      var calledFromFactory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.hasAttributes()) {
        var attributeKeys = [];

        for (var index = 0, length = this.attributes.length; index < length; index++) {
          attributeKeys.push(this.attributes[index].name);
        }

        attributeKeys.forEach(function (key) {
          _this.removeAttribute(key);
        });
      }

      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }

      var renderAttributes = function renderAttributes(value, key) {
        if (value == null || value === false) {
          return value;
        }

        if (Array.isArray(value)) {
          var promises = [];
          value.forEach(function (item, index) {
            value[index] = renderAttributes(item);

            if (value[index] instanceof Promise) {
              promises.push(value[index].then(function (finalItem) {
                value[index] = finalItem;
              }));
            }
          });

          if (promises.length > 0) {
            return Promise.all(promises).then(function () {
              return renderAttributes(value.join(' '), key);
            });
          }

          return renderAttributes(value.join(' '), key);
        }

        if (value instanceof Promise) {
          return value.then(function (finalValue) {
            return renderAttributes(finalValue, key);
          });
        }

        if (_typeof(value) === 'object') {
          var _promises = [];

          for (var _key in value) {
            _promises.push(renderAttributes(value[_key], _key));
          }

          return Promise.all(_promises);
        }

        if (typeof value === 'function') {
          return renderAttributes(value(), key);
        }

        if (typeof value === 'boolean') {
          renderAttributes('', key);
          return value;
        }

        if (key) {
          _this.setAttribute(key, value);
        }

        return value;
      };

      var renderChildElement = function renderChildElement(childElement, placeHolder) {
        placeHolder = placeHolder || _this.appendChild(document.createElement('span'));

        if (Array.isArray(childElement)) {
          placeHolder.parentNode.removeChild(placeHolder);
          return renderChildElements(childElement);
        } else if (typeof childElement === 'function') {
          return renderChildElement(childElement(_this), placeHolder);
        } else if (childElement instanceof Promise) {
          return childElement.then(function (finalChildElement) {
            return renderChildElement(finalChildElement, placeHolder);
          });
        }

        var returnValue;

        if (childElement instanceof HTMLElement || childElement instanceof Text) {
          placeHolder.parentNode.insertBefore(childElement, placeHolder);

          if (childElement.definedByViewPropertyDescriptors) {
            returnValue = childElement.promise;
          }
        } else if (typeof childElement === 'string') {
          var tempElement = document.createElement('div');
          tempElement.innerHTML = childElement;

          while (tempElement.firstChild) {
            placeHolder.parentNode.insertBefore(tempElement.firstChild, placeHolder);
          }
        }

        placeHolder.parentNode.removeChild(placeHolder);
        return returnValue;
      };

      var renderChildElements = function renderChildElements(childElements) {
        if (typeof childElements === 'function') {
          return renderChildElements(childElements(_this));
        } else if (childElements instanceof Promise) {
          return childElements.then(function (finalChildElements) {
            return renderChildElements(finalChildElements);
          });
        } else if (childElements instanceof HTMLElement) {
          return renderChildElement(childElements);
        } else if (Array.isArray(childElements)) {
          return Promise.all(childElements.map(function (childElement) {
            return renderChildElement(childElement);
          }));
        } else if (childElements != null) {
          return renderChildElements([childElements]);
        }
      };

      this.promise = Promise.all([renderAttributes(this.__attributes), renderChildElements(this.__childElements)]).then(function () {
        var promises = [];

        if (!calledFromFactory && _this.__childElements && Array.isArray(_this.__childElements)) {
          _this.__childElements.forEach(function (childElement) {
            if (childElement.definedByViewPropertyDescriptors) {
              promises.push(childElement.render().promise);
            }
          });
        }

        return Promise.all(promises);
      }).then(function () {
        if (callBacks) {
          callBacks = Array.isArray(callBacks) ? callBacks : [callBacks];
          return Promise.all(callBacks.map(function (callBack) {
            return callBack(_this);
          }));
        }
      }).then(function () {
        return _this;
      });
      return this;
    }
  }
};