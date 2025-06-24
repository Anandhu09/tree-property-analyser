/**
 * Parses a price string into a number.
 * @param {string} priceStr - The price string (e.g., '€ 3,08,370.00').
 * @returns {number} The parsed price.
 */
function parsePrice(priceStr) {
  return Number(
    priceStr
      .replace(/[€\uFFFD]/g, "")
      .replace(/,/g, "")
      .trim(),
  );
}

module.exports = { parsePrice };
