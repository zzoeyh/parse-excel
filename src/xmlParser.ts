import { DOMParser } from "xmldom";

/**
 * Parses the shared strings XML and returns an array of strings.
 * 
 * @param xml - The XML string to parse.
 * @param namespaceURI - The XML namespace URI.
 * @returns An array of parsed strings.
 * @throws If no <si> elements are found.
 */
export function parseSharedStrings(xml: string, namespaceURI: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const siElements = doc.getElementsByTagNameNS(namespaceURI, "si");

  if (siElements.length === 0) {
    throw new Error("No <si> elements found in sharedStringsXml");
  }

  const strings: string[] = [];
  for (let i = 0; i < siElements.length; i++) {
    const si = siElements[i];
    let textContent = "";
    const tElements = si.getElementsByTagNameNS(namespaceURI, "t");
    for (let j = 0; j < tElements.length; j++) {
      const t = tElements[j];
      textContent += t.textContent;
    }
    strings.push(textContent);
  }

  return strings;
}

/**
 * Parses a worksheet XML and returns an array of row data, where each row is represented as an object.
 * 
 * @param xml - The XML string to parse.
 * @param sharedStrings - An array of shared strings.
 * @param namespaceURI - The XML namespace URI.
 * @returns An array of row data objects.
 */
export function parseWorksheet(
    xml: string,
    sharedStrings: string[],
    namespaceURI: string
  ): { [cellRef: string]: string | number }[] { // 修改为支持数字类型
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const rowElements = doc.getElementsByTagNameNS(namespaceURI, "row");
    const data: { [cellRef: string]: string | number }[] = [];
  
    for (let i = 0; i < rowElements.length; i++) {
      const row = rowElements[i];
      const rowData: { [cellRef: string]: string | number } = {};
      const cellElements = row.getElementsByTagNameNS(namespaceURI, "c");
  
      for (let j = 0; j < cellElements.length; j++) {
        const cell = cellElements[j];
        const cellRef = cell.getAttribute("r");
        const valueElement = cell.getElementsByTagNameNS(namespaceURI, "v")[0];
        let cellValue = valueElement ? valueElement.textContent : "";
  
        // 处理共享字符串
        if (cell.getAttribute("t") === "s") {
          cellValue = sharedStrings[parseInt(cellValue, 10)];
        } else {
          // 尝试将值转换为数字，如果不能，则保持为字符串
          const numericValue = parseFloat(cellValue);
          if (!isNaN(numericValue)) {
            cellValue = numericValue; // 如果是数字，则保持为数字
          }
        }
  
        rowData[cellRef] = cellValue;
      }
  
      data.push(rowData);
    }
  
    return data;
  }
  
/**
 * Parses an XML file and returns its data as an array of rows, where each row is an array of cell values.
 * 
 * @param xml - The XML string to parse.
 * @returns A 2D array representing the row and cell values.
 */
export function parseXmlFile(xml: string): string[][] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "application/xml");
  const rows = xmlDoc.getElementsByTagName("row");
  const data: string[][] = [];

  // Iterate over each row and extract cell data
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("c");
    const rowData: string[] = [];
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      const valueElement = cell.getElementsByTagName("v")[0];
      const value = valueElement ? valueElement.textContent : "";
      rowData.push(value);
    }
    data.push(rowData);
  }

  return data;
}