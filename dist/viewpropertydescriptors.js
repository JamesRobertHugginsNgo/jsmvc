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

        if (value instanceof Promise) {
          return value.then(function (finalValue) {
            return renderAttributes(finalValue, key);
          });
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
/* exported viewFactory */

function viewFactory(element, attributes, childElements, callBacks) {
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

  return element.setAttributes(attributes).setChildElements(childElements).render(callBacks, true);
}

['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'viewFactoryl', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (element) {
  viewFactory[element] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return viewFactory.apply(void 0, [element].concat(args));
  };
});