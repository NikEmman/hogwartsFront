import { render, screen } from "@testing-library/react";
import SpinningWheel from "../pages/components/SpinningWheel";

describe("SpinningWheel Component", () => {
  it("renders with default size and no text", () => {
    render(<SpinningWheel />);
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("renders with custom size and text", () => {
    render(<SpinningWheel size={60} text="Loading data.." />);
    expect(screen.getByText("Loading data..")).toBeInTheDocument();
  });
});
