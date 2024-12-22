export function convertTo2DArray(worksheetData) {
  let maxColumns = 0;
  for (const row of worksheetData) {
    const numberOfColumns = Object.keys(row).length; // 计算当前行的列数
    if (numberOfColumns > maxColumns) {
      maxColumns = numberOfColumns; // 更新最大列数
    }
  }

  return worksheetData.map((row) => {
    const values = Object.values(row); // 获取当前行的所有值
    while (values.length < maxColumns) {
      values.push(""); // 如果当前行列数少于最大列数，填充空字符串
    }
    return values; // 返回补全后的行数据
  });
}
