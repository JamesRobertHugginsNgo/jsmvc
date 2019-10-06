"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global eventfulPropertyDescriptors viewPropertyDescriptors */

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
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return viewFactory.apply(void 0, [element].concat(args));
  };
});
/* exported vf */

var vf = viewFactory;