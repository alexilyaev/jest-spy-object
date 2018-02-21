'use strict';

function isClass(obj) {
  if (!obj.constructor || obj.constructor !== Function || !obj.prototype) {
    return false;
  }

  return /^(class|function)/.test(obj.toString());
}

function isFunction(property) {
  return typeof property === 'function';
}

function spyObject(object) {
  const target = isClass(object) ? object.prototype : object;

  Object.getOwnPropertyNames(target).forEach(prop => {
    // Ignore non function properties and then `constructor` function
    if (!isFunction(target[prop]) || prop === 'constructor') {
      return;
    }

    jest.spyOn(target, prop);
  });
}

module.exports = spyObject;
