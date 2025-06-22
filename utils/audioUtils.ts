// Audio utility functions for generating guitar chord sounds
export class ChordAudioGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;

  constructor() {
    // Initialize AudioContext only when needed (user interaction required)
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
        
        // Resume context if it's suspended (required by browsers)
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

  // Guitar string frequencies in Hz (standard tuning)
  private getStringFrequency(stringNumber: number, fret: number): number {
    const openStringFrequencies = [
      82.41,  // Low E (6th string)
      110.00, // A (5th string)
      146.83, // D (4th string)
      196.00, // G (3rd string)
      246.94, // B (2nd string)
      329.63  // High E (1st string)
    ];

    const baseFreq = openStringFrequencies[stringNumber];
    // Each fret increases frequency by a semitone (2^(1/12))
    return baseFreq * Math.pow(2, fret / 12);
  }

  private createGuitarTone(frequency: number, startTime: number, duration: number): void {
    if (!this.audioContext) return;

    try {
      // Create oscillator for the fundamental frequency
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Use a sawtooth wave for a more guitar-like sound
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // Create envelope (attack, decay, sustain, release)
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.1, startTime + 0.1); // Decay
      gainNode.gain.setValueAtTime(0.1, startTime + duration - 0.2); // Sustain
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Release

      // Add some filtering for a more realistic sound
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, startTime);
      filter.Q.setValueAtTime(1, startTime);

      // Connect the audio graph
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Start and stop the oscillator
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    } catch (error) {
      console.error('Error creating guitar tone:', error);
    }
  }

  async playChord(chordFingers: number[], chordName: string): Promise<void> {
    if (this.isPlaying) return;
    
    try {
      this.isPlaying = true;
      const audioContext = await this.initializeAudioContext();
      const currentTime = audioContext.currentTime;
      const noteDuration = 2.0; // 2 seconds

      // Play each string that's not muted (finger position > -1)
      chordFingers.forEach((fret, stringIndex) => {
        if (fret >= 0) { // Only play strings that aren't muted
          const frequency = this.getStringFrequency(stringIndex, fret);
          // Stagger the start times slightly for a more natural strum effect
          const startTime = currentTime + (stringIndex * 0.02);
          this.createGuitarTone(frequency, startTime, noteDuration);
        }
      });

      // Reset playing state after the chord finishes
      setTimeout(() => {
        this.isPlaying = false;
      }, noteDuration * 1000);

    } catch (error) {
      console.error('Error playing chord:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Clean up resources
  dispose(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isPlaying = false;
  }
}

// Create a singleton instance
export const chordAudio = new ChordAudioGenerator();