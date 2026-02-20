export interface IObjectStorageService {
  upload(key: string, data: Buffer): Promise<void>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}