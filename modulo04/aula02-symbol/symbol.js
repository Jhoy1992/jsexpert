const assert = require("assert");

// Keys
const uniqueKey = Symbol("userName");
const user = {};

user["userName"] = "value for normal objects";
user[uniqueKey] = "value for symbol";

// Symbol always returns a unique diferent key

assert.deepStrictEqual(user.userName, "value for normal objects");
assert.deepStrictEqual(user[uniqueKey], "value for symbol");
assert.deepStrictEqual(user[Symbol("userName")], undefined);

assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

// Well Know Symbols
const obj = {
  [Symbol.iterator]: () => ({
    items: ["a", "b", "c"],
    next() {
      return {
        done: this.items.length === 0,
        value: this.items.shift(),
      };
    },
  }),
};

assert.deepStrictEqual([...obj], ["a", "b", "c"]);

const kItems = Symbol("kItems");
class MyDate {
  constructor(...args) {
    this[kItems] = args.map(arg => new Date(...arg));
  }

  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== "string") throw new TypeError();

    const itens = this[kItems].map(item =>
      new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(item)
    );

    return new Intl.ListFormat("pt-BR", {
      style: "long",
      type: "conjunction",
    }).format(itens);
  }

  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  async *[Symbol.asyncIterator]() {
    const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (const item of this[kItems]) {
      await timeout(100);
      yield item.toISOString();
    }
  }

  get [Symbol.toStringTag]() {
    return "WHAT?";
  }
}

const myDate = new MyDate([2020, 02, 21], [2010, 06, 03], [2021, 02, 30]);
const expectedDates = [
  new Date(2020, 02, 21),
  new Date(2010, 06, 03),
  new Date(2021, 02, 30),
];

assert.deepStrictEqual(
  Object.prototype.toString.call(myDate),
  "[object WHAT?]"
);

assert.throws(() => myDate + 1, TypeError);
assert.deepStrictEqual(
  String(myDate),
  "21 de março de 2020, 03 de julho de 2010 e 30 de março de 2021"
);

assert.deepStrictEqual([...myDate], expectedDates);

(async () => {
  const dates = await Promise.all([...myDate]);
  assert.deepStrictEqual(dates, expectedDates);
})();
