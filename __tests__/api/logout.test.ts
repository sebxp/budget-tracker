// __tests__/api/auth/logout.test.ts

import jwt from "jsonwebtoken";
import { createMocks } from "node-mocks-http";
import handler from "../../pages/api/auth/logout";
import { addToBlacklist } from "../../utils/tokenBlacklist";

// Mock external modules
jest.mock("jsonwebtoken");
jest.mock("../../utils/tokenBlacklist");

describe("POST /api/auth/logout", () => {
  it("should return a 200 status code and add token to blacklist when logout is successful", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
    });

    (jwt.verify as jest.Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    await handler(req, res);

    expect(addToBlacklist).toHaveBeenCalledWith(
      "valid-token",
      expect.any(Number)
    );
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: "Logged out successfully" });
  });

  it("should return a 401 status code if the authorization header is missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: "Authorization header missing",
    });
  });

  it("should return a 401 status code if the token is missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: {
        authorization: "Bearer ",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: "Token missing" });
  });

  it("should return a 403 status code if the token is invalid", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: {
        authorization: "Bearer invalid-token",
      },
    });

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toEqual({ message: "Invalid token" });
  });

  it("should return a 405 status code if the method is not POST", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders()).toEqual({ allow: ["POST"] });
  });
});
