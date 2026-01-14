/**
 * SoundManager.js - Gerenciador de áudio do jogo
 * Controla efeitos sonoros, música e ambientes
 */

export class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.audioContext = null;
    this.masterVolume = 0.5;
    this.soundVolume = 0.6;
    this.musicVolume = 0.4;
    this.soundsEnabled = true;
    this.musicEnabled = true;

    // Inicializar Web Audio API
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API não disponível');
    }

    // Armazenar sons em progresso
    this.activeSounds = [];
    this.currentMusic = null;
  }

  /**
   * Toca efeito sonoro de disparo
   */
  playShootSound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Criar oscilador
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(
      this.soundVolume * this.masterVolume,
      now
    );
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Toca efeito sonoro de dano
   */
  playDamageSound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Toca efeito sonoro de coleta
   */
  playCollectSound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Nota ascendente
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Toca efeito sonoro de inimigo derrotado
   */
  playEnemyDefeatedSound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Dois tons: baixo depois alto
    const notes = [200, 400];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(freq, now);
      const delayTime = i * 0.1;

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, now + delayTime);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delayTime + 0.12);

      osc.start(now + delayTime);
      osc.stop(now + delayTime + 0.12);
    });
  }

  /**
   * Toca efeito sonoro de vitória de sala
   */
  playSalaVictorySound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Acordes ascendentes (C-E-G, D-F#-A)
    const notes = [
      { freq: 261, start: 0 }, // C
      { freq: 329, start: 0 }, // E
      { freq: 392, start: 0 }, // G
      { freq: 293, start: 0.2 }, // D
      { freq: 369, start: 0.2 }, // F#
      { freq: 440, start: 0.2 }, // A
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(note.freq, now);
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.5, now + note.start);
      gain.gain.exponentialRampToValueAtTime(0.01, now + note.start + 0.25);

      osc.start(now + note.start);
      osc.stop(now + note.start + 0.25);
    });
  }

  /**
   * Toca efeito sonoro de morte do player
   */
  playDeathSound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Descida assustadora
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Toca efeito sonoro de glitch/distorção
   */
  playGlitchSound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Ruído branco
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1500, now);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    source.start(now);
    source.stop(now + 0.1);
  }

  /**
   * Toca ambient surrealista (low frequency)
   */
  playNightmareAmbient() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Tons baixos oscilantes
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, now); // Very low
    osc2.frequency.setValueAtTime(73, now);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(this.musicVolume * this.masterVolume * 0.3, now);

    osc1.start(now);
    osc2.start(now);

    // Deixar rodando por 3 segundos
    this.scene.time.delayedCall(3000, () => {
      osc1.stop();
      osc2.stop();
    });
  }

  /**
   * Toca efeito sonoro de slow
   */
  playSlowSound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Toca efeito sonoro de stun
   */
  playStunSound() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(700, now + 0.05);
    osc.frequency.setValueAtTime(600, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Define volume mestre
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Define volume de sons
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Define volume de música
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Ativa/desativa sons
   */
  setSoundsEnabled(enabled) {
    this.soundsEnabled = enabled;
  }

  /**
   * Ativa/desativa música
   */
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
  }

  /**
   * Retorna se áudio está disponível
   */
  isAudioAvailable() {
    return this.audioContext !== null;
  }
}
