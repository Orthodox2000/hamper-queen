/**
 * Sovereign Atelier Audio Synthesizer (Web Audio API)
 * Zero-dependency, soft celestial harp & bell chimes for royal unboxing & interaction.
 */

class RoyalAudioPlayer {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = true; // Default muted for pleasant UX

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playChime();
    }
    return this.isMuted;
  }

  public playChime(freq: number = 880) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Gentle pitch bend up
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Ignore audio policy restrictions
    }
  }

  public playRoyalFanfare() {
    if (this.isMuted) return;
    // Harmonic progression
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.playChime(note);
      }, index * 90);
    });
  }
}

export const royalAudio = new RoyalAudioPlayer();
