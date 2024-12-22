import * as fs from 'fs'; // 引入Node.js的文件系统模块
import * as path from 'path'; // 用于处理文件路径
import * as XLSX from 'xlsx'; // 引入SheetJS
import { read } from '../src/index'; // 我们编写的函数

describe('parse', () => {
  test('读取excel文件并确保与SheetJS输出一致', async () => {
    // 读取本地文件
    const filePath = path.resolve(__dirname, './data.xlsx'); // 本地Excel文件的路径
    const fileBuffer = fs.readFileSync(filePath); // 使用fs.readFileSync读取文件内容为Buffer

    // 使用SheetJS读取Excel文件并转为JSON
    const sheetjsWorkbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetjsData = XLSX.utils.sheet_to_json(sheetjsWorkbook.Sheets[sheetjsWorkbook.SheetNames[0]], {
      header: 1,
      defval: '', // 避免undefined填充
    });
    console.log(sheetjsData)
    // 使用我们的read函数读取同一个文件
    const namespaceURI = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'; // Excel文件的默认namespace
    const ourData = await read(fileBuffer, namespaceURI);

    // 比较SheetJS和我们函数的输出
    expect(ourData).toEqual(sheetjsData);
  });
});
