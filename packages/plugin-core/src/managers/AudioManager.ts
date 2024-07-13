import type { Identifier } from '@gecs/types';
import type { Audio, Position } from '@gecs/plugin-core';
import type { EntityType } from 'gecs';

import { Manager } from '@gecs/lib';
import { AudioStatus } from '@gecs/types';
import { _ } from '@gecs/utils';

export interface AudioSource {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

type AudioEntity = EntityType<[typeof Audio], [typeof Position]>;

export class AudioManager extends Manager {
  /** Minimum volume threshold below which stop playing. */
  public static MIN_VOLUME_THRESHOLD = 0.025;
  /** Maximum volume ceiling. */
  public static MAX_VOLUME = 5;

  protected nodes: Map<AudioEntity, AudioSource> = new Map();
  protected abort: Record<Identifier, AbortController> = {};
  protected status: Record<Identifier, AudioStatus> = {};
  protected context: AudioContext = new AudioContext();

  public tick(entity: AudioEntity, volume: number): void {
    const audio = entity.$.audio;
    const status = this.status[entity.id];

    if (entity.id in this.status) {
      // we've encountered this before
      const nodes = this.nodes.get(entity);
      if (nodes) {
        if (audio.isPlaying) {
          switch (status) {
            case AudioStatus.LOADING: {
              // still loading, whomp whomp
              return;
            }
            case AudioStatus.PLAYING: {
              // update volume, loopiness
              nodes.source.loop = audio.loop;
              nodes.gain.gain.value = this.clampVolume(volume);
              return;
            }
            case AudioStatus.PAUSED:
            case AudioStatus.LOADED: {
              this.status[entity.id] = AudioStatus.PLAYING;
              const source = this.context.createBufferSource();
              source.buffer = nodes.source.buffer;
              nodes.source.disconnect();
              nodes.source = source;
              nodes.source.connect(nodes.gain).connect(this.context.destination);
              nodes.source.start(0, Math.round(audio.time ?? 0) / 1000);
              return;
            }
          }
        } else {
          // audio should be but is not paused
          if (audio.isPaused && status !== AudioStatus.PAUSED) {
            this.status[entity.id] = AudioStatus.PAUSED;
            nodes.source.stop();
            return;
          }
          // audio should be but isn't stopped
          if (audio.isStopped && status !== AudioStatus.STOPPED) {
            this.status[entity.id] = AudioStatus.STOPPED;
            // reset time to start
            audio.time = 0;
            nodes.source.stop();
            nodes.source.disconnect();
            nodes.gain.disconnect();
            return;
          }
        }
      }
    } else {
      if (status !== AudioStatus.LOADING) {
        this.status[entity.id] = AudioStatus.NONE;
        // audio is brand-new; load it
        this.load(entity);
      }
    }
  }

  public clear(): void {
    for (const [entity, source] of this.nodes) {
      if (entity.tags.has($.Tag.TO_DESTROY)) {
        if (entity.id in this.abort) {
          this.abort[entity.id]?.abort();
        } else if (source) {
          source.source.disconnect();
          source.gain.disconnect();
        }
        delete this.abort[entity.id];
        delete this.status[entity.id];
        this.nodes.delete(entity);
      }
    }
  }

  protected clampVolume(value: number): number {
    const v = value * this.ctx.$.core.config.volume;
    return _.clamp(v, 0, AudioManager.MAX_VOLUME);
  }

  protected async load(entity: AudioEntity): Promise<void> {
    this.status[entity.id] = AudioStatus.LOADING;
    const buffer = await this.fetchAudioBuffer(entity);
    if (buffer) {
      const source = this.context.createBufferSource();
      const gain = this.context.createGain();
      source.buffer = buffer;
      source.connect(gain).connect(this.context.destination);
      this.nodes.set(entity, { source, gain });
      this.status[entity.id] = AudioStatus.LOADED;
    } else {
      this.status[entity.id] = AudioStatus.FAILED;
    }
  }

  protected async fetchAudioBuffer(entity: AudioEntity): Promise<AudioBuffer | null> {
    try {
      const cancel = (this.abort[entity.id] = new AbortController());
      const res = await fetch(entity.$.audio.path!, { signal: cancel.signal });
      const buffer = await res.arrayBuffer();
      delete this.abort[entity.id];
      return this.context.decodeAudioData(buffer);
    } catch (e) {
      return null;
    }
  }
}
