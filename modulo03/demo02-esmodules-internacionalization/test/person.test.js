import mocha from "mocha";
const { describe, it } = mocha;
import chai from "chai";
const { expect } = chai;
import Person from "../src/person.js";

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
