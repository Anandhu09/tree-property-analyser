const { parsePrice } = require("../../src/utils/parsePrice");

describe("parsePrice", () => {
  test("parses price with € and commas", () => {
    expect(parsePrice("€ 3,08,370.00")).toBe(308370);
  });

  test("parses price without €", () => {
    expect(parsePrice("5,57,000")).toBe(557000);
  });

  test("handles invalid price", () => {
    expect(parsePrice("invalid")).toBeNaN();
  });
});
