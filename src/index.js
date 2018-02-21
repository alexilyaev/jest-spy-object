'use strict';

function _isClass(obj) {
  if (!obj.prototype || !obj.constructor) {
    return false;
  }

  return /^(class|function)/.test(obj.toString());
}

function _isExtends(obj) {
  const prototypeProto = Object.getPrototypeOf(obj);

  return prototypeProto && prototypeProto.constructor.name !== 'Object';
}

function _isFunction(property) {
  return typeof property === 'function';
}

function _spyAllObjectMethods(target, props) {
  // Using `getOwnPropertyNames` since class methods are not enumerable
  props.forEach(prop => {
    // Ignore non function properties and then `constructor` function
    if (!_isFunction(target[prop]) || prop === 'constructor') {
      return;
    }

    // If method already mocked, restore it
    if (jest.isMockFunction(target[prop])) {
      throw new Error(
        `[spyObject]: Method ${prop} is already mocked, you should restore all mocks using: ` +
          '`jest.restoreAllMocks()` in `beforeEach` or set the jest config `restoreMocks: true`'
      );
    }

    jest.spyOn(target, prop);
  });
}

function spyObject(object) {
  const target = _isClass(object) ? object.prototype : object;
  let targetExtends = target;

  _spyAllObjectMethods(target, Object.getOwnPropertyNames(target));

  // Handle `class Dog extends Animal` (support continuous extends)
  while (_isExtends(targetExtends)) {
    targetExtends = Object.getPrototypeOf(targetExtends);

    _spyAllObjectMethods(target, Object.getOwnPropertyNames(targetExtends));
  }
}

module.exports = spyObject;
