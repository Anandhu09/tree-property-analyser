const logger = require("../utils/logger");

/**
 * Extracts street names from a specified category in the tree data.
 *
 * This function traverses a nested tree data object for a given category ('tall' or 'short') and extracts
 * street names associated with numeric values (e.g., tree heights). It validates inputs, logs the extracted
 * streets for debugging, and handles edge cases such as invalid categories or malformed data.
 *
 * @param {object} treeData - The tree data object containing categorized street data (e.g., { tall: {...}, short: {...} }).
 * @param {string} category - The category to extract streets from ('tall' or 'short').
 * @returns {string[]} An array of street names extracted from the specified category.
 * @throws {Error} If the category is invalid, missing, or if treeData is not an object.
 *
 */
function extractStreetNames(treeData, category) {
  if (!treeData[category]) {
    logger.error(`Invalid category: ${category}`);
    throw new Error(`Category '${category}' not found in tree data`);
  }

  const traverse = (node) => {
    const streets = [];
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "object" && value !== null) {
        streets.push(...traverse(value));
      } else if (typeof value === "number") {
        streets.push(key);
      }
    }
    return streets;
  };

  const streets = traverse(treeData[category]);
  logger.info(
    `Extracted ${streets.length} ${category} streets: ${streets.slice(0, 5).join(", ")}`,
  );
  return streets;
}

module.exports = { extractStreetNames };
