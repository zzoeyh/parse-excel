export interface WorksheetData {
  [cellRef: string]: string;
}

export interface SharedStrings {
  [index: number]: string;
}

import JSZip from "jszip";

import {
  parseSharedStrings,
  parseWorksheet,
  parseXmlFile,
} from "./xmlParser";
import { convertTo2DArray } from "./dataConverter";
import { extractFileFromZip, checkFileExistInZip } from "./fileReader";

function parseXlsx(
  sheet1Xml: string,
  sharedStringsXml: string | null = '',
  namespaceURI: string = ''
): string[][] {
  if (!sharedStringsXml) return parseXmlFile(sheet1Xml);
  const sharedStrings = parseSharedStrings(sharedStringsXml, namespaceURI);
  const worksheetData = parseWorksheet(sheet1Xml, sharedStrings, namespaceURI);
  console.log(worksheetData)
  const data = convertTo2DArray(worksheetData);
  return data;
}

async function read(
  file: Blob | ArrayBuffer,
  namespaceURI: string
): Promise<string[][]> {
  let zip = new JSZip();
  const zipData = await zip.loadAsync(file);
  const { files: zipDataFiles } = zipData;
  const isHasSharedStrings = checkFileExistInZip(
    zipDataFiles,
    "xl/sharedStrings.xml"
  );
  const sheet1Xml = await extractFileFromZip(
    zipDataFiles,
    "xl/worksheets/sheet1.xml"
  );

  const sharedStringsXml = isHasSharedStrings
    ? await extractFileFromZip(zipDataFiles, "xl/sharedStrings.xml")
    : null;

  return parseXlsx(sheet1Xml, sharedStringsXml, namespaceURI);
}

export {
  read,
  parseXlsx,
  parseSharedStrings,
  parseWorksheet,
  convertTo2DArray,
};
