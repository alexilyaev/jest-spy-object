'use strict';

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
