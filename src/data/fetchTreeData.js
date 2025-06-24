const fetch = require("node-fetch");
const logger = require("../utils/logger");

/**
 * @module FetchTreeData
 * @description Module for fetching tree data from external APIs within the tree-property-analyser project.
 * @version 1.0.0
 */

/**
 * Configuration options for the HTTP fetch request.
 * @typedef {Object} FetchConfig
 * @property {number} [timeout=10000] - Request timeout in milliseconds.
 * @property {Object.<string, string>} [headers={}] - Custom HTTP headers for the request.
 * @property {string} [method='GET'] - HTTP method for the request.
 */

/**
 * Fetches tree data from the specified URL.
 * @async
 * @function fetchTreeData
 * @param {string} url - The URL to fetch tree data from.
 * @param {FetchConfig} [config={}] - Optional configuration for the fetch request.
 * @returns {Promise<object>} The parsed JSON tree data.
 * @throws {Error} If the URL is invalid, the fetch request fails, or the JSON response is invalid.
 */
async function fetchTreeData(url, config = {}) {
  try {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid or missing URL");
    }

    const fetchOptions = {
      method: config.method || "GET",
      timeout: config.timeout || 10000,
      headers: config.headers || {},
    };

    logger.info(
      `Fetching tree data from ${url} with method ${fetchOptions.method}`,
    );
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Invalid JSON response: Expected a non-array object");
    }

    logger.info(
      `Successfully fetched tree data with keys: ${Object.keys(data).join(", ")}`,
    );
    return data;
  } catch (error) {
    logger.error(`Failed to fetch tree data from ${url}: ${error.message}`);
    throw new Error(`Unable to fetch tree data: ${error.message}`);
  }
}

module.exports = { fetchTreeData };
