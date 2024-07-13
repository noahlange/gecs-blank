export class Logger {
  protected current: string | null = null;
  protected queue: [number, unknown[]][] = [];

  public log(plugin: string, ...args: unknown[]): void {
    if (this.current !== plugin) {
      console.groupEnd();
      console.group(`[${plugin}]`);
      this.current = plugin;
    }
    console.log(...args);
  }
}
