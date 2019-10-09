"use strict";

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
      var _this = this;

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
              _this.removeHandlers(handlerData.name, handlerData.handler, handlerData.once, handlerData.owner, null, {
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
      var _this2 = this;

      if (!this.__handlerData) {
        return this;
      }

      var _loop = function _loop(key) {
        if (name == null || name === key) {
          _this2.__handlerData[key].forEach(function (handlerData, index) {
            if ((handler == null || handler === handlerData.handler) && (once == null || once === handlerData.once) && (owner == null || owner === handlerData.owner) && (enabled == null || enabled === handlerData.enabled)) {
              _this2.__handlerData[key][index].enabled = true;
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
      var _this3 = this;

      if (!this.__handlerData) {
        return this;
      }

      var _loop2 = function _loop2(key) {
        if (name == null || name === key) {
          _this3.__handlerData[key].forEach(function (handlerData, index) {
            if ((handler == null || handler === handlerData.handler) && (once == null || once === handlerData.once) && (owner == null || owner === handlerData.owner) && (enabled == null || enabled === handlerData.enabled)) {
              _this3.__handlerData[key][index].enabled = false;
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
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
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
      var _this4 = this;

      this.removeHandlers();

      if (!this.__handlerReferences) {
        return this;
      }

      var _loop3 = function _loop3(key) {
        _this4.__handlerReferences[key].forEach(function (handlerReference) {
          var _handlerReference$eve = handlerReference.eventData,
              handler = _handlerReference$eve.handler,
              once = _handlerReference$eve.once;
          handlerReference.emitter.removeHandlers(key, handler, once, _this4, null, {
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