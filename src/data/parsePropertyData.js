const fs = require("fs").promises;
const { parse } = require("csv-parse");
const logger = require("../utils/logger");
const { parsePrice } = require("../utils/parsePrice");

/**
 * Asynchronously parses property data from a CSV file into a structured format.
 * 
 * This function reads a CSV file, validates its content, and extracts property records
 * containing street names and prices. It handles errors gracefully, logs processing
 * details, and skips invalid or incomplete rows. The CSV is expected to have columns
 * "Street Name" and "Price".
 * 
 * @param {string} filePath - The absolute or relative path to the CSV file.
 * @returns {Promise<Array<{street: string, price: number}>>} A promise resolving to an array of property objects,
 *          each containing a `street` (string) and `price` (number).
 * @throws {Error} If the file is missing, empty, or parsing fails due to invalid CSV structure.

 */
async function parsePropertyData(filePath) {
  try {
    logger.info(`Reading CSV from ${filePath}`);
    const data = await fs.readFile(filePath, "utf-8");
    if (!data.trim()) {
      throw new Error("CSV file is empty");
    }

    const properties = [];

    return new Promise((resolve, reject) => {
      parse(data, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        quote: '"',
        relax_quotes: true,
        relax_column_count: true,
      })
        .on("data", (row) => {
          logger.debug(`Processing row: ${JSON.stringify(row)}`);

          const street = row["Street Name"];
          const priceStr = row["Price"];

          if (!street || !priceStr) {
            logger.warn(
              `Skipping row with missing Street Name or Price: ${JSON.stringify(row)}`,
            );
            return;
          }

          const price = parsePrice(priceStr);

          if (!isNaN(price) && price > 0) {
            properties.push({ street, price });
          } else {
            logger.warn(
              `Skipping invalid price: ${priceStr} (parsed as ${price})`,
            );
          }
        })
        .on("end", () => {
          logger.info(`Parsed ${properties.length} valid properties`);
          resolve(properties);
        })
        .on("error", (error) => {
          logger.error(`CSV parsing error: ${error.message}`);
          reject(new Error(`Error parsing CSV: ${error.message}`));
        });
    });
  } catch (error) {
    logger.error(`Error reading CSV: ${error.message}`);

    if (error.code === "ENOENT") {
      throw new Error(`Property data file not found: ${filePath}`);
    }
    throw new Error(`Error reading CSV: ${error.message}`);
  }
}

module.exports = { parsePropertyData };
