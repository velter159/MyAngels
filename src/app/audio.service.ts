import { Service, signal, effect } from '@angular/core';

@Service()
export class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmIntervalId: any = null;
  private isBgmPlaying = false;
  
  // Track mute state reactively
  readonly isMuted = signal(false);

  constructor() {
    // React to mute signal changes
    effect(() => {
      const muted = this.isMuted();
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx?.currentTime || 0);
      }
    });
  }

  private initAudio() {
    if (this.ctx) return;
    
    // Create AudioContext on demand (due to browser policy)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted() ? 0 : 1, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggleMute() {
    this.isMuted.update(m => !m);
    this.playBlip();
  }

  playCoin() {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;
    
    const now = this.ctx.currentTime;
    
    // Coin chime: short mid tone, then a longer high tone
    this.synthTone(523.25, 0.08, now, 'sine'); // C5
    this.synthTone(659.25, 0.25, now + 0.08, 'sine'); // E5
  }

  playBlip() {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;
    
    const now = this.ctx.currentTime;
    // Short retro blip
    this.synthTone(880, 0.05, now, 'triangle'); // A5
  }

  playSelect() {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // Cute success chime
    this.synthTone(587.33, 0.06, now, 'triangle'); // D5
    this.synthTone(659.25, 0.06, now + 0.06, 'triangle'); // E5
    this.synthTone(783.99, 0.15, now + 0.12, 'triangle'); // G5
  }

  startBgm() {
    this.initAudio();
    if (!this.ctx || !this.masterGain || this.isBgmPlaying) return;
    
    // Ensure context is running (can be suspended by browser)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isBgmPlaying = true;
    let step = 0;
    
    // Simple retro kawaii melody loop
    // Notes of a cute happy tune in F major / C major pentatonic
    const melody = [
      523.25, 587.33, 659.25, 783.99, // C5, D5, E5, G5
      659.25, 783.99, 880.00, 1046.50, // E5, G5, A5, C6
      880.00, 783.99, 659.25, 587.33, // A5, G5, E5, D5
      659.25, 523.25, 587.33, 392.00  // E5, C5, D5, G4
    ];
    
    const noteDuration = 0.3; // 300ms per beat
    
    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const freq = melody[step % melody.length];
      const now = this.ctx.currentTime;
      // Soft triangle note for gentle background BGM
      this.synthTone(freq, noteDuration * 0.9, now, 'triangle', 0.03);
      step++;
    };
    
    // Play immediately, then interval
    playNextNote();
    this.bgmIntervalId = setInterval(playNextNote, noteDuration * 1000);
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  private synthTone(
    freq: number, 
    duration: number, 
    startTime: number, 
    type: OscillatorType = 'triangle',
    volume = 0.1
  ) {
    if (!this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    // Fade out to prevent clicks
    gainNode.gain.setValueAtTime(volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}
