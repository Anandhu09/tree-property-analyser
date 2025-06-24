const logger = require("../utils/logger");
const { fetchTreeData } = require("../data/fetchTreeData");
const { parsePropertyData } = require("../data/parsePropertyData");
const { extractStreetNames } = require("./streetExtractor");

/**
 * Calculates the average property prices for streets with tall and short trees.
 *
 * This function fetches tree height data from a JSON URL, extracts street names categorized by tree height,
 * parses property data from a CSV file, and computes the average property prices for streets with tall and short trees.
 * It handles edge cases such as empty datasets or mismatched streets and logs relevant information for debugging.
 *
 * @param {string} treeUrl - The URL to the JSON file containing tree height data.
 * @param {string} propertyFile - The file path to the CSV file containing property data.
 * @returns {Promise<{ tallAverage: number, shortAverage: number }>} A promise that resolves to an object containing:
 *          - tallAverage: The average price of properties on streets with tall trees (0 if no matches).
 *          - shortAverage: The average price of properties on streets with short trees (0 if no matches).
 * @throws {Error} If fetching tree data, parsing property data, or processing fails due to invalid inputs or external errors.
 */
async function calculateAveragePrices(treeUrl, propertyFile) {
  const treeData = await fetchTreeData(treeUrl);
  const tallStreets = extractStreetNames(treeData, "tall");
  const shortStreets = extractStreetNames(treeData, "short");
  const properties = await parsePropertyData(propertyFile);

  const tallPrices = properties
    .filter((prop) =>
      tallStreets.some(
        (street) => street.toLowerCase() === prop.street.toLowerCase(),
      ),
    )
    .map((prop) => prop.price);
  const shortPrices = properties
    .filter((prop) =>
      shortStreets.some(
        (street) => street.toLowerCase() === prop.street.toLowerCase(),
      ),
    )
    .map((prop) => prop.price);

  logger.info(
    `Matched ${tallPrices.length} tall properties: ${tallPrices.slice(0, 5).join(", ")}...`,
  );
  logger.info(
    `Matched ${shortPrices.length} short properties: ${shortPrices.slice(0, 5).join(", ")}...\n`,
  );

  const tallAverage = tallPrices.length
    ? tallPrices.reduce((sum, price) => sum + price, 0) / tallPrices.length
    : 0;
  const shortAverage = shortPrices.length
    ? shortPrices.reduce((sum, price) => sum + price, 0) / shortPrices.length
    : 0;

  return { tallAverage, shortAverage };
}

module.exports = { calculateAveragePrices };
