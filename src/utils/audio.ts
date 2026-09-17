// Web Audio API Procedural Sound Engine for GLAM RUNWAY

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private sfxMuted = false;
  private bgmMuted = false;
  private bpm = 120;

  constructor() {
    // Load preference from localStorage
    try {
      this.sfxMuted = localStorage.getItem('glam_sfx_muted') === 'true';
      this.bgmMuted = localStorage.getItem('glam_bgm_muted') === 'true';
    } catch {
      // default false
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmMuted ? 0 : 0.25;
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxMuted ? 0 : 0.4;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleBgm(): boolean {
    this.bgmMuted = !this.bgmMuted;
    try {
      localStorage.setItem('glam_bgm_muted', String(this.bgmMuted));
    } catch {}
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmMuted ? 0 : 0.25, this.ctx.currentTime);
    }
    if (!this.bgmMuted && !this.isBgmPlaying) {
      this.startRunwayBgm();
    }
    return !this.bgmMuted;
  }

  public toggleSfx(): boolean {
    this.sfxMuted = !this.sfxMuted;
    try {
      localStorage.setItem('glam_sfx_muted', String(this.sfxMuted));
    } catch {}
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : 0.4, this.ctx.currentTime);
    }
    return !this.sfxMuted;
  }

  public isBgmOn(): boolean {
    return !this.bgmMuted;
  }

  public isSfxOn(): boolean {
    return !this.sfxMuted;
  }

  public playClick() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playEquip() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.18, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.22);
    });
  }

  public playCamera() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // White noise shutter
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);

    // Whir motor
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now + 0.09);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
    oscGain.gain.setValueAtTime(0.15, now + 0.09);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now + 0.09);
    osc.stop(now + 0.26);
  }

  public playApplause() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Simulate crowd clapping with noise bursts
    const now = this.ctx.currentTime;
    const duration = 2.5;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      const clapPulse = Math.sin(i * 0.02) > 0.6 ? 1.5 : 0.5;
      data[i] = (Math.random() * 2 - 1) * envelope * clapPulse;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  public playRewardFanfare() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 440, t: 0, d: 0.15 },
      { f: 554.37, t: 0.14, d: 0.15 },
      { f: 659.25, t: 0.28, d: 0.15 },
      { f: 880, t: 0.42, d: 0.5 },
    ];

    notes.forEach(({ f, t, d }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);
      gain.gain.setValueAtTime(0.3, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + t);
      osc.stop(now + t + d + 0.02);
    });
  }

  public playUnlockSound() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    [523.25, 783.99, 1046.5, 1318.51, 1567.98].forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);
      gain.gain.setValueAtTime(0.25, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.38);
    });
  }

  // Runway Background Music Generator
  public startRunwayBgm() {
    if (this.isBgmPlaying || this.bgmMuted) return;
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    this.isBgmPlaying = true;
    let step = 0;
    const interval = (60 / this.bpm / 4) * 1000; // 16th notes

    // Chord progression: Am - F - C - G
    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [130.81, 164.81, 196.0], // C
      [196.0, 246.94, 293.66], // G
    ];

    this.bgmTimer = window.setInterval(() => {
      if (!this.ctx || !this.bgmGain || this.bgmMuted) return;

      const now = this.ctx.currentTime;
      const beat = step % 16;
      const bar = Math.floor((step % 64) / 16);
      const chord = chords[bar];

      // Kick drum on 0, 4, 8, 12
      if (beat % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(130, now);
        kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.09);
        kickGain.gain.setValueAtTime(0.4, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        kickOsc.connect(kickGain);
        kickGain.connect(this.bgmGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.13);
      }

      // Snare / clap on beat 4 and 12
      if (beat === 4 || beat === 12) {
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.06, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        const snareGain = this.ctx.createGain();
        snareGain.gain.setValueAtTime(0.2, now);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        whiteNoise.connect(filter);
        filter.connect(snareGain);
        snareGain.connect(this.bgmGain);
        whiteNoise.start(now);
      }

      // Hi-hat on every offbeat
      if (beat % 2 === 1) {
        const hatBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.03, this.ctx.sampleRate);
        const hatData = hatBuffer.getChannelData(0);
        for (let i = 0; i < hatBuffer.length; i++) {
          hatData[i] = Math.random() * 2 - 1;
        }
        const hatSource = this.ctx.createBufferSource();
        hatSource.buffer = hatBuffer;
        const hatFilter = this.ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.value = 6000;

        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(0.08, now);
        hatGain.gain.exponentialRampToValueAtTime(0.005, now + 0.03);

        hatSource.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(this.bgmGain);
        hatSource.start(now);
      }

      // Synth Bassline on beat 0, 3, 6, 8, 11, 14
      if ([0, 3, 6, 8, 11, 14].includes(beat)) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const rootFreq = chord[0] / 2;
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(rootFreq, now);

        const bassFilter = this.ctx.createBiquadFilter();
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(600, now);
        bassFilter.frequency.exponentialRampToValueAtTime(200, now + 0.12);

        bassGain.gain.setValueAtTime(0.25, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.bgmGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.15);
      }

      // Synth Pad Chords on beat 0 and 8
      if (beat === 0 || beat === 8) {
        chord.forEach((freq) => {
          const padOsc = this.ctx!.createOscillator();
          const padGain = this.ctx!.createGain();
          padOsc.type = 'sine';
          padOsc.frequency.setValueAtTime(freq * 1.5, now);
          padGain.gain.setValueAtTime(0.05, now);
          padGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          padOsc.connect(padGain);
          padGain.connect(this.bgmGain!);
          padOsc.start(now);
          padOsc.stop(now + 0.42);
        });
      }

      step++;
    }, interval);
  }

  public stopRunwayBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isBgmPlaying = false;
  }

  public stopBgm() {
    this.stopRunwayBgm();
  }

  public setMuted(muted: boolean) {
    this.sfxMuted = muted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(muted ? 0 : 0.4, this.ctx.currentTime);
    }
  }
}

export const soundManager = new SoundManager();
