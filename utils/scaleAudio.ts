// Audio utility for scale sounds
export class ScaleAudioGenerator {
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

  // Convert note names to frequencies
  private noteToFrequency(note: string, octave: number = 4): number {
    const noteFrequencies: { [key: string]: number } = {
      'C': 261.63,
      'C#': 277.18, 'Db': 277.18,
      'D': 293.66,
      'D#': 311.13, 'Eb': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99, 'Gb': 369.99,
      'G': 392.00,
      'G#': 415.30, 'Ab': 415.30,
      'A': 440.00,
      'A#': 466.16, 'Bb': 466.16,
      'B': 493.88
    };

    const baseFreq = noteFrequencies[note];
    if (!baseFreq) return 440; // Default to A4

    // Adjust for octave (each octave doubles the frequency)
    return baseFreq * Math.pow(2, octave - 4);
  }

  private createScaleTone(frequency: number, startTime: number, duration: number): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      // Use a sine wave for cleaner scale tones
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // Smooth envelope for scale notes
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gainNode.gain.setValueAtTime(0.2, startTime + duration - 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      // Light filtering for warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, startTime);
      filter.Q.setValueAtTime(0.5, startTime);

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    } catch (error) {
      console.error('Error creating scale tone:', error);
    }
  }

  async playScale(notes: string[], scaleName: string, ascending: boolean = true): Promise<void> {
    if (!this.isAudioSupported) {
      throw new Error('Audio playback is not supported in this environment. Please try using a modern web browser.');
    }

    if (this.isPlaying) return;

    try {
      this.isPlaying = true;
      const audioContext = await this.initializeAudioContext();
      const currentTime = audioContext.currentTime;
      const noteDuration = 0.4; // Duration of each note
      const noteGap = 0.05; // Small gap between notes

      const playOrder = ascending ? notes : [...notes].reverse();
      
      playOrder.forEach((note, index) => {
        const frequency = this.noteToFrequency(note, 4);
        const startTime = currentTime + (index * (noteDuration + noteGap));
        this.createScaleTone(frequency, startTime, noteDuration);
      });

      // If ascending, also play descending
      if (ascending) {
        const descendingNotes = [...notes].reverse();
        descendingNotes.forEach((note, index) => {
          const frequency = this.noteToFrequency(note, 4);
          const startTime = currentTime + ((notes.length + index) * (noteDuration + noteGap));
          this.createScaleTone(frequency, startTime, noteDuration);
        });
      }

      // Reset playing state
      const totalDuration = (ascending ? notes.length * 2 : notes.length) * (noteDuration + noteGap);
      setTimeout(() => {
        this.isPlaying = false;
      }, totalDuration * 1000);

    } catch (error) {
      console.error('Error playing scale:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  async playArpeggio(notes: string[], scaleName: string): Promise<void> {
    if (!this.isAudioSupported) {
      throw new Error('Audio playback is not supported in this environment. Please try using a modern web browser.');
    }

    if (this.isPlaying) return;

    try {
      this.isPlaying = true;
      const audioContext = await this.initializeAudioContext();
      const currentTime = audioContext.currentTime;
      const noteDuration = 0.6; // Longer duration for arpeggio
      const noteGap = 0.1;

      // Play notes with some overlap for arpeggio effect
      notes.forEach((note, index) => {
        const frequency = this.noteToFrequency(note, 4);
        const startTime = currentTime + (index * (noteDuration * 0.3));
        this.createScaleTone(frequency, startTime, noteDuration);
      });

      const totalDuration = notes.length * (noteDuration * 0.3) + noteDuration;
      setTimeout(() => {
        this.isPlaying = false;
      }, totalDuration * 1000);

    } catch (error) {
      console.error('Error playing arpeggio:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
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

export const scaleAudio = new ScaleAudioGenerator();