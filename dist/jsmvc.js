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
      if (this.__collectionData) {
        return this.__collectionData.length;
      }

      return 0;
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

      if (this.definedByEventfulPropertyDescriptors) {
        this.triggerHandlers('change');
      }

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
  var _obj;

  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

  (_obj = obj).push.apply(_obj, _toConsumableArray(arr));

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
  on: {
    value: function value() {
      return this.addHandler.apply(this, arguments);
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
  off: {
    value: function value() {
      return this.removeHandlers.apply(this, arguments);
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
        if (handlerData.enabled) {
          var _handlerData$handler;

          (_handlerData$handler = handlerData.handler).call.apply(_handlerData$handler, [handlerData.context].concat(args));
        }
      });

      this.removeHandlers(name, null, true, null, true);
      return this;
    }
  },
  trigger: {
    value: function value() {
      return this.triggerHandlers.apply(this, arguments);
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
        return basicSetter();
      };
      var getter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (basicGetter) {
        return basicGetter();
      };
      var propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);

      if (!propertyDescriptor.get && !propertyDescriptor.set) {
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
                if (_this8.definedByEventfulPropertyDescriptors) {
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

      return this;
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

      return this;
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
    // const propertyDescriptor = Object.getOwnPropertyDescriptor(obj, key);
    // if (!propertyDescriptor.get && !propertyDescriptor.set) {
    obj.setProperty(key); // }
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
  defineAttributes: {
    value: function value(attributes) {
      this.__attributes = attributes;
      return this;
    }
  },
  attrs: {
    value: function value() {
      return this.defineAttributes.apply(this, arguments);
    }
  },
  renderAttributesPromise: {
    writable: true
  },
  renderAttributes: {
    value: function value(callbacks) {
      var _this10 = this;

      // Remove attributes from the view before inserting attributes back.
      if (this.hasAttributes()) {
        var attributeKeys = [];

        for (var index = 0, length = this.attributes.length; index < length; index++) {
          attributeKeys.push(this.attributes[index].name);
        }

        attributeKeys.forEach(function (key) {
          return _this10.removeAttribute(key);
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
          _this10.setAttribute(key, String(value));
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
          var result = callback(_this10);

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
          return _this10;
        });
      } else {
        var result2 = doCallbacks();

        if (result2 instanceof Promise) {
          this.renderAttributesPromise = result2.then(function () {
            return _this10;
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
  els: {
    value: function value() {
      return this.defineChildElements.apply(this, arguments);
    }
  },
  renderChildElementsPromise: {
    writable: true
  },
  renderChildElements: {
    value: function value(callbacks) {
      var _this11 = this;

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

        if (typeof childElement === 'boolean' || typeof childElement === 'number' || typeof childElement === 'string') {
          var tempElement = document.createElement('div');
          tempElement.innerHTML = String(childElement);
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
            var result = callback(_this11);

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
        var childElements = this.__childElements;

        if (Array.isArray(childElements)) {
          childElements = childElements.slice();
        } else {
          childElements = [childElements];
        }

        childElements.forEach(function (childElement) {
          if (childElement.definedByViewPropertyDescriptors) {
            promises.push(childElement.render().renderPromise);
          }
        });
      }

      if (promises.length !== 0) {
        this.renderChildElementsPromise = Promise.all(promises).then(function () {
          return complete();
        }).then(function () {
          return _this11;
        });
      } else {
        var result2 = complete();

        if (result2 instanceof Promise) {
          this.renderChildElementsPromise = result2.then(function () {
            return _this11;
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
      var _this12 = this;

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
          var result = callback(_this12);

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
          return _this12;
        });
      } else {
        var result2 = doCallbacks();

        if (result2 instanceof Promise) {
          this.renderPromise = result2.then(function () {
            return _this12;
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
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return viewFactory.apply(void 0, [element].concat(args));
  };
});