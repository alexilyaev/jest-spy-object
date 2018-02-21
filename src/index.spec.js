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
