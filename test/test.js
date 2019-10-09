document.body.appendChild(document.createTextNode('BEFORE'));

const textElement = document.body.appendChild(document.createTextNode(' '));

document.body.appendChild(document.createTextNode('AFTER'));

const div1Element = document.createElement('div');
div1Element.textContent = 'DIV 1';

document.body.insertBefore(div1Element, textElement);

console.log(textElement);

