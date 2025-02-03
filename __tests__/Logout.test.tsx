// __tests__/Logout.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/router";
import Logout from "../components/Logout";

jest.mock("axios");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Logout Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock localStorage
    jest.spyOn(window.localStorage.__proto__, "setItem");
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockReturnValue("test-token");
    jest.spyOn(window.localStorage.__proto__, "removeItem");

    render(<Logout />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the logout button", () => {
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("opens the confirmation dialog when logout button is clicked", () => {
    fireEvent.click(screen.getByText("Logout"));
    expect(
      screen.getByText("Are you sure you want to logout?")
    ).toBeInTheDocument();
  });

  it("removes token from localStorage and redirects on confirm", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    fireEvent.click(screen.getByText("Logout"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("does not remove token or redirect on cancel", () => {
    fireEvent.click(screen.getByText("Logout"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
