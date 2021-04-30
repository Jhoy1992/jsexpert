"use strict";var mocha;module.link("mocha",{default(v){mocha=v}},0);var chai;module.link("chai",{default(v){chai=v}},1);var Person;module.link("../src/person.js",{default(v){Person=v}},2);
const { describe, it } = mocha;

const { expect } = chai;


describe("Person", () => {
  it("should return a peson instance from a string", () => {
    const person = Person.generateInstanceFromString(
      "1 Car,Motocycle 77654 2014-01-21 2021-03-24"
    );

    const expected = {
      id: "1",
      vehicles: ["Car", "Motocycle"],
      kmTraveled: "77654",
      from: "2014-01-21",
      to: "2021-03-24",
    };

    expect(person).to.be.deep.equal(expected);
  });

  it("should format values", () => {
    const person = new Person({
      id: "1",
      vehicles: ["Car", "Motocycle"],
      kmTraveled: "77654",
      from: "2014-01-21",
      to: "2021-03-24",
    });

    const result = person.formatted("pt-BR");

    const expected = {
      id: 1,
      vehicles: "Car e Motocycle",
      kmTraveled: "77.654 km",
      from: "21 de janeiro de 2014",
      to: "24 de março de 2021",
    };

    expect(result).to.be.deep.equal(expected);
  });
});
