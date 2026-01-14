/**
 * AssetsManager.js - Gerenciador centralizado de assets
 * Cria sprites, sons e partículas dinamicamente em memória
 */

export class AssetsManager {
  constructor(scene) {
    this.scene = scene;
    this.sprites = {};
    this.sounds = {};
  }

  /**
   * Cria todos os sprites do jogo em memória
   */
  createAllSprites() {
    this.createPlayerSprite();
    this.createEnemySprites();
    this.createProjectileSprites();
    this.createItemSprites();
    this.createEffectSprites();
    this.createUISprites();
  }

  /**
   * Cria sprite do player (criança)
   */
  createPlayerSprite() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // Cabeça (verde claro)
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillCircle(16, 10, 8);

    // Corpo
    graphics.fillRect(12, 18, 8, 12);

    // Braços
    graphics.fillRect(8, 19, 4, 8);
    graphics.fillRect(20, 19, 4, 8);

    // Pernas
    graphics.fillRect(12, 30, 3, 6);
    graphics.fillRect(17, 30, 3, 6);

    graphics.generateTexture('player', 32, 36);
    graphics.destroy();
  }

  /**
   * Cria sprites dos inimigos
   */
  createEnemySprites() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // INIMIGO NORMAL (forma deformada vermelha)
    graphics.fillStyle(0xff0000, 1);
    graphics.beginPath();
    graphics.moveTo(8, 4);
    graphics.lineTo(24, 8);
    graphics.lineTo(28, 16);
    graphics.lineTo(24, 24);
    graphics.lineTo(8, 28);
    graphics.lineTo(4, 16);
    graphics.closePath();
    graphics.fillPath();

    // Olhos
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(10, 12, 2);
    graphics.fillCircle(22, 14, 2);

    graphics.generateTexture('enemy_normal', 32, 32);

    // INIMIGO ELITE (forma mais escura e maior)
    graphics.clear();
    graphics.fillStyle(0xff6600, 1);
    graphics.beginPath();
    graphics.moveTo(12, 2);
    graphics.lineTo(28, 6);
    graphics.lineTo(32, 16);
    graphics.lineTo(28, 26);
    graphics.lineTo(12, 30);
    graphics.lineTo(4, 16);
    graphics.closePath();
    graphics.fillPath();

    // Olhos maiores
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(12, 12, 3);
    graphics.fillCircle(24, 14, 3);

    // Dentes
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillRect(10, 20, 2, 3);
    graphics.fillRect(15, 20, 2, 3);
    graphics.fillRect(20, 20, 2, 3);

    graphics.generateTexture('enemy_elite', 32, 32);

    // INIMIGO BOSS (forma terrível)
    graphics.clear();
    graphics.fillStyle(0xff0066, 1);
    graphics.beginPath();
    graphics.moveTo(16, 0);
    graphics.lineTo(32, 8);
    graphics.lineTo(36, 16);
    graphics.lineTo(32, 32);
    graphics.lineTo(16, 36);
    graphics.lineTo(0, 32);
    graphics.lineTo(-4, 16);
    graphics.lineTo(0, 8);
    graphics.closePath();
    graphics.fillPath();

    // Olho único grande
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(16, 14, 5);
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(16, 14, 3);

    // Aura
    graphics.lineStyle(2, 0xff00ff, 0.6);
    graphics.strokeCircle(16, 16, 20);

    graphics.generateTexture('enemy_boss', 48, 48);
    graphics.destroy();
  }

  /**
   * Cria sprites dos projéteis (pensamentos)
   */
  createProjectileSprites() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // PROJECTIL AMARELO (padrão)
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(8, 8, 6);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.strokeCircle(8, 8, 6);
    graphics.generateTexture('projectile_yellow', 16, 16);

    // PROJECTIL CIANO
    graphics.clear();
    graphics.fillStyle(0x00ffff, 1);
    graphics.fillCircle(8, 8, 6);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.strokeCircle(8, 8, 6);
    graphics.generateTexture('projectile_cyan', 16, 16);

    // PROJECTIL MAGENTA
    graphics.clear();
    graphics.fillStyle(0xff00ff, 1);
    graphics.fillCircle(8, 8, 6);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.strokeCircle(8, 8, 6);
    graphics.generateTexture('projectile_magenta', 16, 16);

    // PROJECTIL VERDE
    graphics.clear();
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillCircle(8, 8, 6);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.strokeCircle(8, 8, 6);
    graphics.generateTexture('projectile_green', 16, 16);

    graphics.destroy();
  }

  /**
   * Cria sprites dos itens (amuletos)
   */
  createItemSprites() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // AMULETO BASE (brilho)
    const colors = {
      health: 0xff6666,
      speed: 0x66ff66,
      damage: 0xff6600,
      ricochet: 0x66ffff,
      slow: 0x6666ff,
      stun: 0xffff66,
      pierce: 0xff66ff,
    };

    Object.entries(colors).forEach(([type, color]) => {
      graphics.clear();

      // Corpo do amuleto (diamante)
      graphics.fillStyle(color, 1);
      graphics.beginPath();
      graphics.moveTo(8, 2);
      graphics.lineTo(14, 8);
      graphics.lineTo(8, 14);
      graphics.lineTo(2, 8);
      graphics.closePath();
      graphics.fillPath();

      // Brilho
      graphics.lineStyle(1, 0xffffff, 0.6);
      graphics.strokeRect(3, 5, 10, 6);

      graphics.generateTexture(`item_${type}`, 16, 16);
    });

    graphics.destroy();
  }

  /**
   * Cria sprites de efeitos (partículas, explosões)
   */
  createEffectSprites() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // Partícula de dano
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(4, 4, 2);
    graphics.generateTexture('particle_damage', 8, 8);

    // Partícula de cura
    graphics.clear();
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillCircle(4, 4, 2);
    graphics.generateTexture('particle_heal', 8, 8);

    // Partícula de slow
    graphics.clear();
    graphics.fillStyle(0x0099ff, 1);
    graphics.fillCircle(4, 4, 2);
    graphics.generateTexture('particle_slow', 8, 8);

    // Explosão
    graphics.clear();
    graphics.fillStyle(0xffaa00, 1);
    graphics.fillCircle(8, 8, 6);
    graphics.lineStyle(2, 0xffff00, 0.8);
    graphics.strokeCircle(8, 8, 6);
    graphics.generateTexture('effect_explosion', 16, 16);

    graphics.destroy();
  }

  /**
   * Cria sprites de UI
   */
  createUISprites() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // Botão vazio
    graphics.lineStyle(2, 0x00ff00, 1);
    graphics.strokeRect(0, 0, 100, 40);
    graphics.generateTexture('ui_button', 100, 40);

    // Coração (vida)
    graphics.clear();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(4, 4, 3);
    graphics.fillCircle(8, 4, 3);
    graphics.beginPath();
    graphics.moveTo(3, 6);
    graphics.lineTo(9, 6);
    graphics.lineTo(6, 10);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture('ui_heart', 12, 12);

    graphics.destroy();
  }

  /**
   * Cria todos os sons do jogo
   */
  createAllSounds() {
    this.createSoundEffects();
    this.createMusicTracks();
    this.createAmbience();
  }

  /**
   * Cria efeitos sonoros com Web Audio API
   */
  createSoundEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Som de disparo (bip curto)
    this.createAndStoreSound('shoot', () => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.setValueAtTime(800, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.1);
    });

    // Som de dano (som baixo)
    this.createAndStoreSound('damage', () => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.setValueAtTime(200, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);

      gain.gain.setValueAtTime(0.5, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.2);
    });

    // Som de coleta de item (ascendente)
    this.createAndStoreSound('collect', () => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.setValueAtTime(400, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.2);

      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.2);
    });

    // Som de morte (descendente assustador)
    this.createAndStoreSound('death', () => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.setValueAtTime(800, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);

      gain.gain.setValueAtTime(0.5, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.5);
    });

    // Som de vitória da sala
    this.createAndStoreSound('victory', () => {
      const notes = [523, 659, 784]; // Do, Mi, Sol
      const gain = audioContext.createGain();
      gain.connect(audioContext.destination);

      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        osc.connect(gain);

        const time = audioContext.currentTime + (i * 0.2);
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

        osc.start(time);
        osc.stop(time + 0.15);
      });
    });

    // Som de glitch (ruído)
    this.createAndStoreSound('glitch', () => {
      const bufferSize = audioContext.sampleRate * 0.1;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const gain = audioContext.createGain();
      source.connect(gain);
      gain.connect(audioContext.destination);

      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      source.start(audioContext.currentTime);
      source.stop(audioContext.currentTime + 0.1);
    });
  }

  /**
   * Cria faixas musicais (lo-fi ambient)
   */
  createMusicTracks() {
    // Placeholder para música
    // Em produção, usar Web Audio API ou arquivos de áudio
    this.sounds.music_menu = 'menu_theme';
    this.sounds.music_gameplay = 'gameplay_theme';
    this.sounds.music_boss = 'boss_theme';
  }

  /**
   * Cria sons de ambiente
   */
  createAmbience() {
    // Ambient de pesadelo (low frequency buzz)
    this.sounds.ambience_nightmare = 'nightmare_ambience';
    this.sounds.ambience_calm = 'calm_ambience';
  }

  /**
   * Helper para armazenar som criado
   */
  createAndStoreSound(name, generatorFn) {
    try {
      generatorFn();
      this.sounds[name] = true; // Marca como disponível
    } catch (e) {
      console.warn(`Falha ao criar som ${name}:`, e);
      this.sounds[name] = false;
    }
  }

  /**
   * Toca um efeito sonoro
   * @param {string} soundName - Nome do som
   * @param {number} volume - Volume (0-1)
   */
  playSound(soundName, volume = 0.3) {
    if (!this.sounds[soundName]) {
      console.warn(`Som não encontrado: ${soundName}`);
      return;
    }

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // Som já foi criado durante init
      // Em produção, usar sound manager real
    } catch (e) {
      console.warn('Falha ao tocar som:', e);
    }
  }

  /**
   * Retorna sprite de inimigo baseado em tipo
   */
  getEnemySprite(type) {
    const sprites = {
      normal: 'enemy_normal',
      elite: 'enemy_elite',
      boss: 'enemy_boss',
    };
    return sprites[type] || 'enemy_normal';
  }

  /**
   * Retorna sprite de item baseado em tipo
   */
  getItemSprite(type) {
    return `item_${type}`;
  }

  /**
   * Retorna sprite de projétil com cor
   */
  getProjectileSprite() {
    const colors = [
      'projectile_yellow',
      'projectile_cyan',
      'projectile_magenta',
      'projectile_green',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
