class AudioManager {
  private ctx: AudioContext | null = null;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenInterval: any = null;
  private isSirenActive = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play Emergency High-Low Warning Siren
  public startSiren() {
    if (this.isSirenActive) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    this.isSirenActive = true;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    this.sirenOsc = osc;
    this.sirenGain = gain;

    let high = false;
    this.sirenInterval = setInterval(() => {
      if (!this.isSirenActive || !this.sirenOsc || !this.ctx) return;
      const targetFreq = high ? 1350 : 750;
      this.sirenOsc.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + 0.35);
      high = !high;
    }, 400);
  }

  public stopSiren() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch (e) {}
      this.sirenOsc = null;
    }
    if (this.sirenGain) {
      try {
        this.sirenGain.disconnect();
      } catch (e) {}
      this.sirenGain = null;
    }
  }

  public isSirenPlaying(): boolean {
    return this.isSirenActive;
  }

  // Play Morse Code SOS (... --- ...)
  public playMorseSos() {
    const ctx = this.initCtx();
    if (!ctx) return;

    // S: 3 short, O: 3 long, S: 3 short
    const dot = 0.09;
    const dash = 0.28;
    const elementPause = 0.08;
    const charPause = 0.22;

    const pattern = [
      dot, elementPause, dot, elementPause, dot, // S
      charPause,
      dash, elementPause, dash, elementPause, dash, // O
      charPause,
      dot, elementPause, dot, elementPause, dot // S
    ];

    let time = ctx.currentTime + 0.05;
    for (let i = 0; i < pattern.length; i++) {
      const duration = pattern[i];
      if (i % 2 === 0) {
        // Sound on
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.01);
        gain.gain.linearRampToValueAtTime(0, time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
      }
      time += duration;
    }
  }

  // Sonar Blip for navigation towards safe zones
  public playSonarPing(intensity: number = 0.5) {
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, time);
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.3);

    const volume = Math.min(0.25, Math.max(0.05, intensity * 0.2));
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  // Speak announcement for Blind accessibility
  public speak(text: string, langCode: string = 'en-US') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = langCode;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  }

  // Trigger vibration pattern
  public vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }
}

export const audioService = new AudioManager();
