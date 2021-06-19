export interface ExpressFileUploadFile {
  name: string;
  data: string;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimeType: string;
  md5: string;
  mv: (path: string, cb: (error: any) => void) => void;
}
