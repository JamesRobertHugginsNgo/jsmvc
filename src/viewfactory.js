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

/* exported vf */
const vf = viewFactory;