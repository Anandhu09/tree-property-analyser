const { calculateAveragePrices } = require("./services/priceCalculator");
const logger = require("./utils/logger");

const TREE_URL = "https://hiring.brightbeam.engineering/dublin-trees.json";
const PROPERTY_FILE = "data/dublin-property.csv";

/**
 * Main application entry point.
 * This function orchestrates the analysis by:
 * 1. Fetching tree height data from a remote JSON endpoint.
 * 2. Reading and processing property price data from a local CSV file.
 * 3. Calculating average property prices for streets with tall and short trees.
 * 4. Logging and displaying the results in a formatted currency string.
 *
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when the analysis is complete and results are logged.
 * @throws {Error} If data fetching, parsing, or processing fails due to network issues, invalid data, or file access errors.
 *
 */
async function main() {
  try {
    const { tallAverage, shortAverage } = await calculateAveragePrices(
      TREE_URL,
      PROPERTY_FILE,
    );
    console.log(
      `Average price on streets with tall trees: €${tallAverage.toFixed(2)}`,
    );
    console.log(
      `Average price on streets with short trees: €${shortAverage.toFixed(2)}`,
    );
  } catch (error) {
    logger.error(`Application error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
