# jest-spy-object

[![Build Status](https://circleci.com/gh/alexilyaev/jest-spy-object.svg?style=shield&circle-token=4a6fdf703165cc00738798503a94babdb60b786a)](https://circleci.com/gh/alexilyaev/jest-spy-object)
[![version](https://img.shields.io/npm/v/jest-spy-object.svg?style=flat-square)](http://npm.im/jest-spy-object)
[![MIT License](https://img.shields.io/npm/l/jest-spy-object.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Spies on all Object or Class methods using `jest.spyOn`.

## Why?

If you're sick of writing `jest.spyOn(Object, 'method')` all the time.  
And you want the following:

* You need to spy on some or all methods of an Object or Class
* You need to define mocks for some methods inside tests (`mockImplementation` or `mockReturnValue`)
* You need each test to have fresh spies without calling `mockRretore` or `mockReset` on each spy
* You don't want to manually add a spy for newly added methods

## Installation

Install as a dev dependency of your project:

```
yarn add -D jest-spy-object
```

Or with `npm`

```
npm i -D jest-spy-object
```

## Require

```js
const spyObject = require('jest-spy-object');
```

## Usage

### Given a Class

```js
class Counter {
  constructor() {
    this.value = 0;
  }

  incrementBy(val) {
    this.value = this.value + val;
  }

  increment() {
    this.incrementBy(1);
  }
}
```

### Before

```js
beforeEach(() => {
  // Make sure each test starts fresh (can be set in jest.config.js with `restoreMocks: true`)
  jest.restoreAllMocks();

  // Setup fresh spies
  jest.spyOn(Counter.prototype, 'incrementBy');
  jest.spyOn(Counter.prototype, 'increment');
});
```

### After

```js
const spyObject = require('jest-spy-object');

beforeEach(() => {
  // Make sure each test starts fresh (can be set in jest.config.js with `restoreMocks: true`)
  jest.restoreAllMocks();

  // Setup fresh spies
  spyObject(Counter);
});
```

### Tests

```js
describe('Counter', () => {
  it('should be able to spy on class methods and mock any of them easily', () => {
    const counter = new Counter();

    counter.incrementBy.mockImplementation(function() {
      this.value = this.value + 10;
    });

    counter.increment();

    expect(counter.increment).toHaveBeenCalled();
    expect(counter.incrementBy).toHaveBeenCalledWith(1);
    expect(counter.value).toBe(10);
  });
});
```

## Other supported inputs

### Function constructor

```js
function Counter() {
  this.value = 0;
}

Counter.prototype.incrementBy = function incrementBy(val) {
  this.value = this.value + val;
};

Counter.prototype.increment = function increment() {
  this.incrementBy(1);
};

spyObject(Counter);
// or...
spyObject(Counter.prototype);
```

### Plain Object

```js
const counter = {
  value: 0,
  incrementBy(val) {
    this.value = this.value + val;
  },
  increment() {
    this.incrementBy(1);
  }
};

spyObject(counter);
```

## Contributing

See the [CONTRIBUTING](CONTRIBUTING.md) document.
