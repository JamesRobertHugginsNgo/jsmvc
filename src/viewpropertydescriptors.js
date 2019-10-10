/* global eventfulPropertyDescriptors */

/* exported viewPropertyDescriptors */
const viewPropertyDescriptors = {
	definedByViewPropertyDescriptors: {
		value: true
	},

	__attributes: {
		writable: true
	},

	defineAttributes: {
		value(attributes) {
			this.__attributes = attributes;
			return this;
		}
	},

	renderAttributesPromise: {
		writable: true
	},

	renderAttributes: {
		value(callbacks) {

			// Remove attributes from the view before inserting attributes back.
			if (this.hasAttributes()) {
				const attributeKeys = [];
				for (let index = 0, length = this.attributes.length; index < length; index++) {
					attributeKeys.push(this.attributes[index].name);
				}
				attributeKeys.forEach((key) => this.removeAttribute(key));
			}

			// Recursive function use to insert attributes to the view.
			// Recursion is used to handle values that is not a number type or a string type.
			// Returns either undefine or a promise.
			const doRenderAttributes = (value, key) => {
				if (typeof value === 'function') {
					return doRenderAttributes(value(), key);
				}

				if (typeof value === 'object') {
					if (value === null) {
						return;
					}

					if (value instanceof Promise) {
						return value.then((finalValue) => doRenderAttributes(finalValue, key));
					}

					if (Array.isArray(value)) {
						const promises = [];

						value.forEach((item) => {
							const result = doRenderAttributes(item, key);
							if (result instanceof Promise) {
								promises.push(result);
							}
						});

						if (promises.length !== 0) {
							return Promise.all(promises);
						} else {
							return;
						}
					}

					const promises = [];

					for (const newKey in value) {
						const result = doRenderAttributes(value[newKey], newKey);
						if (result instanceof Promise) {
							promises.push(result);
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
					this.setAttribute(key, String(value));
				}
			};

			// Insert attributes to the view.
			const result = doRenderAttributes(this.__attributes, null);

			// A common function to finalize and call the callbacks argument.
			// Returns either undefined or a promise.
			const doCallbacks = () => {
				if (!callbacks) {
					return;
				}

				if (!Array.isArray(callbacks)) {
					callbacks = [callbacks];
				}

				const promises = [];

				callbacks.forEach((callback) => {
					const result = callback(this);
					if (result instanceof Promise) {
						promises.push(result);
					}
				});

				if (promises.length !== 0) {
					return Promise.all(promises);
				}
			};

			// Call callbacks and set promise.
			// The following allows the callback to be called right away when result isnt a Promise.
			// With Promise.resolve().then(...), the callback would always have to wait.
			if (result instanceof Promise) {
				this.renderAttributesPromise = result.then(() => doCallbacks()).then(() => this);
			} else {
				const result2 = doCallbacks();
				if (result2 instanceof Promise) {
					this.renderAttributesPromise = result2.then(() => this);
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
		value(childElements) {
			this.__childElements = childElements;
			return this;
		}
	},

	renderChildElementsPromise: {
		writable: true
	},

	renderChildElements: {
		value(callbacks, reRenderChildElement = true) {
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}

			const docFragment = document.createDocumentFragment();

			const doRenderChildElements = (childElement, placeholder) => {
				// if (!placeholder) {
				//   placeholder = this.appendChild(document.createTextNode(' '));
				// }

				if (typeof childElement === 'function') {
					return doRenderChildElements(childElement(), placeholder);
				}

				if (typeof childElement === 'object' && !(childElement instanceof HTMLElement || childElement instanceof Text)) {
					if (childElement === null) {
						placeholder.parentNode.removeChild(placeholder);
						return;
					}

					if (childElement instanceof Promise) {
						return childElement.then((finalChildElements) => doRenderChildElements(finalChildElements, placeholder));
					}

					if (Array.isArray(childElement)) {
						const promises = [];

						childElement.forEach((item) => {
							const newPlaceholder = placeholder.parentNode.insertBefore(document.createTextNode(' '), placeholder);
							const result = doRenderChildElements(item, newPlaceholder);
							if (result instanceof Promise) {
								promises.push(result);
							}
						});

						placeholder.parentNode.removeChild(placeholder);

						if (promises.length !== 0) {
							return Promise.all(promises);
						} else {
							return;
						}
					}

					const promises = [];

					for (const key in childElement) {
						const newPlaceholder = placeholder.parentNode.insertBefore(document.createTextNode(' '), placeholder);
						const result = doRenderChildElements(childElement[key], newPlaceholder);
						if (result instanceof Promise) {
							promises.push(result);
						}
					}

					placeholder.parentNode.removeChild(placeholder);

					if (promises.length !== 0) {
						return Promise.all(promises);
					} else {
						return;
					}
				}

				if (typeof childElement === 'string') {
					const tempElement = document.createElement('div');
					tempElement.innerHTML = childElement;

					const newChildElements = [];
					for (let index = 0, length = tempElement.childNodes.length; index < length; index++) {
						newChildElements.push(tempElement.childNodes[index]);
					}

					return doRenderChildElements(newChildElements, placeholder);
				}

				if (childElement instanceof HTMLElement || childElement instanceof Text) {
					placeholder.parentNode.insertBefore(childElement, placeholder);
				}

				placeholder.parentNode.removeChild(placeholder);
			};

			// Insert child elements to the view.
			const result = doRenderChildElements(this.__childElements, docFragment.appendChild(document.createTextNode(' ')));

			this.appendChild(docFragment);

			const complete = () => {

				// A common function to finalize and call the callbacks argument.
				// Returns either undefined or a promise.
				const doCallbacks = () => {
					if (!callbacks) {
						return;
					}

					if (!Array.isArray(callbacks)) {
						callbacks = [callbacks];
					}

					const promises = [];

					callbacks.forEach((callback) => {
						const result = callback(this);
						if (result instanceof Promise) {
							promises.push(result);
						}
					});

					if (promises.length !== 0) {
						return Promise.all(promises);
					}
				};

				// Call callbacks and set promise.
				// The following allows the callback to be called right away when result isnt a Promise.
				// With Promise.resolve().then(...), the callback would always have to wait.
				if (result instanceof Promise) {
					return result.then(() => doCallbacks());
				} else {
					return doCallbacks();
				}
			};

			const promises = [];

			if (reRenderChildElement) {
				let childElements = this.__childElements;
				if (Array.isArray(childElements)) {
					childElements = childElements.slice();
				} else {
					childElements = [childElements];
				}

				childElements.forEach((childElement) => {
					if (childElement.definedByViewPropertyDescriptors) {
						promises.push(childElement.render().renderPromise);
					}
				});
			}

			if (promises.length !== 0) {
				this.renderChildElementsPromise = Promise.all(promises).then(() => complete()).then(() => this);
			} else {
				const result2 = complete();
				if (result2 instanceof Promise) {
					this.renderChildElementsPromise = result2.then(() => this);
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
		value(callbacks, reRenderChildElement = true) {

			// A common function to finalize and call the callbacks argument.
			// Returns either undefined or a promise.
			const doCallbacks = () => {
				if (!callbacks) {
					return;
				}

				if (!Array.isArray(callbacks)) {
					callbacks = [callbacks];
				}

				const promises = [];

				callbacks.forEach((callback) => {
					const result = callback(this);
					if (result instanceof Promise) {
						promises.push(result);
					}
				});

				if (promises.length !== 0) {
					return Promise.all(promises);
				}
			};

			const promises = [];

			if (this.__attributes) {
				promises.push(this.renderAttributes().renderAttributesPromise);
			}

			if (this.__childElements) {
				promises.push(this.renderChildElements(null, reRenderChildElement).renderChildElementsPromise);
			}

			if (promises.length !== 0) {
				this.renderPromise = Promise.all(promises).then(() => doCallbacks()).then(() => this);
			} else {
				const result2 = doCallbacks();
				if (result2 instanceof Promise) {
					this.renderPromise = result2.then(() => this);
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
		.defineAttributes(attributes)
		.defineChildElements(childElements)
		.render(callbacks, false);
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