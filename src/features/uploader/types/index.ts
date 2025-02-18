export interface UploadedFile {
  url: string;
  name: string;
  key: string;
  size: number;
}

export interface FileWithPreview extends File {
  preview?: string;
}

export interface UploadServiceResponse {
  url: string;
  name: string;
  size: number;
  type: string;
}
