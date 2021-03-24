const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { join } = require("path");
const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");

const CarService = require("../../src/service/carService");
const SERVER_TEST_PORT = 4000;

const mocks = {
  validCarCategory: require("./../mocks/valid-carCategory.json"),
  validCar: require("./../mocks/valid-car.json"),
  validCustomer: require("./../mocks/valid-Customer.json"),
};

describe("API Suite Tests", () => {
  let app = {};
  let sandbox = {};

  before(() => {
    const api = require("../../src/api");
    const carService = new CarService({
      cars: join(__dirname, "..", "..", "database", "cars.json"),
    });
    const instance = api({ carService });

    app = { instance, server: instance.initialize(SERVER_TEST_PORT) };
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("/rent:post", () => {
    it("given a customer, carCategory and numberOfDays it should return a transaction receipt", async () => {
      const car = mocks.validCar;

      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
        carIds: [car.id],
      };

      const customer = Object.create(mocks.validCustomer);
      customer.age = 20;

      const numberOfDays = 5;
      const dueDate = "30 de março de 2021";

      const now = new Date(2021, 2, 25);
      sandbox.useFakeTimers(now.getTime());

      sandbox
        .stub(
          app.instance.carService.carRepository,
          app.instance.carService.carRepository.find.name
        )
        .resolves(car);

      const expectedAmount = app.instance.carService.currencyFormat.format(
        206.8
      );

      const { body } = await request(app.server)
        .post("/rent")
        .send({ customer, carCategory, numberOfDays })
        .expect(200);

      const expected = {
        result: {
          customer,
          car,
          amount: expectedAmount,
          dueDate,
        },
      };

      expect(JSON.stringify(body)).to.be.deep.equal(JSON.stringify(expected));
    });

    it("given invalid parameters should return an error 500", async () => {
      await request(app.server).post("/rent").send({}).expect(500);
    });
  });

  describe("/calculateFinalPrice:post", () => {
    it("given a customer, carCategory and numberOfDays it should calculate the final amount in real", async () => {
      const customer = Object.create(mocks.validCustomer);
      customer.age = 50;

      const carCategory = Object.create(mocks.validCarCategory);
      carCategory.price = 37.6;

      const numberOfDays = 5;

      sandbox
        .stub(app.instance.carService, "taxesBasedOnAge")
        .get(() => [{ from: 40, to: 50, then: 1.3 }]);

      const expected = {
        result: app.instance.carService.currencyFormat.format(244.4),
      };

      const response = await request(app.server)
        .post("/calculateFinalPrice")
        .send({ customer, carCategory, numberOfDays })
        .expect(200);

      expect(response.body).to.be.deep.equal(expected);
    });

    it("given invalid parameters should return an error 500", async () => {
      await request(app.server)
        .post("/calculateFinalPrice")
        .send({})
        .expect(500);
    });
  });

  describe("/getAvailableCar:post", () => {
    it("given a carCategory it should return an available car", async () => {
      const car = mocks.validCar;
      const carCategory = Object.create(mocks.validCarCategory);
      carCategory.carIds = [car.id];

      sandbox
        .stub(
          app.instance.carService.carRepository,
          app.instance.carService.carRepository.find.name
        )
        .resolves(car);

      const response = await request(app.server)
        .post("/getAvailableCar")
        .send(carCategory)
        .expect(200);

      const expected = { result: car };

      expect(response.body).to.be.deep.equal(expected);
    });

    it("given invalid parameters should return an error 500", async () => {
      await request(app.server).post("/getAvailableCar").send({}).expect(500);
    });
  });

  describe("/invalidRoute", () => {
    it("should request an inexistent route and receive and error", async () => {
      const response = await request(app.server).get("/hi").expect(404);
      const expected = {
        error: "The route you request does not exists!",
      };

      expect(JSON.stringify(response.body)).to.be.deep.equal(
        JSON.stringify(expected)
      );
    });
  });
});
