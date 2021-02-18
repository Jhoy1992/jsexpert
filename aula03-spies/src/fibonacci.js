class Fibonacci {
  *execute(input, current = 0, next = 1) {
    if (input === 0) {
      return 0;
    }

    // return value
    yield current;
    // delegate the function but not return the value because of *
    yield* this.execute(input - 1, next, current + next);
  }
}

module.exports = Fibonacci;
