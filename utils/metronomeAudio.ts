// Audio utility for metronome sounds
export class MetronomeAudioGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private isAudioSupported = false;

  constructor() {
    this.checkAudioSupport();
    this.initializeAudioContext = this.initializeAudioContext.bind(this);
  }

  private checkAudioSupport(): boolean {
    try {
      if (typeof window === 'undefined') {
        this.isAudioSupported = false;
        return false;
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.isAudioSupported = !!AudioContextClass;
      return this.isAudioSupported;
    } catch (error) {
      this.isAudioSupported = false;
      return false;
    }
  }

  private async initializeAudioContext() {
    try {
      if (!this.checkAudioSupported()) {
        throw new Error('Web Audio API is not supported in this environment');
      }

      if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
        
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      }
      return this.audioContext;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw new Error('Audio is not available in this environment. This feature requires a modern web browser with Web Audio API support.');
    }
  }

  private createClickSound(isAccent: boolean, volume: number): void {
    if (!this.audioContext) return;

    try {
      const currentTime = this.audioContext.currentTime;
      const duration = 0.1;

      // Create oscillator for the click sound
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      // Different frequencies for accent and regular beats
      const frequency = isAccent ? 1000 : 800; // Higher pitch for accent beats
      oscillator.frequency.setValueAtTime(frequency, currentTime);
      oscillator.type = 'square';

      // Sharp attack and quick decay for crisp click
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * (isAccent ? 1.0 : 0.7), currentTime + 0.001);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      // High-pass filter for crisp sound
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(400, currentTime);
      filter.Q.setValueAtTime(1, currentTime);

      // Connect audio graph
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Start and stop
      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration);
    } catch (error) {
      console.error('Error creating click sound:', error);
    }
  }

  async playBeat(isAccent: boolean = false, volume: number = 0.7): Promise<void> {
    if (!this.isAudioSupported) {
      throw new Error('Audio playback is not supported in this environment. Please try using a modern web browser.');
    }

    try {
      await this.initializeAudioContext();
      this.createClickSound(isAccent, volume);
    } catch (error) {
      console.error('Error playing metronome beat:', error);
      throw error;
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  setPlaying(playing: boolean): void {
    this.isPlaying = playing;
  }

  isAudioAvailable(): boolean {
    return this.isAudioSupported;
  }

  dispose(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isPlaying = false;
  }
}

export const metronomeAudio = new MetronomeAudioGenerator();