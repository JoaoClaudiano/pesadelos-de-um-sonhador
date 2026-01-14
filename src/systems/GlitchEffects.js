/**
 * GlitchEffects.js - Sistema de efeitos visuais de glitch
 * Cria efeitos surrealistas que aumentam com baixa lucidez
 */

export class GlitchEffects {
  constructor(scene) {
    this.scene = scene;
    this.glitchIntensity = 0; // 0-100
    this.enabled = true;

    // Containers para efeitos
    this.distortionLayer = null;
    this.scanlineEffect = null;
    this.chromaAberration = null;

    this.setupGlitchLayers();
  }

  /**
   * Configura layers para efeitos de glitch
   */
  setupGlitchLayers() {
    // Camada de distorção
    this.distortionLayer = this.scene.add.graphics();
    this.distortionLayer.setScrollFactor(0);
    this.distortionLayer.setDepth(9999);
    this.distortionLayer.setAlpha(0);
  }

  /**
   * Atualiza intensidade de glitch
   * @param {number} intensity - 0 a 100
   */
  setIntensity(intensity) {
    this.glitchIntensity = Math.max(0, Math.min(100, intensity));
  }

  /**
   * Aplica efeito de distorção/scanlines
   */
  applyScanlineEffect() {
    if (this.glitchIntensity < 10) return;

    // Chance baseada em intensidade
    if (Math.random() > this.glitchIntensity / 100) return;

    // Linha horizontal random que pisca
    const y = Math.random() * this.scene.cameras.main.height;
    const height = Math.random() * 20 + 5;
    const alpha = (this.glitchIntensity / 100) * 0.5;

    this.distortionLayer.clear();
    this.distortionLayer.fillStyle(0xff00ff, alpha);
    this.distortionLayer.fillRect(
      0,
      y,
      this.scene.cameras.main.width,
      height
    );

    // Fade out
    this.scene.time.delayedCall(100, () => {
      this.distortionLayer.clear();
    });
  }

  /**
   * Aplica efeito de aberração cromática
   */
  applyChromaAberration() {
    if (this.glitchIntensity < 20) return;

    const strength = (this.glitchIntensity / 100) * 5;
    if (Math.random() > 0.1) return;

    const offsetX = (Math.random() - 0.5) * strength;
    const offsetY = (Math.random() - 0.5) * strength;

    // Shake leve com cor
    this.scene.cameras.main.shake(50, 0.02 * (this.glitchIntensity / 100));

    // Flash de cor
    const colors = [0xff0000, 0x00ff00, 0x0000ff];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rgb = {
      r: (color >> 16) & 255,
      g: (color >> 8) & 255,
      b: color & 255,
    };
    this.scene.cameras.main.flash(
      75,
      rgb.r,
      rgb.g,
      rgb.b,
      false
    );
  }

  /**
   * Aplica efeito de inversão/flipagem
   */
  applyInversionEffect() {
    if (this.glitchIntensity < 60) return;
    if (Math.random() > 0.02) return;

    // Rotação leve
    const rotation = (Math.random() - 0.5) * 0.1;
    const originalRotation = this.scene.cameras.main.rotation;

    this.scene.cameras.main.setRotation(rotation);

    this.scene.time.delayedCall(150, () => {
      this.scene.cameras.main.setRotation(originalRotation);
    });
  }

  /**
   * Aplica efeito de pixelização
   */
  applyPixelationEffect() {
    if (this.glitchIntensity < 40) return;

    const pixelSize = 2 + (this.glitchIntensity / 100) * 8;

    // Aplicar zoom leve para simular pixelização
    const originalZoom = this.scene.cameras.main.zoom;
    this.scene.cameras.main.setZoom(originalZoom * (1 + pixelSize / 100));

    this.scene.time.delayedCall(100, () => {
      this.scene.cameras.main.setZoom(originalZoom);
    });
  }

  /**
   * Aplica efeito de "screen tear" (rasgo de tela)
   */
  applyScreenTearEffect() {
    if (this.glitchIntensity < 70) return;
    if (Math.random() > 0.01) return;

    this.distortionLayer.clear();
    this.distortionLayer.setAlpha(0.3);

    const tearX = Math.random() * this.scene.cameras.main.width;
    const tearWidth = Math.random() * 20 + 10;
    const tearHeight = this.scene.cameras.main.height;

    this.distortionLayer.fillStyle(0x00ffff, 0.4);
    this.distortionLayer.fillRect(tearX, 0, tearWidth, tearHeight);

    // Offset adicional para efeito de distorção
    const offset = (Math.random() - 0.5) * 20;
    this.distortionLayer.fillRect(tearX + offset, 0, tearWidth / 2, tearHeight);

    this.scene.time.delayedCall(200, () => {
      this.distortionLayer.clear();
    });
  }

  /**
   * Aplica efeito de "double vision" (visão dupla)
   */
  applyDoubleVisionEffect() {
    if (this.glitchIntensity < 50) return;
    if (Math.random() > 0.03) return;

    // Criar segundo sprite do player offset
    const player = this.scene.player;
    if (!player) return;

    const ghost = this.scene.add.sprite(
      player.x + (Math.random() - 0.5) * 30,
      player.y + (Math.random() - 0.5) * 30,
      'player'
    );
    ghost.setAlpha(0.4);
    ghost.setTint(0x00ffff);
    ghost.setDepth(player.depth - 1);

    // Fade out e destruir
    this.scene.tweens.add({
      targets: ghost,
      alpha: 0,
      duration: 300,
      onComplete: () => ghost.destroy(),
    });
  }

  /**
   * Aplica efeito de audio glitch (simulado com variação visual)
   * @param {number} audioDistortion - Intensidade de distorção (0-1)
   */
  applyAudioGlitch(audioDistortion = 0) {
    if (audioDistortion < 0.1) return;

    // Pulsação baseada em audio
    const intensity = audioDistortion * 50;
    this.scene.cameras.main.shake(100, 0.01 * intensity);
  }

  /**
   * Aplica todos os efeitos baseado em intensidade
   */
  update() {
    if (!this.enabled) return;

    // Efeitos em cascata baseado em intensidade
    this.applyScanlineEffect();

    if (this.glitchIntensity > 20) {
      this.applyChromaAberration();
    }

    if (this.glitchIntensity > 40) {
      this.applyPixelationEffect();
    }

    if (this.glitchIntensity > 50) {
      this.applyDoubleVisionEffect();
    }

    if (this.glitchIntensity > 60) {
      this.applyInversionEffect();
    }

    if (this.glitchIntensity > 70) {
      this.applyScreenTearEffect();
    }
  }

  /**
   * Trigger efeito específico
   * @param {string} effectName - Nome do efeito
   */
  triggerEffect(effectName) {
    switch (effectName) {
      case 'scanline':
        this.applyScanlineEffect();
        break;
      case 'chromaAberration':
        this.applyChromaAberration();
        break;
      case 'inversion':
        this.applyInversionEffect();
        break;
      case 'pixelation':
        this.applyPixelationEffect();
        break;
      case 'screenTear':
        this.applyScreenTearEffect();
        break;
      case 'doubleVision':
        this.applyDoubleVisionEffect();
        break;
    }
  }

  /**
   * Ativa/desativa efeitos
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.distortionLayer.clear();
    }
  }

  /**
   * Limpa todos os efeitos
   */
  clear() {
    this.distortionLayer.clear();
    this.glitchIntensity = 0;
  }
}
