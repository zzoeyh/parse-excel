export declare function extractFileFromZip(zipDataFiles: any, path: any): Promise<any>;
export declare function extractFilesFromZip(file: Blob | ArrayBuffer, filePaths: string[]): Promise<{
    [key: string]: string | null;
}>;
export declare function checkFileExistInZip(zipDataFiles: any, path: any): boolean;
export declare function checkFilesExistInZip(file: any, filePaths: any): Promise<{}>;
