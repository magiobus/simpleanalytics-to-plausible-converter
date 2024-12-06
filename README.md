# Simple Analytics to Plausible Analytics Converter

This script converts Simple Analytics CSV export to Plausible Analytics import format.

## Prerequisites

- Node.js installed
- CSV export from Simple Analytics with all fields selected
- npm or yarn package manager

## Installation

1. Clone this repository
2. Install dependencies:

## Usage

1. Export your data from Simple Analytics:

   - Go to your Simple Analytics dashboard
   - Click on Export
   - **Important**: Select ALL checkboxes to include all data fields
   - Download the CSV file

2. Configure the script:

   - Open `convert-to-plausible.js`
   - Update the constants at the top of the file:

   ```javascript
   // Format: YYYYMMDD_YYYYMMDD (start_date_end_date)
   const DATE_RANGE = "20230101_20231231"; // Example: Jan 1, 2023 to Dec 31, 2023
   const INPUT_FILE = "your-analytics-export.csv"; // Your Simple Analytics export file
   ```

3. Run the script:

4. The script will generate six files:

   - `imported_visitors_${DATE_RANGE}.csv`
   - `imported_pages_${DATE_RANGE}.csv`
   - `imported_browsers_${DATE_RANGE}.csv`
   - `imported_devices_${DATE_RANGE}.csv`
   - `imported_entry_pages_${DATE_RANGE}.csv`
   - `imported_operating_systems_${DATE_RANGE}.csv`

5. Create a ZIP file containing all generated CSV files

6. Import to Plausible:
   - Go to your Plausible Analytics dashboard
   - Go to Settings > Data Import
   - Select "Import from Google Analytics"
   - Upload your ZIP file containing all the CSV files

## Important Notes

1. **Date Range Format**:

   - Use YYYYMMDD format for dates in DATE_RANGE
   - Example: "20230101_20231231" for Jan 1, 2023 to Dec 31, 2023

2. **Simple Analytics Export**:

   - Must include ALL fields (check all boxes in export options)
   - Required fields include: added_date, browser_name, device_type, path, etc.

3. **ZIP File for Import**:
   - Include all six generated CSV files in the ZIP
   - Don't modify the generated file names
   - All files must be in the root of the ZIP (no folders)

## Troubleshooting

If you encounter issues:

1. Verify your Simple Analytics export includes all fields
2. Check the DATE_RANGE format is correct (YYYYMMDD_YYYYMMDD)
3. Ensure the input CSV file name matches INPUT_FILE constant
4. Verify all generated files are included in the ZIP
5. Make sure the ZIP file doesn't contain folders

## License

MIT
