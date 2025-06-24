const fetch = require("node-fetch");
const { fetchTreeData } = require("../../src/data/fetchTreeData");
const logger = require("../../src/utils/logger");

jest.mock("node-fetch");
jest.mock("../../src/utils/logger");

/**
 * @description Unit tests for the fetchTreeData module.
 */
describe("fetchTreeData", () => {
  const mockUrl = "http://test.com";
  const mockTreeData = { tall: {}, short: {} };
  const defaultFetchOptions = {
    method: "GET",
    timeout: 10000,
    headers: {},
  };

  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTreeData),
      status: 200,
      statusText: "OK",
    });
    logger.info = jest.fn();
    logger.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and returns tree data successfully", async () => {
    const data = await fetchTreeData(mockUrl);
    expect(data).toEqual(mockTreeData);
    expect(fetch).toHaveBeenCalledWith(mockUrl, defaultFetchOptions);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Fetching tree data from ${mockUrl}`),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        `Successfully fetched tree data with keys: tall, short`,
      ),
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("fetches tree data with custom config", async () => {
    const customConfig = {
      timeout: 5000,
      headers: { Authorization: "Bearer token" },
      method: "GET",
    };
    await fetchTreeData(mockUrl, customConfig);
    expect(fetch).toHaveBeenCalledWith(mockUrl, customConfig);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        `Fetching tree data from ${mockUrl} with method GET`,
      ),
    );
  });

  test("throws error on empty URL", async () => {
    await expect(fetchTreeData("")).rejects.toThrow("Invalid or missing URL");
    expect(fetch).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "Failed to fetch tree data from : Invalid or missing URL",
      ),
    );
  });

  test("throws error on null URL", async () => {
    await expect(fetchTreeData(null)).rejects.toThrow("Invalid or missing URL");
    expect(fetch).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "Failed to fetch tree data from null: Invalid or missing URL",
      ),
    );
  });

  test("throws error on non-string URL", async () => {
    await expect(fetchTreeData(123)).rejects.toThrow("Invalid or missing URL");
    expect(fetch).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "Failed to fetch tree data from 123: Invalid or missing URL",
      ),
    );
  });

  test("throws error on HTTP failure", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: jest.fn().mockResolvedValue({}),
    });
    await expect(fetchTreeData(mockUrl)).rejects.toThrow(
      "HTTP error: 404 Not Found",
    );
    expect(fetch).toHaveBeenCalledWith(mockUrl, defaultFetchOptions);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        `Failed to fetch tree data from ${mockUrl}: HTTP error: 404 Not Found`,
      ),
    );
  });

  test("throws error on network failure", async () => {
    fetch.mockRejectedValue(new Error("Network error"));
    await expect(fetchTreeData(mockUrl)).rejects.toThrow(
      "Unable to fetch tree data: Network error",
    );
    expect(fetch).toHaveBeenCalledWith(mockUrl, defaultFetchOptions);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        `Failed to fetch tree data from ${mockUrl}: Network error`,
      ),
    );
  });

  test("throws error on null JSON response", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(null),
      status: 200,
      statusText: "OK",
    });
    await expect(fetchTreeData(mockUrl)).rejects.toThrow(
      "Invalid JSON response: Expected a non-array object",
    );
    expect(fetch).toHaveBeenCalledWith(mockUrl, defaultFetchOptions);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        `Failed to fetch tree data from ${mockUrl}: Invalid JSON response`,
      ),
    );
  });

  test("throws error on array JSON response", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
      status: 200,
      statusText: "OK",
    });
    await expect(fetchTreeData(mockUrl)).rejects.toThrow(
      "Invalid JSON response: Expected a non-array object",
    );
    expect(fetch).toHaveBeenCalledWith(mockUrl, defaultFetchOptions);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        `Failed to fetch tree data from ${mockUrl}: Invalid JSON response`,
      ),
    );
  });
});
