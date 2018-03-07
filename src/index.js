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

function _spyOnObjectMethods(target, props) {
  props.forEach(prop => {
    // Ignore non function properties and the `constructor` function
    if (!_isFunction(target[prop]) || prop === 'constructor') {
      return;
    }

    // If method already mocked, restore it
    if (jest.isMockFunction(target[prop])) {
      target[prop].mockRestore();

      // NOTE: Should have thrown here, but there's a bug when spying a Class that extends a Class,
      // After the first test, the methods of the super are defined on the prototype of the first
      // class. Thus when spying on the super, it's methods names are already mocked on the first.
      // throw new Error(
      //   `[spyObject]: Method ${prop} is already mocked, you should restore all mocks using:\n` +
      //     '`jest.restoreAllMocks()` in `beforeEach` or set the jest config `restoreMocks: true`.'
      // );
    }

    jest.spyOn(target, prop);
  });
}

function spyObject(object) {
  const target = _isClass(object) ? object.prototype : object;
  let targetExtends = target;

  // Using `getOwnPropertyNames` since class methods are not enumerable
  _spyOnObjectMethods(target, Object.getOwnPropertyNames(target));

  // Handle `class Dog extends Animal` (support continuous extends)
  while (_isExtends(targetExtends)) {
    targetExtends = Object.getPrototypeOf(targetExtends);

    _spyOnObjectMethods(target, Object.getOwnPropertyNames(targetExtends));
  }
}

module.exports = spyObject;
