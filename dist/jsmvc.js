"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* global jsmvc */
if (!window.jsmvc) {
  window.jsmvc = {};
}

jsmvc.collectionPropertyDescriptors = {
  definedBy_collectionPropertyDescriptors: {
    value: true
  },
  collectionData: {
    writable: true
  },
  length: {
    get: function get() {
      if (this.collectionData) {
        return this.collectionData.length;
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

                if (this.collectionData[key] !== value) {
                  var oldValue = this.collectionData[key];
                  this.itemSetter.call(this, value, function () {
                    _this2.collectionData[key] = value;

                    if (_this2.definedBy_eventfulPropertyDescriptors) {
                      _this2.trigger('change', key, value, oldValue);

                      _this2.trigger("change:".concat(key), value, oldValue);
                    }
                  });
                }
              },
              get: function get() {
                var _this3 = this;

                return this.itemGetter(function () {
                  return _this3.collectionData[key];
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
      var array = this.collectionData.slice();
      array.forEach(function (value, index) {
        if (value.definedBy_modelPropertyDescriptors) {
          array[index] = value.toJSON();
        }

        if (value.definedBy_collectionPropertyDescriptors) {
          array[index] = value.toArray();
        }
      });
      return array;
    }
  }
};
['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function (method) {
  jsmvc.collectionPropertyDescriptors[method] = {
    value: function value() {
      var _Array$prototype$meth;

      if (!this.collectionData) {
        this.collectionData = [];
      }

      var startingLength = this.length;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var returnValue = (_Array$prototype$meth = Array.prototype[method]).call.apply(_Array$prototype$meth, [this.collectionData].concat(args));

      this.finalizeData(startingLength);

      if (this.definedBy_eventfulPropertyDescriptors) {
        this.triggerEvents('change');
      }

      return returnValue;
    }
  };
});
['concat', 'includes', 'indexOf', 'join', 'lastIndexOf', 'slice', 'toSource', 'toString', 'toLocaleString', 'entries', 'every', 'filter', 'find', 'findIndex', 'forEach', 'keys', 'map', 'reduce', 'reduceRight', 'some', 'values'].forEach(function (method) {
  jsmvc.collectionPropertyDescriptors[method] = {
    value: function value() {
      var _Array$prototype$meth2;

      if (!this.collectionData) {
        this.collectionData = [];
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_Array$prototype$meth2 = Array.prototype[method]).call.apply(_Array$prototype$meth2, [this.collectionData].concat(args));
    }
  };
});

jsmvc.collection = function () {
  var _obj;

  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!Array.isArray(arr)) {
    obj = arr;
    arr = [];
  }

  if (jsmvc.eventful) {
    obj = jsmvc.eventful(obj);
  }

  if (!obj.definedBy_collectionPropertyDescriptors) {
    Object.defineProperties(obj, jsmvc.collectionPropertyDescriptors);
  }

  (_obj = obj).push.apply(_obj, _toConsumableArray(arr));

  return obj;
};
/* global jsmvc */


if (!window.jsmvc) {
  window.jsmvc = {};
}

jsmvc.eventfulPropertyDescriptors = {
  definedBy_eventfulPropertyDescriptors: {
    value: true
  },
  eventfulEnabled: {
    writable: true
  },
  enableEventful: {
    value: function value() {
      this.eventfulEnabled = true;
    }
  },
  disableEventful: {
    value: function value() {
      this.eventfulEnabled = false;
    }
  },
  eventfulData: {
    writable: true
  },
  eventfulReferences: {
    writable: true
  },
  addEvent: {
    value: function value(name, handler) {
      var _this4 = this;

      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var owner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;
      var eventfulData = {
        handler: handler,
        once: once,
        owner: owner
      };

      if (this instanceof EventTarget) {
        var listener = function listener() {
          var handler = eventfulData.handler,
              once = eventfulData.once,
              owner = eventfulData.owner;
          handler.apply(void 0, arguments);

          if (once) {
            _this4.removeEvents(name, handler, once, owner);
          }
        };

        this.addEventListener(name, listener, {
          once: once
        });
        eventfulData.listener = listener;
      }

      if (!this.eventfulData) {
        this.eventfulData = {};
      }

      if (!this.eventfulData[name]) {
        this.eventfulData[name] = [];
      }

      this.eventfulData[name].push(eventfulData);

      if (owner && owner !== this && owner.definedBy_eventfulPropertyDescriptors) {
        if (!owner.eventfulReferences) {
          owner.eventfulReferences = {};
        }

        if (!owner.eventfulReferences[name]) {
          owner.eventfulReferences[name] = [];
        }

        owner.eventfulReferences[name].push({
          emitter: this,
          eventfulData: eventfulData
        });
      }

      return this;
    }
  },
  removeEvents: {
    value: function value(name, handler, once, owner) {
      if (this.eventfulData) {
        for (var key in this.eventfulData) {
          if (name == null || key === name) {
            var index1 = 0;

            while (index1 < this.eventfulData[key].length) {
              var eventfulData = this.eventfulData[key][index1];

              if ((handler == null || eventfulData.handler === handler) && (once == null || eventfulData.once === once) && (owner == null || eventfulData.owner === owner)) {
                if (this instanceof EventTarget) {
                  this.removeEventListener(key, eventfulData.listener);
                }

                this.eventfulData[key].splice(index1, 1);

                if (owner && owner !== this && owner.definedBy_eventfulPropertyDescriptors) {
                  if (owner.eventfulReferences[key]) {
                    var index2 = 0;

                    while (index2 > owner.eventfulReferences[key].length) {
                      var eventfulReference = owner.eventfulReferences[key][index2];

                      if (eventfulReference.emitter === this && eventfulReference.eventfulData === eventfulData) {
                        owner.eventfulReferences.splice(index2, 1);
                      } else {
                        index2++;
                      }
                    }
                  }
                }
              } else {
                index1++;
              }
            }

            if (name != null) {
              break;
            }
          }
        }
      }

      return this;
    }
  },
  triggerEvents: {
    value: function value(name) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      if (this.eventfulEnabled !== false && this.eventfulData && this.eventfulData[name]) {
        this.eventfulData[name].forEach(function (_ref) {
          var handler = _ref.handler,
              owner = _ref.owner;
          handler.call.apply(handler, [owner].concat(args));
        });
        this.removeEvents(name, null, true, null);
      }

      return this;
    }
  },
  addEmitterEvent: {
    value: function value(emitter, name, handler, once) {
      if (emitter.definedBy_eventfulPropertyDescriptors) {
        emitter.addEvent(name, handler, once, this);
      }

      return this;
    }
  },
  removeEmitterEvents: {
    value: function value(emitter, name, handler, once) {
      var _this5 = this;

      if (this.eventfulReferences) {
        var _loop = function _loop(key) {
          if (name == null || key === name) {
            var emitters = [];

            for (var index = 0, length = _this5.eventfulReferences[key].length; index < length; index++) {
              var eventfulReference = _this5.eventfulReferences[key][index];

              if (emitter == null || eventfulReference.emitter === emitter) {
                if (emitters.indexOf(eventfulReference.emitter) === -1) {
                  emitters.push(eventfulReference.emitter);
                }
              }

              if (emitter != null) {
                break;
              }
            }

            emitters.forEach(function (emitter) {
              if (emitter.definedBy_eventfulPropertyDescriptors) {
                emitter.removeEvents(key, handler, once, _this5);
              }
            });

            if (name != null) {
              return "break";
            }
          }
        };

        for (var key in this.eventfulReferences) {
          var _ret = _loop(key);

          if (_ret === "break") break;
        }
      }

      return this;
    }
  }
};
jsmvc.eventfulPropertyDescriptors.on = jsmvc.eventfulPropertyDescriptors.addEvent;
jsmvc.eventfulPropertyDescriptors.off = jsmvc.eventfulPropertyDescriptors.removeEvents;
jsmvc.eventfulPropertyDescriptors.trigger = jsmvc.eventfulPropertyDescriptors.triggerEvents;
jsmvc.eventfulPropertyDescriptors.listenTo = jsmvc.eventfulPropertyDescriptors.addEmitterEvent;
jsmvc.eventfulPropertyDescriptors.stopListening = jsmvc.eventfulPropertyDescriptors.removeEmitterEvents;

jsmvc.eventful = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!obj.definedBy_eventfulPropertyDescriptors) {
    Object.defineProperties(obj, jsmvc.eventfulPropertyDescriptors);
  }

  return obj;
};
/* global jsmvc */


if (!window.jsmvc) {
  window.jsmvc = {};
}

jsmvc.modelPropertyDescriptors = {
  definedBy_modelPropertyDescriptors: {
    value: true
  },
  propertyData: {
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

      if (!propertyDescriptor || !propertyDescriptor.get && !propertyDescriptor.set) {
        if (_value2 !== undefined) {
          if (!this.propertyData) {
            this.propertyData = {};
          }

          this.propertyData[name] = _value2;
        }

        delete this[name];
        Object.defineProperty(this, name, {
          configurable: true,
          enumerable: true,
          set: function set(value) {
            var _this6 = this;

            if (!this.propertyData || this.propertyData[name] !== value) {
              var oldValue;

              if (this.propertyData && this.propertyData[name] !== undefined) {
                oldValue = this.propertyData[name];
              }

              setter.call(this, value, function () {
                if (!_this6.propertyData) {
                  _this6.propertyData = {};
                }

                _this6.propertyData[name] = value;

                if (_this6.definedBy_eventfulPropertyDescriptors) {
                  _this6.triggerEvents('change', name, value, oldValue);

                  _this6.triggerEvents("change:".concat(name), value, oldValue);
                }
              });
            }
          },
          get: function get() {
            var _this7 = this;

            return getter.call(this, function () {
              if (_this7.propertyData) {
                return _this7.propertyData[name];
              }

              return;
            });
          }
        });
      }

      return this;
    }
  },
  unsetProperty: {
    value: function value(name) {
      var propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);

      if (propertyDescriptor && (propertyDescriptor.get || propertyDescriptor.set)) {
        var value;

        if (this.propertyData) {
          value = this.propertyData[name];
        }

        delete this.propertyData[name];
        delete this[name];

        if (value !== undefined) {
          this[name] = value;
        }
      }

      return this;
    }
  },
  toJSON: {
    value: function value() {
      var json = Object.assign({}, this.propertyData);

      for (var key in json) {
        if (json[key].definedBy_modelPropertyDescriptors) {
          json[key] = json[key].toJSON();
        }

        if (json[key].definedBy_collectionPropertyDescriptors) {
          json[key] = json[key].toArray();
        }
      }

      return json;
    }
  }
};

jsmvc.model = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (jsmvc.eventful) {
    obj = jsmvc.eventful(obj);
  }

  if (!obj.definedBy_modelPropertyDescriptors) {
    Object.defineProperties(obj, jsmvc.modelPropertyDescriptors);
  }

  for (var key in obj) {
    obj.setProperty(key);
  }

  return obj;
};
/* global jsmvc */


if (!window.jsmvc) {
  window.jsmvc = {};
}

jsmvc.viewPropertyDescriptors = {
  definedBy_viewPropertyDescriptors: {
    value: true
  },
  attributeData: {
    writable: true
  },
  defineAttributes: {
    value: function value(attributes) {
      this.attributeData = attributes;
      return this;
    }
  },
  renderAttributesPromise: {
    writable: true
  },
  renderAttributes: {
    value: function value(callbacks) {
      var _this8 = this;

      // Recursive function use to insert attributes to the view.
      // Recursion is used to handle values that is not a number type or a string type.
      // Returns either undefine or a promise.
      var doRenderAttributes = function doRenderAttributes(value, key) {
        if (typeof value === 'function') {
          return doRenderAttributes(value(), key);
        }

        if (_typeof(value) === 'object' && value !== null) {
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

        if (typeof value === 'boolean' && value) {
          return doRenderAttributes('', key);
        }

        if (key) {
          if (value != null && value !== false) {
            var finalValue = String(value);

            if (!_this8.hasAttribute(key) || _this8.getAttribute(key) !== finalValue) {
              _this8.setAttribute(key, finalValue);
            }
          } else {
            if (_this8.hasAttribute(key)) {
              _this8.removeAttribute(key);
            }
          }
        }
      }; // Insert attributes to the view.


      var result = doRenderAttributes(this.attributeData, null); // A common function to finalize and call the callbacks argument.
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
          var result = callback(_this8);

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
          return _this8;
        });
      } else {
        var result2 = doCallbacks();

        if (result2 instanceof Promise) {
          this.renderAttributesPromise = result2.then(function () {
            return _this8;
          });
        } else {
          this.renderAttributesPromise = Promise.resolve(this);
        }
      }

      return this;
    }
  },
  childElementData: {
    writable: true
  },
  defineChildElements: {
    value: function value(childElements) {
      this.childElementData = childElements;
      return this;
    }
  },
  renderChildElementsPromise: {
    writable: true
  },
  renderChildElements: {
    value: function value(callbacks) {
      var _this9 = this;

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


      var result = doRenderChildElements(this.childElementData, docFragment.appendChild(document.createTextNode(' ')));
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
            var result = callback(_this9);

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
        var childElements = this.childElementData;

        if (Array.isArray(childElements)) {
          childElements = childElements.slice();
        } else {
          childElements = [childElements];
        }

        childElements.forEach(function (childElement) {
          if (childElement.definedBy_viewPropertyDescriptors) {
            promises.push(childElement.render().renderPromise);
          }
        });
      }

      if (promises.length !== 0) {
        this.renderChildElementsPromise = Promise.all(promises).then(function () {
          return complete();
        }).then(function () {
          return _this9;
        });
      } else {
        var result2 = complete();

        if (result2 instanceof Promise) {
          this.renderChildElementsPromise = result2.then(function () {
            return _this9;
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
      var _this10 = this;

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
          var result = callback(_this10);

          if (result instanceof Promise) {
            promises.push(result);
          }
        });

        if (promises.length !== 0) {
          return Promise.all(promises);
        }
      };

      var promises = [];

      if (this.attributeData) {
        promises.push(this.renderAttributes().renderAttributesPromise);
      }

      if (this.childElementData) {
        promises.push(this.renderChildElements(null, reRenderChildElement).renderChildElementsPromise);
      }

      if (promises.length !== 0) {
        this.renderPromise = Promise.all(promises).then(function () {
          return doCallbacks();
        }).then(function () {
          return _this10;
        });
      } else {
        var result2 = doCallbacks();

        if (result2 instanceof Promise) {
          this.renderPromise = result2.then(function () {
            return _this10;
          });
        } else {
          this.renderPromise = Promise.resolve(this);
        }
      }

      return this;
    }
  }
};
/* exported view */

jsmvc.view = function (element, attributes, childElements, callbacks) {
  if (typeof element === 'string') {
    element = document.createElement(element);
  }

  if (jsmvc.eventful) {
    element = jsmvc.eventful(element);
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

  if (!element.definedBy_viewPropertyDescriptors) {
    Object.defineProperties(element, jsmvc.viewPropertyDescriptors);
  }

  return element.defineAttributes(attributes).defineChildElements(childElements).render(callbacks, false);
};

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (element) {
  jsmvc.view[element] = function () {
    var _jsmvc;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return (_jsmvc = jsmvc).view.apply(_jsmvc, [element].concat(args));
  };
});