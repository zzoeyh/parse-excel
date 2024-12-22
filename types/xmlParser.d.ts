/**
 * Parses the shared strings XML and returns an array of strings.
 *
 * @param xml - The XML string to parse.
 * @param namespaceURI - The XML namespace URI.
 * @returns An array of parsed strings.
 * @throws If no <si> elements are found.
 */
export declare function parseSharedStrings(xml: string, namespaceURI: string): string[];
/**
 * Parses a worksheet XML and returns an array of row data, where each row is represented as an object.
 *
 * @param xml - The XML string to parse.
 * @param sharedStrings - An array of shared strings.
 * @param namespaceURI - The XML namespace URI.
 * @returns An array of row data objects.
 */
export declare function parseWorksheet(xml: string, sharedStrings: string[], namespaceURI: string): {
    [cellRef: string]: string | number;
}[];
/**
 * Parses an XML file and returns its data as an array of rows, where each row is an array of cell values.
 *
 * @param xml - The XML string to parse.
 * @returns A 2D array representing the row and cell values.
 */
export declare function parseXmlFile(xml: string): string[][];
