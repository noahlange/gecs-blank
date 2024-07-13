import { AudioStatus } from '@gecs/types';

export class Audio {
  public static readonly type = 'audio';

  public path: string | null = null;

  /**
   * Volume at epicenter.
   */
  public volume: number = 1;

  /**
   * Decay multiplier.
   */
  public decay: number = 0.25;
  public loop: boolean = false;
  public autoplay: boolean = true;
  public time: number = 0;

  private status: AudioStatus = AudioStatus.NONE;

  public get isPaused(): boolean {
    return this.status === AudioStatus.PAUSED;
  }

  public get isPlaying(): boolean {
    return this.status === AudioStatus.PLAYING;
  }

  public get isStopped(): boolean {
    return this.status === AudioStatus.PLAYING;
  }

  public play(): void {
    this.status = AudioStatus.PLAYING;
  }

  public pause(): void {
    this.status = AudioStatus.PAUSED;
  }

  public stop(): void {
    this.status = AudioStatus.STOPPED;
  }
}
