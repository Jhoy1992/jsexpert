const { describe, it } = require("mocha");
const request = require("supertest");
const app = require("./api");
const assert = require("assert");

describe("API Suite test", () => {
  describe("/contact", () => {
    it("should request the contact page and return HTTP Status 200", async () => {
      const response = await request(app).get("/contacts").expect(200);

      assert.deepStrictEqual(response.text, "contact us page");
      app.close();
    });
  });

  describe("/hello", () => {
    it("should request an inexistent route  /hi and redirect to hello", async () => {
      const response = await request(app).get("/hi").expect(200);

      assert.deepStrictEqual(response.text, "Hello World!");
      app.close();
    });
  });

  describe("/login", () => {
    it("should login successfully on the login route and return HTTP Status 200", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "Jhonatan", password: "123" })
        .expect(200);

      assert.deepStrictEqual(response.text, "Logging has succeeded!");
      app.close();
    });

    it("should unauthorize a request when requesting it using wrong credentials and return HTTP Status 401", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "John Doe", password: "123" })
        .expect(401);

      assert.ok(response.unauthorized);
      assert.deepStrictEqual(response.text, "Logging failed!");
      app.close();
    });

    it("should unauthorize a request when requesting it without passing credentials and return HTTP Status 401", async () => {
      const response = await request(app).post("/login").expect(401);

      assert.ok(response.unauthorized);
      assert.deepStrictEqual(response.text, "Credentials not provided!");
      app.close();
    });
  });
});
