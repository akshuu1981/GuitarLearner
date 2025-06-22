// Audio utility for metronome sounds
export class MetronomeAudioGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;

  constructor() {
    this.initializeAudioContext = this.initializeAudioContext.bind(this);
  }

  private async initializeAudioContext() {
    try {
      if (!this.audioContext) {
        // Check if AudioContext is available
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error('Web Audio API not supported in this browser');
        }
        
        this.audioContext = new AudioContextClass();
        
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      }
      return this.audioContext;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw new Error('Audio initialization failed. Please check your browser settings.');
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

  dispose(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isPlaying = false;
  }
}

export const metronomeAudio = new MetronomeAudioGenerator();