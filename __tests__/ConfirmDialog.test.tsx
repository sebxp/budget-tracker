// __tests__/ConfirmDialog.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import ConfirmDialog from "../components/ConfirmDialog";

describe("ConfirmDialog Component", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    render(
      <ConfirmDialog
        message="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the confirmation message", () => {
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("calls onConfirm when the Confirm button is clicked", () => {
    fireEvent.click(screen.getByText("Confirm"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when the Cancel button is clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
