import JSZip from "jszip";
export async function extractFileFromZip(zipDataFiles, path) {
  if (zipDataFiles[path]) {
    return await zipDataFiles[path].async("text");
  }
  return null;
}

export async function extractFilesFromZip(
  file: Blob | ArrayBuffer,
  filePaths: string[]
): Promise<{ [key: string]: string | null }> {
  const zip = new JSZip();
  const zipData = await zip.loadAsync(file);

  const fileContents: { [key: string]: string | null } = {};

  for (const path of filePaths) {
    if (zipData.files[path]) {
      fileContents[path] = await zipData.files[path].async("text");
    } else {
      fileContents[path] = null;
    }
  }

  return fileContents;
}

export function checkFileExistInZip(zipDataFiles, path) {
  const isFileExist = Object.keys(zipDataFiles).includes(path);
  return isFileExist;
}
export async function checkFilesExistInZip(file, filePaths) {
  const zip = new JSZip();
  const zipData = await zip.loadAsync(file);

  const fileExistence = {};

  for (const path of filePaths) {
    fileExistence[path] = path in zipData.files;
  }

  return fileExistence;
}
