// __tests__/dashboard.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/router";
import Dashboard from "../pages/dashboard";

jest.mock("axios");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Dashboard Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock localStorage
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockReturnValue("test-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays budget items from the API", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { _id: "1", name: "Groceries", amount: 100 },
        { _id: "2", name: "Utilities", amount: 150 },
      ],
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Groceries: $100")).toBeInTheDocument();
      expect(screen.getByText("Utilities: $150")).toBeInTheDocument();
    });
  });

  it("adds a new budget item", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    render(<Dashboard />);

    // Mock the POST request for adding a new budget item
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { _id: "3", name: "Entertainment", amount: 200 },
    });

    // Simulate adding a new budget item
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Entertainment" },
    });
    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "200" },
    });
    fireEvent.click(screen.getByText("Add"));

    // Mock the GET request to include the new item
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ _id: "3", name: "Entertainment", amount: 200 }],
    });

    await waitFor(() => {
      expect(screen.getByText("Entertainment: $200")).toBeInTheDocument();
    });
  });

  it("edits an existing budget item", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ _id: "1", name: "Groceries", amount: 100 }],
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Groceries: $100")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    // Mock the PUT request for editing the budget item
    (axios.put as jest.Mock).mockResolvedValueOnce({
      data: { _id: "1", name: "Food", amount: 120 },
    });

    fireEvent.change(screen.getByDisplayValue("Groceries"), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByDisplayValue("100"), {
      target: { value: "120" },
    });
    fireEvent.click(screen.getByText("Update"));

    // Mock the GET request to include the updated item
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ _id: "1", name: "Food", amount: 120 }],
    });

    await waitFor(() => {
      expect(screen.getByText("Food: $120")).toBeInTheDocument();
    });
  });

  it("removes a budget item", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ _id: "1", name: "Groceries", amount: 100 }],
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Groceries: $100")).toBeInTheDocument();
    });

    // Mock the DELETE request for removing the budget item
    (axios.delete as jest.Mock).mockResolvedValueOnce({});

    // Simulate opening the confirmation dialog
    fireEvent.click(screen.getByText("Remove"));

    // Simulate confirming the removal
    fireEvent.click(screen.getByText("Confirm"));

    // Mock the GET request to reflect the removal
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    await waitFor(() => {
      expect(screen.queryByText("Groceries: $100")).not.toBeInTheDocument();
    });
  });
});
