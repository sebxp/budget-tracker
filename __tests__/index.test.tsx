// __tests__/index.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/router";
import Home from "../pages/index";

jest.mock("axios");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Login Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock localStorage
    jest.spyOn(window.localStorage.__proto__, "setItem");
    jest.spyOn(window.localStorage.__proto__, "getItem");
    jest.spyOn(window.localStorage.__proto__, "removeItem");

    render(<Home />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form", () => {
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays an error message when inputs are empty", () => {
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(
      screen.getByText("Please, provide username and password")
    ).toBeInTheDocument();
  });

  it("logs in successfully with valid credentials", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { token: "test-token" },
    });

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays an error message on login failure", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Login failed"));

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Login failed. Please check your credentials.")
      ).toBeInTheDocument();
    });
  });
});
