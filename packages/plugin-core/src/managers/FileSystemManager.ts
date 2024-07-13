import { Manager } from '@gecs/lib';

export class FileSystemManager extends Manager {
  public async write(filename: string, value: string): Promise<void> {
    window.localStorage.setItem(filename, value);
  }
  public async read(filename: string): Promise<string> {
    return window.localStorage.getItem(filename) ?? '';
  }
  public async writeJSON(filename: string, value: object): Promise<void> {
    this.write(filename, JSON.stringify(value));
  }
  public async readJSON(filename: string): Promise<object> {
    const res = await this.read(filename);
    return res ? JSON.parse(res) : null;
  }
}
