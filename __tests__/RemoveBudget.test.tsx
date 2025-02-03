// __tests__/RemoveBudget.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import RemoveBudget from "../components/RemoveBudget";

jest.mock("axios");

describe("RemoveBudget Component", () => {
  let mockOnBudgetRemoved: jest.Mock;
  const budgetId = "1";

  beforeEach(() => {
    mockOnBudgetRemoved = jest.fn();
    render(
      <RemoveBudget budgetId={budgetId} onBudgetRemoved={mockOnBudgetRemoved} />
    );
  });

  it("renders the remove button", () => {
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("opens the confirmation dialog when remove button is clicked", () => {
    fireEvent.click(screen.getByText("Remove"));
    expect(
      screen.getByText("Are you sure you want to remove this budget item?")
    ).toBeInTheDocument();
  });

  it("calls onBudgetRemoved when confirmed", async () => {
    (axios.delete as jest.Mock).mockResolvedValueOnce({ data: {} });

    fireEvent.click(screen.getByText("Remove"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => expect(mockOnBudgetRemoved).toHaveBeenCalled());
  });

  it("does not call onBudgetRemoved when canceled", () => {
    fireEvent.click(screen.getByText("Remove"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnBudgetRemoved).not.toHaveBeenCalled();
  });
});
