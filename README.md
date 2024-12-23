# **Excel 文件解析工具**

本工具库提供了多种函数，能够帮助你解析 Excel 文件（.xlsx）中的内容，并将其转换为更易于操作的数据格式。工具的核心功能包括从 .xlsx 文件中提取工作表数据、解析共享字符串、将数据转换为二维数组格式等。

## 1. 安装和配置

首先，确保你已经安装了该工具库。如果是通过 npm 安装，请使用以下命令：

```bash
npm install @turtlegi/parse-excel
```

## 2. 主要功能概述

工具主要功能为解析 .xlsx 文件中的数据。

## 3. 功能详解

### 3.1 `parseSharedStrings`

**功能**：解析 Excel 工作簿中的共享字符串 XML 文件，返回一个包含所有共享字符串的数组。

**参数**：
- `xml` (string)：共享字符串的 XML 数据。
- `namespaceURI` (string)：XML 文件的命名空间 URI，通常为 `http://schemas.openxmlformats.org/spreadsheetml/2006/main`。

**返回值**：
返回一个字符串数组，每个字符串对应一个共享字符串。

**示例**：

```ts
import { parseSharedStrings } from '@turtlegi/parse-excel';

const sharedStringsXml = '<xml>...</xml>';  // 共享字符串的 XML 数据
const namespaceURI = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

const sharedStrings = parseSharedStrings(sharedStringsXml, namespaceURI);
console.log(sharedStrings);  // 输出：['Hello', 'World']
```

### 3.2 `parseWorksheet`

**功能**：解析一个 Excel 工作表 XML 文件，返回每一行的单元格数据。每个单元格的值被存储为一个键值对，其中键为单元格引用（如 "A1"），值为单元格的值。

**参数**：
- `xml` (string)：工作表的 XML 数据。
- `sharedStrings` (string[])：解析出的共享字符串数组（如果有）。
- `namespaceURI` (string)：XML 文件的命名空间 URI。

**返回值**：
返回一个包含每一行数据的数组，每一行是一个对象，其中包含单元格引用作为键，单元格的值作为值。

**示例**：

```ts
import { parseWorksheet } from '@turtlegi/parse-excel';

const worksheetXml = '<xml>...</xml>';  // 工作表的 XML 数据
const sharedStrings = ['Hello', 'World'];  // 共享字符串
const namespaceURI = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

const worksheetData = parseWorksheet(worksheetXml, sharedStrings, namespaceURI);
console.log(worksheetData);

// 输出：
// [
//   { A1: 'Hello', B1: 'World' },
//   { A2: 'Alice', B2: '30' },
//   { A3: 'Bob', B3: '25' }
// ]
// key: 字母代表Excel中的列，数字则代表行
// value: 对应单元格的内容 
```

### 3.3 `convertTo2DArray`

**功能**：将解析后的工作表数据转换为一个二维数组。这个函数确保每一行的列数一致，填充缺少的列数据为一个空字符串 `""`。

**参数**：
- `worksheetData` (Array<{[key: string]: any}>)：一个包含工作表数据的数组，数组中的每个元素表示一行数据（通常为对象形式，其中键是列引用，值是单元格的值）。

**返回值**：
一个二维数组，每个元素表示一行的数据。

**示例**：

```ts
import { convertTo2DArray } from '@turtlegi/parse-excel';

const worksheetData = [
  { A: 'Name', B: 'Age' },
  { A: 'Alice', B: 30 },
  { A: 'Bob' }
];

const twoDArray = convertTo2DArray(worksheetData);
console.log(twoDArray);

// 输出：
// [
//   ['Name', 'Age'],
//   ['Alice', 30],
//   ['Bob', '']
// ]
```

### 3.4 `extractFileFromZip`

**功能**：从一个 ZIP 文件中提取指定路径的文件内容。

**参数**：
- `zipDataFiles` (Object)：解压后的 ZIP 文件内容对象，通常是通过 JSZip 解压 .xlsx 文件得到的。
- `path` (string)：文件路径，例如 "xl/worksheets/sheet1.xml"。

**返回值**：
该文件的文本内容。

**示例**：

```ts
import { extractFileFromZip } from '@turtlegi/parse-excel';

const zipDataFiles = { 'xl/worksheets/sheet1.xml': { async: () => 'xml content' } };
const path = 'xl/worksheets/sheet1.xml';

extractFileFromZip(zipDataFiles, path).then((content) => {
  console.log(content);  // 输出：'xml content'
});
```

### 3.5 `checkFileExistInZip`

**功能**：检查指定路径的文件是否存在于 ZIP 文件中。

**参数**：
- `zipDataFiles` (Object)：解压后的 ZIP 文件内容对象。
- `path` (string)：文件路径。

**返回值**：
返回一个布尔值，表示文件是否存在。

**示例**：

```ts
import { checkFileExistInZip } from '@turtlegi/parse-excel';

const zipDataFiles = { 'xl/worksheets/sheet1.xml': { async: () => 'xml content' } };
const path = 'xl/worksheets/sheet1.xml';

const fileExists = checkFileExistInZip(zipDataFiles, path);
console.log(fileExists);  // 输出：true
```

## 4. 整体解析拆解

假设你有一个 Excel 文件 `data.xlsx`，你希望使用这些工具函数解析文件并获取其内容。以下是一个完整的解析流程：

```ts
import * as JSZip from 'jszip';
import { read } from '@turtlegi/parse-excel';

// 假设你已经加载了一个 Blob 或 ArrayBuffer 格式的文件
async function parseExcelFile(file: Blob | ArrayBuffer) {
  const zip = new JSZip();
  const zipData = await zip.loadAsync(file);
  const { files: zipDataFiles } = zipData;

  const sheet1Xml = await extractFileFromZip(zipDataFiles, 'xl/worksheets/sheet1.xml');
  const sharedStringsXml = await extractFileFromZip(zipDataFiles, 'xl/sharedStrings.xml');

  const sharedStrings = sharedStringsXml ? parseSharedStrings(sharedStringsXml, 'http://schemas.openxmlformats.org/spreadsheetml/2006/main') : [];
  const worksheetData = parseWorksheet(sheet1Xml, sharedStrings, 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');

  const twoDArray = convertTo2DArray(worksheetData);
  console.log(twoDArray);  // 输出二维数组，格式化后的工作表数据
}
```

## 5. 调用示例

```ts
import { read } from '@turtlegi/parse-excel';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve(__dirname, './data.xlsx');  // 本地 Excel 文件的路径
const fileBuffer = fs.readFileSync(filePath);  // 使用 fs.readFileSync 读取文件内容为 Buffer
const namespaceURI = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';  // Excel 文件的默认 namespace

// 使用我们的 read 函数读取同一个文件
const ourData = await read(fileBuffer, namespaceURI);
console.log(ourData);
```