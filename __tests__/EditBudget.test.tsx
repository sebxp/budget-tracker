// __tests__/EditBudget.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import EditBudget from "../components/EditBudget";

jest.mock("axios");

describe("EditBudget Component", () => {
  const mockOnBudgetUpdated = jest.fn();
  const budgetItem = { _id: "1", name: "Groceries", amount: 100 };

  beforeEach(() => {
    render(
      <EditBudget
        budgetItem={budgetItem}
        onBudgetUpdated={mockOnBudgetUpdated}
      />
    );
  });

  it("renders the form with existing budget item details", () => {
    expect(screen.getByDisplayValue("Groceries")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("displays an error message when inputs are invalid", () => {
    fireEvent.change(screen.getByDisplayValue("Groceries"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Update"));
    expect(
      screen.getByText("Please enter a valid name and amount.")
    ).toBeInTheDocument();
  });

  it("calls onBudgetUpdated when a valid budget item is updated", async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    fireEvent.change(screen.getByDisplayValue("Groceries"), {
      target: { value: "Utilities" },
    });
    fireEvent.change(screen.getByDisplayValue("100"), {
      target: { value: "150" },
    });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => expect(mockOnBudgetUpdated).toHaveBeenCalled());
  });
});
