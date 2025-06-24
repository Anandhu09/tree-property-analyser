const {
  calculateAveragePrices,
} = require("../../src/services/priceCalculator");
const { fetchTreeData } = require("../../src/data/fetchTreeData");
const { parsePropertyData } = require("../../src/data/parsePropertyData");
const logger = require("../../src/utils/logger");

jest.mock("../../src/data/fetchTreeData");
jest.mock("../../src/data/parsePropertyData");
jest.mock("../../src/utils/logger");

describe("priceCalculator", () => {
  const mockTreeUrl = "http://test.com";
  const mockPropertyFile = "test.csv";

  beforeEach(() => {
    fetchTreeData.mockResolvedValue({
      tall: { road: { charlemont: { charlemont: 20 } } },
      short: {
        park: { the: { "the park": 10 } },
        street: { malahide: { "malahide road": 10 } },
      },
    });
    parsePropertyData.mockResolvedValue([
      { street: "charlemont", price: 557000 },
      { street: "the park", price: 79500 },
      { street: "malahide road", price: 140000 },
      { street: "charlemont", price: 30000 },
    ]);
    logger.info = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calculates correct averages with duplicates", async () => {
    const { tallAverage, shortAverage } = await calculateAveragePrices(
      mockTreeUrl,
      mockPropertyFile,
    );
    expect(tallAverage).toBe((557000 + 30000) / 2);
    expect(shortAverage).toBe((79500 + 140000) / 2);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Matched 2 tall properties"),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Matched 2 short properties"),
    );
  });

  test("returns zero averages for no matches", async () => {
    parsePropertyData.mockResolvedValue([{ street: "unknown", price: 100000 }]);
    const { tallAverage, shortAverage } = await calculateAveragePrices(
      mockTreeUrl,
      mockPropertyFile,
    );
    expect(tallAverage).toBe(0);
    expect(shortAverage).toBe(0);
  });

  test("handles errors from dependencies", async () => {
    fetchTreeData.mockRejectedValue(new Error("Fetch error"));
    await expect(
      calculateAveragePrices(mockTreeUrl, mockPropertyFile),
    ).rejects.toThrow("Fetch error");
    expect(logger.info).not.toHaveBeenCalled();
  });
});
