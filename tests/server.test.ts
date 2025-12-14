import request from "supertest";
import app from "../src/app";

describe("Server API", () => {
  it("GET / should return 200 OK", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ok",
      message: "Express server is running",
    });
  });
});
