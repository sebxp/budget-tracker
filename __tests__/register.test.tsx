// __tests__/register.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/router";
import Register from "../pages/register";

jest.mock("axios");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Register Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Register />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the registration form", () => {
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("displays an error message when inputs are empty", () => {
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(
      screen.getByText("Please, provide username and password")
    ).toBeInTheDocument();
  });

  it("registers successfully with valid credentials", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Registration successful! Redirecting to login...")
      ).toBeInTheDocument();
    });

    // Simulate the timeout for redirection
    await new Promise((resolve) => setTimeout(resolve, 2000));

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("displays an error message on registration failure", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(
      new Error("Registration failed")
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Registration failed. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
