// __tests__/CreateBudget.test.tsx
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import CreateBudget from "../components/CreateBudget";
jest.mock("axios");

describe("CreateBudget Component", () => {
  const mockOnBudgetAdded = jest.fn();

  beforeEach(() => {
    render(<CreateBudget onBudgetAdded={mockOnBudgetAdded} />);
  });

  it("renders the form inputs and button", () => {
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("displays an error message when inputs are invalid", () => {
    fireEvent.click(screen.getByText("Add"));
    expect(
      screen.getByText("Please enter a valid name and amount.")
    ).toBeInTheDocument();
  });

  it("calls onBudgetAdded when a valid budget item is added", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Groceries" },
    });
    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "100" },
    });
    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => expect(mockOnBudgetAdded).toHaveBeenCalled());
  });
});
