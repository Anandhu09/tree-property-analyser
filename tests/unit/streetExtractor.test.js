const { extractStreetNames } = require("../../src/services/streetExtractor");
const logger = require("../../src/utils/logger");

jest.mock("../../src/utils/logger");

describe("streetExtractor", () => {
  beforeEach(() => {
    logger.info = jest.fn();
    logger.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("extracts street names from tall category", () => {
    const treeData = {
      tall: {
        road: {
          adelaide: { "adelaide road": 25 },
          beaumont: { "beaumont road": 20 },
        },
      },
    };
    const streets = extractStreetNames(treeData, "tall");
    expect(streets).toEqual(["adelaide road", "beaumont road"]);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Extracted 2 tall streets"),
    );
  });

  test("extracts street names from short category", () => {
    const treeData = {
      short: {
        drive: { abbey: { "abbey drive": 0 } },
      },
    };
    const streets = extractStreetNames(treeData, "short");
    expect(streets).toEqual(["abbey drive"]);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Extracted 1 short streets"),
    );
  });

  test("handles null values in tree data", () => {
    const treeData = {
      tall: {
        road: { adelaide: { "adelaide road": 25 }, invalid: null },
      },
    };
    const streets = extractStreetNames(treeData, "tall");
    expect(streets).toEqual(["adelaide road"]);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Extracted 1 tall streets"),
    );
  });

  test("handles non-numeric values in tree data", () => {
    const treeData = {
      tall: {
        road: { adelaide: { "adelaide road": 25 }, invalid: "not a number" },
      },
    };
    const streets = extractStreetNames(treeData, "tall");
    expect(streets).toEqual(["adelaide road"]);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Extracted 1 tall streets"),
    );
  });

  test("throws error for invalid category", () => {
    const treeData = { tall: {} };
    expect(() => extractStreetNames(treeData, "invalid")).toThrow(
      "Category 'invalid' not found",
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Invalid category"),
    );
  });
});
