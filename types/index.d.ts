export interface WorksheetData {
    [cellRef: string]: string;
}
export interface SharedStrings {
    [index: number]: string;
}
import { parseSharedStrings, parseWorksheet } from "./xmlParser";
import { convertTo2DArray } from "./dataConverter";
declare function parseXlsx(sheet1Xml: string, sharedStringsXml?: string | null, namespaceURI?: string): string[][];
declare function read(file: Blob | ArrayBuffer, namespaceURI: string): Promise<string[][]>;
export { read, parseXlsx, parseSharedStrings, parseWorksheet, convertTo2DArray, };
