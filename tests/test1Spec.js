const supertest = require("supertest");
const app = require("../index");

const request = supertest(app);

describe("Suite1: test server endpoint", () => {
  it("get the endpoint without url parameters", async () => {
    const response = await request.get("/auth/user-info").
    set("Authorization", "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2RmYmQ2MGFkMDQ1OWQwZjk4Mjc2MSIsInJvbGUiOiJhZG1pbiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2ODYwNDc4ODQsImV4cCI6MTY4NjY1MjY4NH0.vbxIkS09REyr_RGQ8AZdithUIktiv8ujvW_4pgnRd0A");
    expect(response.statusCode).toBe(400);
  });
});