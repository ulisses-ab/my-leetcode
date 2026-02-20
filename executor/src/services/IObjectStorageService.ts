export interface IObjectStorageService {
  download(key: string): Promise<Buffer>;
}