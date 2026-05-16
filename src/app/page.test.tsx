import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import Home from "./page";

describe("Home page", () => {
  test("renders the main heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /AI-Powered Battery Passport Gateway/i,
      }),
    ).toBeDefined();
  });

  test("renders CTA buttons", () => {
    render(<Home />);
    
    // Use getAllByRole if there are duplicates for some reason in the test env
    const getStartedLinks = screen.getAllByRole("link", { name: /get started/i });
    expect(getStartedLinks.length).toBeGreaterThanOrEqual(1);
    
    const dashboardLinks = screen.getAllByRole("link", { name: /view dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
  });
});
