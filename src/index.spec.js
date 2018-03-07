'use strict';

const { EventEmitter } = require('events');

const spyObject = require('./index');

describe('Counter', () => {
  describe('Supported Inputs', () => {
    it('should accept an ES6 Class', () => {
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

      spyObject(Counter);

      const counter = new Counter();

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.value).toBe(1);
    });

    it('should accept an ES6 Class `prototype`', () => {
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

      spyObject(Counter.prototype);

      const counter = new Counter();

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.value).toBe(1);
    });

    it('should accept an ES6 Class with `extends` of another Class', () => {
      class Super {
        getValue() {
          return this.value;
        }
      }

      class Counter extends Super {
        constructor() {
          super();

          this.value = 0;
        }

        incrementBy(val) {
          this.value = this.getValue() + val;
        }

        increment() {
          this.incrementBy(1);
        }
      }

      spyObject(Counter);

      const counter = new Counter();

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.getValue).toHaveBeenCalled();
      expect(counter.getValue()).toBe(1);
      expect(counter.value).toBe(1);
    });

    it('should accept an ES6 Class with `extends` of a constructor with prototype', () => {
      function Super() {}

      Super.prototype.getValue = function getValue() {
        return this.value;
      };

      class Counter extends Super {
        constructor() {
          super();

          this.value = 0;
        }

        incrementBy(val) {
          this.value = this.getValue() + val;
        }

        increment() {
          this.incrementBy(1);
        }
      }

      spyObject(Counter);

      const counter = new Counter();

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.getValue).toHaveBeenCalled();
      expect(counter.getValue()).toBe(1);
      expect(counter.value).toBe(1);
    });

    it('should accept an ES6 Class with `extends` of a empty constructor', () => {
      function Super() {
        this.num = 10;
      }

      class Counter extends Super {
        constructor() {
          super();

          this.value = 0;
        }

        incrementBy(val) {
          this.value = this.num + val;
        }

        increment() {
          this.incrementBy(1);
        }
      }

      spyObject(Counter);

      const counter = new Counter();

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.value).toBe(11);
    });

    it('should accept an ES6 Class with `extends` of an external class/constructor', () => {
      class Counter extends EventEmitter {
        constructor() {
          super();

          this.value = 0;
        }

        incrementBy(val) {
          this.value = this.value + val;

          this.removeListener('foo', this.increment);
        }

        increment() {
          this.setMaxListeners(0);

          this.incrementBy(1);
        }
      }

      spyObject(Counter);

      const counter = new Counter();

      counter.setMaxListeners.mockImplementation(() => {});
      counter.removeListener.mockImplementation(() => {});

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.setMaxListeners).toHaveBeenCalledWith(0);
      expect(counter.removeListener).toHaveBeenCalledTimes(1);
      expect(counter.value).toBe(1);
    });

    it('should accept an ES5 constructor Function', () => {
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

      const counter = new Counter();

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.value).toBe(1);
    });

    it('should accept an ES5 constructor Function `prototype', () => {
      function Counter() {
        this.value = 0;
      }

      Counter.prototype.incrementBy = function incrementBy(val) {
        this.value = this.value + val;
      };

      Counter.prototype.increment = function increment() {
        this.incrementBy(1);
      };

      spyObject(Counter.prototype);

      const counter = new Counter();

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.value).toBe(1);
    });

    it('should accept a plain Object', () => {
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

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.value).toBe(1);
    });

    it('should accept an ES6 Map', () => {
      const testMap = new Map();

      spyObject(testMap);

      testMap.set('foo', 999);

      expect(testMap.set).toHaveBeenCalledWith('foo', 999);
    });

    it('should accept an ES6 Set', () => {
      const testMap = new Set();

      spyObject(testMap);

      testMap.add(999);

      expect(testMap.add).toHaveBeenCalledWith(999);
    });

    it('should accept an ES6 Class with `extends` of an ES6 Map', () => {
      class Counter extends Map {
        constructor() {
          super();

          this.set('value', 0);
        }

        incrementBy(val) {
          this.set('value', this.get('value') + val);
        }

        increment() {
          this.incrementBy(1);
        }
      }

      spyObject(Counter);

      const counter = new Counter();

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.set).toHaveBeenCalledWith('value', 0);
      expect(counter.set).toHaveBeenCalledWith('value', 1);
      expect(counter.get).toHaveBeenCalledWith('value');
      expect(counter.size).toBe(1);
    });

    it('should accept an instance of an ES6 Class with `extends` of an ES6 Map', () => {
      class Counter extends Map {
        constructor() {
          super();

          this.set('value', 0);
        }

        incrementBy(val) {
          this.set('value', this.get('value') + val);
        }

        increment() {
          this.incrementBy(1);
        }
      }

      const counter = new Counter();

      spyObject(counter);

      counter.increment();

      expect(counter.increment).toHaveBeenCalled();
      expect(counter.incrementBy).toHaveBeenCalledWith(1);
      expect(counter.set).toHaveBeenCalledWith('value', 1);
      expect(counter.get).toHaveBeenCalledWith('value');
    });

    it('should accept an ES6 Class with `extends` of an ES6 Set', () => {
      class Counter extends Set {
        constructor() {
          super();

          this.add(0);
        }

        push() {
          this.add(this.size);
        }
      }

      spyObject(Counter);

      const counter = new Counter();

      counter.push();

      expect(counter.push).toHaveBeenCalled();
      expect(counter.add).toHaveBeenCalledWith(0);
      expect(counter.add).toHaveBeenCalledWith(1);
      expect(counter.size).toBe(2);
    });

    it('should accept a function with static methods on it', () => {
      function request(uri) {
        return request.get(uri);
      }

      request.get = function(uti) {
        return uti;
      };

      spyObject(request);

      const uri = 'http://google.com';

      request(uri);

      expect(request.get).toHaveBeenCalledWith(uri);
    });
  });

  describe('Options', () => {
    describe('ignorePrototype', () => {
      it('should support a flag to force using Static methods only', () => {
        function Rollbar() {}

        Rollbar.prototype.error = function() {
          return 'fail';
        };

        Rollbar.error = function(msg) {
          return msg;
        };

        spyObject(Rollbar, { ignorePrototype: true });

        Rollbar.error('foo');

        expect(Rollbar.error).toHaveBeenCalledWith('foo');
      });
    });
  });

  describe('Mock implementations', () => {
    it('should be able to update a method implementation', () => {
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

      spyObject(Counter);

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
});
