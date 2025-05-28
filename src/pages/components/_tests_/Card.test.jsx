import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "../Card";

// Mock the cssColors module
jest.mock("../../../../cssColors", () => [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "black",
  "white",
  "gray",
  "silver",
  "gold",
  "maroon",
  "navy",
  "teal",
]);

describe("Card Component", () => {
  const mockHouseComplete = {
    id: 1,
    name: "Gryffindor",
    animal: "Lion",
    heads: [
      { firstName: "Minerva", lastName: "McGonagall" },
      { firstName: "Godric", lastName: "Gryffindor" },
    ],
    houseColours: "red and gold",
    traits: [
      { id: 1, name: "Courage" },
      { id: 2, name: "Bravery" },
      { id: 3, name: "Determination" },
    ],
  };

  const mockHouseMinimal = {
    id: 2,
    name: "Slytherin",
    animal: "Serpent",
  };

  it("renders house information correctly with complete data", () => {
    render(<Card house={mockHouseComplete} />);

    expect(screen.getByText("Gryffindor")).toBeInTheDocument();
    expect(screen.getByText("Lion")).toBeInTheDocument();
    expect(screen.getByText("Godric Gryffindor")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search house traits")
    ).toBeInTheDocument();
  });

  it("renders house information correctly with minimal data", () => {
    render(<Card house={mockHouseMinimal} />);

    expect(screen.getByText("Slytherin")).toBeInTheDocument();
    expect(screen.getByText("Serpent")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search house traits")
    ).toBeInTheDocument();
  });

  it("handles empty house prop", () => {
    render(<Card house={{}} />);

    // Should render without crashing and show fallback values
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search house traits")
    ).toBeInTheDocument();
  });

  it("handles undefined house prop", () => {
    render(<Card />);

    // Should render without crashing and show fallback values
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search house traits")
    ).toBeInTheDocument();
  });

  it("displays all traits initially", () => {
    render(<Card house={mockHouseComplete} />);

    expect(screen.getByText("Courage")).toBeInTheDocument();
    expect(screen.getByText("Bravery")).toBeInTheDocument();
    expect(screen.getByText("Determination")).toBeInTheDocument();
  });

  it("filters traits based on search input", async () => {
    const user = userEvent.setup();
    render(<Card house={mockHouseComplete} />);

    const searchInput = screen.getByPlaceholderText("Search house traits");

    await user.type(searchInput, "courage");

    await waitFor(() => {
      expect(screen.getByText("Courage")).toBeInTheDocument();
      expect(screen.queryByText("Bravery")).not.toBeInTheDocument();
      expect(screen.queryByText("Determination")).not.toBeInTheDocument();
    });
  });

  it("shows no traits when search doesn't match any", async () => {
    const user = userEvent.setup();
    render(<Card house={mockHouseComplete} />);

    const searchInput = screen.getByPlaceholderText("Search house traits");

    await user.type(searchInput, "xyz");

    await waitFor(() => {
      expect(screen.queryByText("Courage")).not.toBeInTheDocument();
      expect(screen.queryByText("Bravery")).not.toBeInTheDocument();
      expect(screen.queryByText("Determination")).not.toBeInTheDocument();
    });
  });

  it("search is case insensitive", async () => {
    const user = userEvent.setup();
    render(<Card house={mockHouseComplete} />);

    const searchInput = screen.getByPlaceholderText("Search house traits");

    await user.type(searchInput, "COURAGE");

    await waitFor(() => {
      expect(screen.getByText("Courage")).toBeInTheDocument();
      expect(screen.queryByText("Bravery")).not.toBeInTheDocument();
      expect(screen.queryByText("Determination")).not.toBeInTheDocument();
    });
  });

  it("clears search and shows all traits when input is cleared", async () => {
    const user = userEvent.setup();
    render(<Card house={mockHouseComplete} />);

    const searchInput = screen.getByPlaceholderText("Search house traits");

    // First, filter traits
    await user.type(searchInput, "courage");

    await waitFor(() => {
      expect(screen.getByText("Courage")).toBeInTheDocument();
      expect(screen.queryByText("Bravery")).not.toBeInTheDocument();
    });

    // Then clear the input
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText("Courage")).toBeInTheDocument();
      expect(screen.getByText("Bravery")).toBeInTheDocument();
      expect(screen.getByText("Determination")).toBeInTheDocument();
    });
  });

  it("handles house with no traits gracefully", () => {
    const houseWithoutTraits = {
      ...mockHouseComplete,
      traits: undefined,
    };

    render(<Card house={houseWithoutTraits} />);

    expect(screen.getByText("Gryffindor")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search house traits")
    ).toBeInTheDocument();
    // Should not show any trait elements
    expect(screen.queryByText("Courage")).not.toBeInTheDocument();
  });

  it("handles house with empty traits array", () => {
    const houseWithEmptyTraits = {
      ...mockHouseComplete,
      traits: [],
    };

    render(<Card house={houseWithEmptyTraits} />);

    expect(screen.getByText("Gryffindor")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search house traits")
    ).toBeInTheDocument();
    // Should not show any trait elements
    expect(screen.queryByText("Courage")).not.toBeInTheDocument();
  });

  describe("Color gradient functionality", () => {
    it("applies valid colors to gradient", () => {
      render(<Card house={mockHouseComplete} />);

      const gradient = screen.getByTestId("color-gradient");
      expect(gradient).toHaveStyle({
        background: "linear-gradient(to right, red, gold)",
      });
    });

    it("uses default colors for invalid house colors", () => {
      const houseWithInvalidColors = {
        ...mockHouseComplete,
        houseColours: "invalidcolor and anotherInvalid",
      };

      render(<Card house={houseWithInvalidColors} />);

      const gradient = screen.getByTestId("color-gradient");
      expect(gradient).toHaveStyle({
        background: "linear-gradient(to right, white, black)",
      });
    });

    it("uses default colors when houseColours is undefined", () => {
      const houseWithoutColors = {
        ...mockHouseComplete,
        houseColours: undefined,
      };

      render(<Card house={houseWithoutColors} />);

      const gradient = screen.getByTestId("color-gradient");
      expect(gradient).toHaveStyle({
        background: "linear-gradient(to right, white, black)",
      });
    });

    it("uses default colors when houseColours is not a string", () => {
      const houseWithNonStringColors = {
        ...mockHouseComplete,
        houseColours: 123,
      };

      render(<Card house={houseWithNonStringColors} />);

      const gradient = screen.getByTestId("color-gradient");
      expect(gradient).toHaveStyle({
        background: "linear-gradient(to right, white, black)",
      });
    });

    it("handles single valid color with invalid second color", () => {
      const houseWithMixedColors = {
        ...mockHouseComplete,
        houseColours: "red and invalidcolor",
      };

      render(<Card house={houseWithMixedColors} />);

      const gradient = screen.getByTestId("color-gradient");
      expect(gradient).toHaveStyle({
        background: "linear-gradient(to right, white, black)",
      });
    });
  });

  describe("Head name functionality", () => {
    it("handles house with empty heads array", () => {
      const houseWithoutHeads = {
        ...mockHouseComplete,
        heads: [],
      };

      render(<Card house={houseWithoutHeads} />);
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });

    it("handles house with undefined heads", () => {
      const houseWithUndefinedHeads = {
        ...mockHouseComplete,
        heads: undefined,
      };

      render(<Card house={houseWithUndefinedHeads} />);
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });

    it("handles house with only one head", () => {
      const houseWithOneHead = {
        ...mockHouseComplete,
        heads: [{ firstName: "Godric", lastName: "Gryffindor" }],
      };

      render(<Card house={houseWithOneHead} />);
      expect(screen.getByText("Godric Gryffindor")).toBeInTheDocument();
    });
  });

  describe("Partial matching in trait search", () => {
    it("matches partial trait names", async () => {
      const user = userEvent.setup();
      render(<Card house={mockHouseComplete} />);

      const searchInput = screen.getByPlaceholderText("Search house traits");

      await user.type(searchInput, "brave");

      await waitFor(() => {
        expect(screen.getByText("Bravery")).toBeInTheDocument();
        expect(screen.queryByText("Courage")).not.toBeInTheDocument();
        expect(screen.queryByText("Determination")).not.toBeInTheDocument();
      });
    });

    it("shows multiple matching traits", async () => {
      const houseWithSimilarTraits = {
        ...mockHouseComplete,
        traits: [
          { id: 1, name: "Courageous" },
          { id: 2, name: "Courage" },
          { id: 3, name: "Bravery" },
        ],
      };

      const user = userEvent.setup();
      render(<Card house={houseWithSimilarTraits} />);

      const searchInput = screen.getByPlaceholderText("Search house traits");

      await user.type(searchInput, "courage");

      await waitFor(() => {
        expect(screen.getByText("Courageous")).toBeInTheDocument();
        expect(screen.getByText("Courage")).toBeInTheDocument();
        expect(screen.queryByText("Bravery")).not.toBeInTheDocument();
      });
    });
  });
});
