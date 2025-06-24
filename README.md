# Tree Property Analyzer

A Node.js application that analyzes property prices in Dublin based on tree height categories, computing average sale prices for properties on streets with tall and short trees using provided datasets.

## Overview

The program processes two datasets:

- `dublin-trees.json`: Lists street names categorized as short or tall based on median tree height.
- `dublin-property.csv`: Contains property addresses, street names, and sale prices in euros.

It outputs:

- Average property price on streets with tall trees : €XXXXXXX. (X replaces actual number)
- Average property price on streets with short trees. €XXXXXXX. (X replaces actual number)

The code is designed to be production-ready, with clear naming, structured logic, minimal dependencies, and appropriate error handling for library reuse. Console logging is used for debugging, with no file logging.

## Prerequisites

- **Node.js**: Version 14.x or higher.
- **npm**: Included with Node.js.

## Installation

1.  **Clone or Unzip the Project**:

    - If using a zip file, extract it to your desired directory.
    - If cloning, run:

    ```bash
    git clone https://github.com/Anandhu09/tree-property-analyser.git
    ```

2.  **Install Dependencies**: Navigate to the project directory in your terminal and run:

    ```bash
    npm install
    ```

    This command installs all required dependencies (`csv-parse`, `node-fetch`, `winston`, `winston-transport`) and development dependencies (`cross-env`, `eslint-plugin-jsdoc`, `jest`, `nodemon`, `prettier`).

## Usage

### Running the Program

To compute and display average property prices:

```bash
npm start
```

## Expected Output

```
Average price on streets with tall trees: €587800.39
Average price on streets with short trees: €487992.39
```

  - The program requires no user input and runs autonomously.
  - The codebase is production-ready, featuring:
    - Clear, modular design with minimal dependencies.
    - Robust error handling for library reuse.
    - Console-only logging using winston for debugging.
    - Comprehensive unit tests with Jest.
    - Code formatting with Prettier.

## Development Mode

For development with auto-restart on file changes:

```Bash
npm run dev
```

This command uses nodemon to monitor file changes and restart the application automatically.

## Testing

To run unit tests and generate a coverage report:

```Bash
npm test
```

- Tests are located in tests/unit/\*.test.js.
- Coverage excludes src/utils/logger.js (configured in jest.config.js).
- Console logs may appear during tests for debugging purposes.
- Expected Result: All tests pass with ~100% coverage for non-logger files.

## Format Code

To format code consistently using Prettier:

```Bash
npm run format
```

- Prettier: Ensures consistent code style across src/ and tests/ directories.
- ESLint: Enforces coding standards, including JSDoc documentation via eslint-plugin-jsdoc.

## Project Structure

```
.
├── src/
│ ├── index.js                     # Main entry point, orchestrates analysis
│ ├── data/
│ │ ├── fetchTreeData.js           # Fetches dublin-trees.json from URL
│ │ └── parsePropertyData.js       # Parses dublin-property.csv
│ ├── services/
│ │ └── priceCalculator.js         # Computes average prices
│ └── utils/
│ ├── logger.js                    # Configures console logging
│ ├── parsePrice.js                # Parses sale prices from strings
│ └── streetExtractor.js           # Extracts street names from tree data
├── data/
│ ├── dublin-trees.json            # Input dataset: tree height categories
│ └── dublin-property.csv          # Input dataset: property sales data
├── tests/
│ └── unit/\*.test.js              # Unit tests
├── jest.config.js                 # Jest test runner configuration
├── .prettierrc                    # Prettier configuration
├── package.json                   # Project metadata and dependencies
└── README.md                      # This is the README file
```

## Dependencies

- **Production**:

  - **_csv-parse_**: Parses CSV files for property data.
  - **_node-fetch_**: Fetches JSON data from URLs.
  - **_winston_**: Configures console-based logging.
  - **winston-transport** (^4.7.1): Extends logging capabilities.

- **Development**:

  - **_cross-env_** (^7.0.3): Sets environment variables across platforms.
  - **_eslint-plugin-jsdoc_**: Enforces JSDoc comment standards.
  - **_jest_**: Unit testing framework.
  - **_nodemon_**: Auto-restarts server during development.
  - **_prettier_**: Code formatting.

## Notes

- **_Logging_**: Uses winston for console-only logging; no file-based logs are generated.
- **_Datasets_**: dublin-trees.json and dublin-property.csv are provided and must not be modified to ensure consistent street name matching.
- **_Error Handling_**: Modules include descriptive error messages, making the codebase suitable for library reuse.
- **_JSDoc_**: All public functions are documented for clarity and IDE support.
- **_Environment_**: No specific environment variables (e.g., NODE_ENV) are required beyond those set in package.json scripts.

## Author

**Anandhu Vikraman**  
_Software developer & Cybersecurity Specialist_
- Email: anandhu.vikraman007@gmail.com
- GitHub: [github.com/anandhu-vikraman](https://github.com/Anandhu09)
- LinkedIn: [linkedin.com/in/anandhu-vikraman](https://www.linkedin.com/in/anandhu-v-96211a23b/)
- Mobile/Whatsapp : +353 892492348  

For inquiries, please contact the author via email or GitHub.
