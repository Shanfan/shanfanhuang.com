// @ts-nocheck
import Papa from 'papaparse';

/**
 * Fetch and parse a CSV or JSON file.
 * @param {string} filePath - The relative file path from the `/static/` directory.
 * @param {Function} fetchFn - The fetch function to use (server-side `event.fetch` or global `fetch`).
 * @returns {Promise<Array|Object>} - Parsed data as an array (CSV) or object (JSON).
 */

export async function fetchDataset(filePath, fetchFn = fetch) {
    try {
        // Ensure filePath is provided
        if (!filePath) throw new Error('Missing file path');

        // Use event.fetch if available (for server-side requests)
        const response = await fetchFn(`${filePath}`);
        if (!response.ok) {
            throw new Error(`Failed to load file: ${filePath}`);
        }

        const fileExt = filePath.split('.').pop().toLowerCase();
        const fileContent = await response.text();

        if (fileExt === 'json') {
            return JSON.parse(fileContent);
        } else if (fileExt === 'csv') {
            const parsedData = Papa.parse(fileContent, {
                header: true, // Uses first row as column names
                skipEmptyLines: true,
                dynamicTyping: true, // Convert numbers automatically
            });
            return parsedData.data;
        } else {
            throw new Error(`Unsupported file type: ${fileExt}`);
        }
    } catch (error) {
        console.error(`Error loading dataset: ${error.message}`);
        return []; // Return an empty array to avoid breaking the UI
    }
}
