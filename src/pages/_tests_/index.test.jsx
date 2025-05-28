import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../index";
import fetchMock from "jest-fetch-mock";

// Mock the components
jest.mock("../components/SpinningWheel", () => {
  return function MockSpinningWheel({ text }) {
    return <div data-testid="spinning-wheel">{text}</div>;
  };
});

jest.mock("../components/Card", () => {
  return function MockCard({ house }) {
    return <div data-testid="house-card" />;
  };
});

// Mock Next.js Head component
jest.mock("next/head", () => {
  return function MockHead({ children }) {
    return <>{children}</>;
  };
});

fetchMock.enableMocks();

// Mock environment variable
const mockApiUrl = "https://api.example.com";
process.env.NEXT_PUBLIC_API_URL = mockApiUrl;

describe("Home Page", () => {
  it("renders loading state initially", async () => {
    fetchMock.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve([]),
              }),
            100
          )
        )
    );

    render(<Home />);

    expect(screen.getByTestId("spinning-wheel")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByTestId("spinning-wheel")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("renders house cards when API call succeeds", async () => {
    const mockHouses = [
      { id: 1, name: "Gryffindor" },
      { id: 2, name: "Slytherin" },
    ];

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockHouses),
    });

    render(<Home />);

    await waitFor(
      () => {
        const cards = screen.getAllByTestId("house-card");
        expect(cards).toHaveLength(2);
      },
      { timeout: 3000 }
    );

    expect(fetchMock).toHaveBeenCalledWith(`${mockApiUrl}/houses?name=`);
  });

  it("displays error message when API call fails with network error", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    render(<Home />);

    await waitFor(
      () => {
        expect(
          screen.getByText("Something went wrong. Try again")
        ).toBeInTheDocument();
        expect(screen.queryByTestId("house-card")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("displays error message when API returns error status", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Home />);

    await waitFor(
      () => {
        expect(
          screen.getByText("Something went wrong. Try again")
        ).toBeInTheDocument();
        expect(screen.queryByTestId("house-card")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("displays 'No houses found' when API returns empty array", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<Home />);

    await waitFor(
      () => {
        expect(screen.getByText("No houses found.")).toBeInTheDocument();
        expect(screen.queryByTestId("house-card")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("clears previous results when new search yields no results", async () => {
    const user = userEvent.setup();
    const mockHouses = [{ id: 1, name: "Gryffindor" }];

    fetchMock.mockImplementation((url) => {
      const searchParam = new URL(url).searchParams.get("name");
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(searchParam === "" ? mockHouses : []),
      });
    });

    render(<Home />);

    await waitFor(
      () => {
        expect(screen.getAllByTestId("house-card")).toHaveLength(1);
      },
      { timeout: 3000 }
    );

    const input = screen.getByPlaceholderText("Search houses");
    await user.type(input, "NonExistentHouse");

    await waitFor(
      () => {
        expect(screen.queryByTestId("house-card")).not.toBeInTheDocument();
        expect(screen.getByText("No houses found.")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
