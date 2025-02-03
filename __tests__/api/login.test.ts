// __tests__/api/auth/login.test.ts

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createMocks } from "node-mocks-http";
import handler from "../../pages/api/auth/login";
import { connectToDatabase } from "../../utils/mongodb";

// Mock external modules
jest.mock("../../utils/mongodb");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("POST /api/auth/login", () => {
  let dbMock: any;
  let usersCollectionMock: any;

  beforeEach(() => {
    dbMock = { collection: jest.fn() };
    usersCollectionMock = { findOne: jest.fn() };

    (connectToDatabase as jest.Mock).mockResolvedValue(dbMock);
    dbMock.collection.mockReturnValue(usersCollectionMock);
  });

  it("should return a 200 status code and a token when credentials are valid", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        username: "testuser",
        password: "testpassword",
      },
    });

    const mockedUser = { _id: "userId", password: "hashedpassword" };

    usersCollectionMock.findOne.mockResolvedValue(mockedUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ token: "mockedToken" });
  });

  it("should return a 401 status code if the user does not exist", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        username: "testuser",
        password: "testpassword",
      },
    });

    usersCollectionMock.findOne.mockResolvedValue(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: "Invalid credentials" });
  });

  it("should return a 401 status code if the password is incorrect", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        username: "testuser",
        password: "wrongpassword",
      },
    });

    const mockedUser = { _id: "userId", password: "hashedpassword" };

    usersCollectionMock.findOne.mockResolvedValue(mockedUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: "Invalid credentials" });
  });

  it("should return a 500 status code on database error", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        username: "testuser",
        password: "testpassword",
      },
    });

    (connectToDatabase as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: "Internal server error" });
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
