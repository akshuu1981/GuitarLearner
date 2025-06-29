// Audio utility for strumming pattern sounds
export class StrummingAudioGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private isAudioSupported = false;
  private currentPattern: any = null;
  private intervalId: NodeJS.Timeout | null = null;

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
      if (!this.checkAudioSupport()) {
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

  // Guitar string frequencies for open chord (Em for strumming practice)
  private getOpenChordFrequencies(): number[] {
    return [
      82.41,  // Low E
      110.00, // A
      146.83, // D
      196.00, // G
      246.94, // B
      329.63  // High E
    ];
  }

  private createStrumSound(isDownstroke: boolean, startTime: number): void {
    if (!this.audioContext) return;

    try {
      const frequencies = this.getOpenChordFrequencies();
      const strumDuration = 0.15;
      const stringDelay = isDownstroke ? 0.01 : -0.01; // Reverse for upstroke

      frequencies.forEach((frequency, index) => {
        const stringStartTime = startTime + (index * Math.abs(stringDelay));
        
        // Create oscillator
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        const filter = this.audioContext!.createBiquadFilter();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, stringStartTime);

        // Different envelope for up vs down strokes
        const volume = isDownstroke ? 0.15 : 0.1;
        gainNode.gain.setValueAtTime(0, stringStartTime);
        gainNode.gain.linearRampToValueAtTime(volume, stringStartTime + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, stringStartTime + strumDuration);

        // Filter for guitar-like tone
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isDownstroke ? 2500 : 2000, stringStartTime);
        filter.Q.setValueAtTime(1.5, stringStartTime);

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.start(stringStartTime);
        oscillator.stop(stringStartTime + strumDuration);
      });
    } catch (error) {
      console.error('Error creating strum sound:', error);
    }
  }

  async playStrummingPattern(pattern: string[], tempo: number, patternName: string): Promise<void> {
    if (!this.isAudioSupported) {
      throw new Error('Audio playback is not supported in this environment. Please try using a modern web browser.');
    }

    if (this.isPlaying) {
      this.stopPattern();
      return;
    }

    try {
      this.isPlaying = true;
      this.currentPattern = { pattern, tempo, patternName };
      
      const audioContext = await this.initializeAudioContext();
      const beatDuration = 60 / tempo; // Duration of one beat in seconds
      let beatIndex = 0;

      const playBeat = () => {
        if (!this.isPlaying) return;

        const currentTime = audioContext.currentTime;
        const stroke = pattern[beatIndex % pattern.length];

        if (stroke === 'D') {
          this.createStrumSound(true, currentTime);
        } else if (stroke === 'U') {
          this.createStrumSound(false, currentTime);
        }
        // Rest beats ('') don't play any sound

        beatIndex++;
      };

      // Start immediately
      playBeat();

      // Set up interval for subsequent beats
      this.intervalId = setInterval(playBeat, beatDuration * 1000);

    } catch (error) {
      console.error('Error playing strumming pattern:', error);
      this.isPlaying = false;
      this.currentPattern = null;
      throw error;
    }
  }

  stopPattern(): void {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentPattern = null;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentPattern(): any {
    return this.currentPattern;
  }

  isAudioAvailable(): boolean {
    return this.isAudioSupported;
  }

  dispose(): void {
    this.stopPattern();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const strummingAudio = new StrummingAudioGenerator();