// __tests__/api/budget.test.ts

import { ObjectId } from "mongodb";
import { createMocks } from "node-mocks-http";
import handler from "../../pages/api/budget/[budgetId]";
import { authenticateJWT } from "../../utils/auth";
import { connectToDatabase } from "../../utils/mongodb";

// Mock external modules
jest.mock("../../utils/mongodb");
jest.mock("../../utils/auth");

describe("Single Budget API", () => {
  let dbMock: any;
  let budgetsCollectionMock: any;

  beforeEach(() => {
    dbMock = { collection: jest.fn() };
    budgetsCollectionMock = { updateOne: jest.fn(), deleteOne: jest.fn() };

    (connectToDatabase as jest.Mock).mockResolvedValue(dbMock);
    dbMock.collection.mockReturnValue(budgetsCollectionMock);

    (authenticateJWT as jest.Mock).mockImplementation((req, res, next) =>
      next()
    );
  });

  it("should update a budget item and return 201 status code", async () => {
    const validObjectId = new ObjectId().toHexString();
    const { req, res } = createMocks({
      method: "PUT",
      query: { budgetId: validObjectId },
      body: { name: "Updated Budget", amount: 200 },
    });

    req.user = { id: "userId" }; // Ensure user is set on the request

    budgetsCollectionMock.updateOne.mockResolvedValue({ matchedCount: 1 });

    await handler(req, res);

    expect(budgetsCollectionMock.updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(validObjectId), userId: "userId" },
      { $set: { name: "Updated Budget", amount: 200 } }
    );
    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "Budget item updated successfully",
    });
  });

  it("should return 404 if budget item not found or not authorized on update", async () => {
    const validObjectId = new ObjectId().toHexString();
    const { req, res } = createMocks({
      method: "PUT",
      query: { budgetId: validObjectId },
      body: { name: "Updated Budget", amount: 200 },
    });

    req.user = { id: "userId" }; // Ensure user is set on the request

    budgetsCollectionMock.updateOne.mockResolvedValue({ matchedCount: 0 });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Budget item not found or not authorized",
    });
  });

  it("should delete a budget item and return 200 status code", async () => {
    const validObjectId = new ObjectId().toHexString();
    const { req, res } = createMocks({
      method: "DELETE",
      query: { budgetId: validObjectId },
    });

    req.user = { id: "userId" }; // Ensure user is set on the request

    budgetsCollectionMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await handler(req, res);

    expect(budgetsCollectionMock.deleteOne).toHaveBeenCalledWith({
      _id: new ObjectId(validObjectId),
      userId: "userId",
    });
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Budget item deleted successfully",
    });
  });

  it("should return 404 if budget item not found or not authorized on delete", async () => {
    const validObjectId = new ObjectId().toHexString();
    const { req, res } = createMocks({
      method: "DELETE",
      query: { budgetId: validObjectId },
    });

    req.user = { id: "userId" }; // Ensure user is set on the request

    budgetsCollectionMock.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Budget item not found or not authorized",
    });
  });

  it("should return 405 status code for unsupported methods", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders()).toEqual({ allow: ["PUT", "DELETE"] });
  });
});
