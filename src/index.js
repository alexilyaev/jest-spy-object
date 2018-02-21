'use strict';

function isClass(obj) {
  if (!obj.prototype || !obj.constructor) {
    return false;
  }

  return /^(class|function)/.test(obj.toString());
}

function isExtends(obj) {
  const prototypeProto = Object.getPrototypeOf(obj);

  return prototypeProto && prototypeProto.constructor.name !== 'Object';
}

function isFunction(property) {
  return typeof property === 'function';
}

function spyObject(object) {
  const target = isClass(object) ? object.prototype : object;
  const isExtending = isExtends(target);

  if (isExtending) {
    spyObject(Object.getPrototypeOf(target));
  }

  Object.getOwnPropertyNames(target).forEach(prop => {
    // Ignore non function properties and then `constructor` function
    if (!isFunction(target[prop]) || prop === 'constructor') {
      return;
    }

    jest.spyOn(target, prop);
  });
}

module.exports = spyObject;
