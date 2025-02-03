// __tests__/api/auth/register.test.ts

import bcrypt from "bcryptjs";
import { createMocks } from "node-mocks-http";
import handler from "../../pages/api/auth/register";
import { connectToDatabase } from "../../utils/mongodb";

// Mock external modules
jest.mock("../../utils/mongodb");
jest.mock("bcryptjs");

describe("POST /api/auth/register", () => {
  let dbMock: any;
  let usersCollectionMock: any;

  beforeEach(() => {
    dbMock = { collection: jest.fn() };
    usersCollectionMock = { findOne: jest.fn(), insertOne: jest.fn() };

    (connectToDatabase as jest.Mock).mockResolvedValue(dbMock);
    dbMock.collection.mockReturnValue(usersCollectionMock);
  });

  it("should return a 201 status code when registration is successful", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        username: "newuser",
        password: "newpassword",
      },
    });

    usersCollectionMock.findOne.mockResolvedValue(null);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    usersCollectionMock.insertOne.mockResolvedValue({});

    await handler(req, res);

    expect(usersCollectionMock.insertOne).toHaveBeenCalledWith({
      username: "newuser",
      password: "hashedpassword",
    });
    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "User registered successfully",
    });
  });

  it("should return a 400 status code if the user already exists", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        username: "existinguser",
        password: "password",
      },
    });

    usersCollectionMock.findOne.mockResolvedValue({ username: "existinguser" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "User already exists" });
  });

  it("should return a 500 status code on database error", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        username: "newuser",
        password: "newpassword",
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
