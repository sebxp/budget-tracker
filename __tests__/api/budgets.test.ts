// __tests__/api/budgets.test.ts

import { createMocks } from "node-mocks-http";
import handler from "../../pages/api/budget";
import { authenticateJWT } from "../../utils/auth";
import { connectToDatabase } from "../../utils/mongodb";

// Mock external modules
jest.mock("../../utils/mongodb");
jest.mock("../../utils/auth");

describe("Budgets API", () => {
  let dbMock: any;
  let budgetsCollectionMock: any;

  beforeEach(() => {
    dbMock = { collection: jest.fn() };
    budgetsCollectionMock = { find: jest.fn(), insertOne: jest.fn() };

    (connectToDatabase as jest.Mock).mockResolvedValue(dbMock);
    dbMock.collection.mockReturnValue(budgetsCollectionMock);

    (authenticateJWT as jest.Mock).mockImplementation((req, res, next) =>
      next()
    );
  });

  it("should return a 200 status code and budgets for GET requests", async () => {
    const { req, res } = createMocks({
      method: "GET",
      user: { id: "userId" },
    });

    budgetsCollectionMock.find.mockReturnValue({
      toArray: jest
        .fn()
        .mockResolvedValue([{ _id: "1", name: "Groceries", amount: 100 }]),
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual([
      { _id: "1", name: "Groceries", amount: 100 },
    ]);
  });

  it("should return a 201 status code and budget ID for POST requests", async () => {
    const { req, res } = createMocks({
      method: "POST",
      user: { id: "userId" },
      body: { name: "Utilities", amount: 150 },
    });

    budgetsCollectionMock.insertOne.mockResolvedValue({ insertedId: "2" });

    await handler(req, res);

    expect(budgetsCollectionMock.insertOne).toHaveBeenCalledWith({
      userId: "userId",
      name: "Utilities",
      amount: 150,
    });
    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({ _id: "2" });
  });

  it("should return a 405 status code for unsupported methods", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders()).toEqual({ allow: ["GET", "POST"] });
  });
});
