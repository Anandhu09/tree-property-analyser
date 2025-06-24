const fs = require("fs");
const { parsePropertyData } = require("../../src/data/parsePropertyData");
const logger = require("../../src/utils/logger");

jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }),
  format: {
    combine: jest.fn().mockReturnValue({}),
    timestamp: jest.fn(),
    json: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

jest.mock("../../src/utils/logger");

describe("parsePropertyData", () => {
  const mockFilePath = "test.csv";
  const mockCsv = [
    "Date of Sale (dd/mm/yyyy),Address,Street Name,Price",
    '01/01/2015,"APT 274, THE PARKLANDS, NORTHWOOD",the park,"�79,500.00"',
    '05/01/2015,"61 CHARLEMONT, GRIFFITH AVE, DUBLIN 9",charlemont,"�557,000.00"',
    '06/01/2015,"6A Church Street, Finglas, Dublin 11",church street,"�160,000.00"',
  ].join("\n");

  beforeEach(() => {
    fs.promises.readFile.mockResolvedValue(mockCsv);
    logger.info = jest.fn();
    logger.warn = jest.fn();
    logger.error = jest.fn();
    logger.debug = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("parses CSV correctly with duplicates", async () => {
    const properties = await parsePropertyData(mockFilePath);
    expect(properties).toEqual([
      { street: "the park", price: 79500 },
      { street: "charlemont", price: 557000 },
      { street: "church street", price: 160000 },
    ]);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Parsed 3 valid properties"),
    );
  });

  test("handles empty CSV", async () => {
    fs.promises.readFile.mockResolvedValue("");
    await expect(parsePropertyData(mockFilePath)).rejects.toThrow(
      "CSV file is empty",
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("CSV file is empty"),
    );
  });

  test("handles missing file", async () => {
    fs.promises.readFile.mockRejectedValue({ code: "ENOENT" });
    await expect(parsePropertyData(mockFilePath)).rejects.toThrow(
      "Property data file not found",
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error reading CSV"),
    );
  });

  test("skips invalid rows", async () => {
    const invalidCsv = [
      "Date of Sale (dd/mm/yyyy),Address,Street Name,Price",
      '01/01/2015,"APT 274, THE PARKLANDS, NORTHWOOD",,"�79,500.00"',
      '05/01/2015,"61 CHARLEMONT, GRIFFITH AVE, DUBLIN 9",charlemont,"invalid"',
    ].join("\n");
    fs.promises.readFile.mockResolvedValue(invalidCsv);
    const properties = await parsePropertyData(mockFilePath);
    expect(properties).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Skipping row with missing Street Name"),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Skipping invalid price"),
    );
  });

  test("handles malformed CSV", async () => {
    const malformedCsv = [
      "Date of Sale (dd/mm/yyyy),Address,Street Name,Price",
      '01/01/2015,"Unclosed quote,the park,"�79,500.00"',
    ].join("\n");
    fs.promises.readFile.mockResolvedValue(malformedCsv);
    await expect(parsePropertyData(mockFilePath)).rejects.toThrow(
      "Error parsing CSV",
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("CSV parsing error"),
    );
  });

  test("handles file read permission error", async () => {
    fs.promises.readFile.mockRejectedValue({
      code: "EACCES",
      message: "Permission denied",
    });
    await expect(parsePropertyData(mockFilePath)).rejects.toThrow(
      "Error reading CSV: Permission denied",
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error reading CSV"),
    );
  });
});
