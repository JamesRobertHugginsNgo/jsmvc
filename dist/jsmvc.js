"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* global eventfulPropertyDescriptors */

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
              set: function set(value) {
                var _this2 = this;

                if (this.__collectionData[key] !== value) {
                  var oldValue = this.__collectionData[key];
                  this.itemSetter.call(this, value, function () {
                    _this2.__collectionData[key] = value;

                    if (_this2.definedByEventfulPropertyDescriptors) {
                      _this2.trigger('change', key, value, oldValue);

                      _this2.trigger("change:".concat(key), value, oldValue);
                    }
                  });
                }
              },
              get: function get() {
                var _this3 = this;

                return this.itemGetter(function () {
                  return _this3.__collectionData[key];
                });
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
  itemSetter: {
    value: function value(_value, basicSetter) {
      basicSetter();
    }
  },
  itemGetter: {
    value: function value(basicGetter) {
      return basicGetter();
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
/* exported collectionFactory */

function collectionFactory() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByCollectionPropertyDescriptors) {
    Object.defineProperties(obj, collectionPropertyDescriptors);
  }

  obj.push.apply(obj, _toConsumableArray(arr));
  return obj;
}
/* exported eventfulPropertyDescriptors */


var eventfulPropertyDescriptors = {
  definedByEventfulPropertyDescriptors: {
    value: true
  },
  __handlerData: {
    writable: true
  },
  __handlerReferences: {
    writable: true
  },
  addHandler: {
    value: function value(name, handler) {
      var _this4 = this;

      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var owner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;
      var enabled = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      var handlerData = {
        handler: handler,
        once: once,
        owner: owner,
        enabled: enabled
      };

      if (this.addEventListener) {
        var eventListener = function eventListener() {
          if (handlerData.enabled) {
            handler.apply(void 0, arguments);

            if (handlerData.once) {
              _this4.removeHandlers(handlerData.name, handlerData.handler, handlerData.once, handlerData.owner, null, {
                calledFromEventListener: true
              });
            }
          }
        };

        this.addEventListener(name, eventListener, {
          once: once
        });
        handlerData.listener = eventListener;
      }

      if (!this.__handlerData) {
        this.__handlerData = {};
      }

      if (!this.__handlerData[name]) {
        this.__handlerData[name] = [];
      }

      this.__handlerData[name].push(handlerData);

      if (owner && owner !== this && owner.definedByEventfulPropertyDescriptors) {
        if (!owner.__handlerReferences) {
          owner.__handlerReferences = {};
        }

        if (!owner.__handlerReferences[name]) {
          owner.__handlerReferences[name] = [];
        }

        owner.__handlerReferences[name].push({
          emitter: this,
          handlerData: handlerData
        });
      }

      return this;
    }
  },
  removeHandlers: {
    value: function value(name, handler, once, owner, enabled) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

      if (!this.__handlerData) {
        return this;
      }

      for (var key in this.__handlerData) {
        if (name == null || name === key) {
          var index = 0;

          while (index < this.__handlerData[key].length) {
            var handlerData = this.__handlerData[key][index];

            if ((handler == null || handler === handlerData.handler) && (once == null || once === handlerData.once) && (owner == null || owner === handlerData.owner) && (enabled == null || enabled === handlerData.enabled)) {
              if (this.removeEventListener && !options.calledFromEventListener) {
                this.removeEventListener(key, handlerData.listener);
              }

              this.__handlerData[key].splice(index, 1);

              if (owner && owner !== this && owner.definedByEventfulPropertyDescriptors && owner.__handlerReferences && owner.__handlerReferences[key] && !options.calledFromCleanUpHandlers) {
                var index2 = 0;

                while (index2 > owner.__handlerReferences[key].length) {
                  var handlerReferences = owner.__handlerReferences[key][index2];

                  if (handlerReferences.emitter === this && handlerReferences.handlerData === handlerData) {
                    owner.__handlerReferences.splice(index2, 1);
                  } else {
                    index2++;
                  }
                }
              }
            } else {
              index++;
            }
          }

          if (name != null) {
            break;
          }
        }
      }

      return this;
    }
  },
  enableHandlers: {
    value: function value(name, handler, once, owner, enabled) {
      var _this5 = this;

      if (!this.__handlerData) {
        return this;
      }

      var _loop = function _loop(key) {
        if (name == null || name === key) {
          _this5.__handlerData[key].forEach(function (handlerData, index) {
            if ((handler == null || handler === handlerData.handler) && (once == null || once === handlerData.once) && (owner == null || owner === handlerData.owner) && (enabled == null || enabled === handlerData.enabled)) {
              _this5.__handlerData[key][index].enabled = true;
            }
          });
        }
      };

      for (var key in this.__handlerData) {
        _loop(key);
      }

      return this;
    }
  },
  disableHandlers: {
    value: function value(name, handler, once, owner, enabled) {
      var _this6 = this;

      if (!this.__handlerData) {
        return this;
      }

      var _loop2 = function _loop2(key) {
        if (name == null || name === key) {
          _this6.__handlerData[key].forEach(function (handlerData, index) {
            if ((handler == null || handler === handlerData.handler) && (once == null || once === handlerData.once) && (owner == null || owner === handlerData.owner) && (enabled == null || enabled === handlerData.enabled)) {
              _this6.__handlerData[key][index].enabled = false;
            }
          });
        }
      };

      for (var key in this.__handlerData) {
        _loop2(key);
      }

      return this;
    }
  },
  triggerHandlers: {
    value: function value(name) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      if (!this.__handlerData || !this.__handlerData[name]) {
        return this;
      }

      this.__handlerData[name].forEach(function (handlerData) {
        if (handlerData.handler.enabled) {
          var _handlerData$handler;

          (_handlerData$handler = handlerData.handler).call.apply(_handlerData$handler, [handlerData.context].concat(args));
        }
      });

      this.removeHandlers(name, null, true, null, true);
      return this;
    }
  },
  cleanUpHandlers: {
    value: function value() {
      var _this7 = this;

      this.removeHandlers();

      if (!this.__handlerReferences) {
        return this;
      }

      var _loop3 = function _loop3(key) {
        _this7.__handlerReferences[key].forEach(function (handlerReference) {
          var _handlerReference$eve = handlerReference.eventData,
              handler = _handlerReference$eve.handler,
              once = _handlerReference$eve.once;
          handlerReference.emitter.removeHandlers(key, handler, once, _this7, null, {
            calledFromCleanUpHandlers: true
          });
        });
      };

      for (var key in this.__handlerReferences) {
        _loop3(key);
      }

      return this;
    }
  }
};
/* global eventfulPropertyDescriptors */

/* exported modelPropertyDescriptors */

var modelPropertyDescriptors = {
  definedByModelPropertyDescriptors: {
    value: true
  },
  __propertyData: {
    writable: true
  },
  setProperty: {
    value: function value(name) {
      var _value2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[name];

      var setter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (value, basicSetter) {
        basicSetter();
      };
      var getter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (basicGetter) {
        return basicGetter();
      };

      if (!this.__propertyData) {
        this.__propertyData = {};
      }

      if (_value2 !== undefined) {
        this.__propertyData[name] = _value2;
      }

      delete this[name];
      Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        set: function set(value) {
          var _this8 = this;

          if (this.__propertyData[name] !== value) {
            var oldValue = this.__propertyData[name];
            setter.call(this, value, function () {
              if (_this8.definedByEventfulPropertyDescriptors && oldValue !== value) {
                _this8.__propertyData[name] = value;

                _this8.trigger('change', name, value, oldValue);

                _this8.trigger("change:".concat(name), value, oldValue);
              }
            });
          }
        },
        get: function get() {
          var _this9 = this;

          return getter.call(this, function () {
            return _this9.__propertyData[name];
          });
        }
      });
    }
  },
  unsetProperty: {
    value: function value(name) {
      var value = this.__propertyData[name];
      delete this.__propertyData[name];
      delete this[name];

      if (value !== undefined) {
        this[name] = value;
      }
    }
  },
  toJSON: {
    value: function value() {
      return Object.assign({}, this.__propertyData);
    }
  }
};
/* exported modelFactory */

function modelFactory() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!obj.definedByEventfulPropertyDescriptors) {
    Object.defineProperties(obj, eventfulPropertyDescriptors);
  }

  if (!obj.definedByModelPropertyDescriptors) {
    Object.defineProperties(obj, modelPropertyDescriptors);
  }

  for (var key in obj) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (!propertyDescriptor.get && !propertyDescriptor.set) {
      obj.property(key);
    }
  }

  return obj;
}
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
      var _this10 = this;

      var calledFromFactory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.hasAttributes()) {
        var attributeKeys = [];

        for (var index = 0, length = this.attributes.length; index < length; index++) {
          attributeKeys.push(this.attributes[index].name);
        }

        attributeKeys.forEach(function (key) {
          _this10.removeAttribute(key);
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

          for (var _key4 in value) {
            _promises.push(renderAttributes(value[_key4], _key4));
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
          _this10.setAttribute(key, value);
        }

        return value;
      };

      var renderChildElement = function renderChildElement(childElement, placeHolder) {
        placeHolder = placeHolder || _this10.appendChild(document.createElement('span'));

        if (Array.isArray(childElement)) {
          placeHolder.parentNode.removeChild(placeHolder);
          return renderChildElements(childElement);
        } else if (typeof childElement === 'function') {
          return renderChildElement(childElement(_this10), placeHolder);
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
          return renderChildElements(childElements(_this10));
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

        if (!calledFromFactory && _this10.__childElements && Array.isArray(_this10.__childElements)) {
          _this10.__childElements.forEach(function (childElement) {
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
            return callBack(_this10);
          }));
        }
      }).then(function () {
        return _this10;
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
    for (var _len4 = arguments.length, args = new Array(_len4), _key5 = 0; _key5 < _len4; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return viewFactory.apply(void 0, [element].concat(args));
  };
});