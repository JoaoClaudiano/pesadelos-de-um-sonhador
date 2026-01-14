/**
 * LucidezSystem.js - Sistema completo de lucidez
 * Gerencia: barra de lucidez, efeitos visuais, modificadores de dificuldade
 */

export class LucidezSystem {
  constructor(scene, initialLucidez = 50) {
    this.scene = scene;
    this.lucidez = initialLucidez; // 0-100
    this.maxLucidez = 100;
    this.minLucidez = 0;

    // Efeitos de lucidez
    this.decayRate = 0.1; // Por segundo, em %
    this.recoveryRate = 0.05; // Ao derrotar inimigos
    this.bossRecovery = 0.3; // Ao derrotar boss

    // Visual effects
    this.glitchIntensity = 0;
    this.colorDistortion = 0;
    this.audioDistortion = 0;

    // Modificadores de gameplay
    this.difficultyMultiplier = 1;
    this.enemySpeedMultiplier = 1;
    this.enemyDamageMultiplier = 1;
    this.playerRewardMultiplier = 1;

    // UI Elements
    this.lucidezBar = null;
    this.lucidezText = null;
    this.statusText = null;

    this.createUI();
    this.updateDifficultyModifiers();
  }

  /**
   * Cria elementos visuais da UI
   */
  createUI() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Background da barra
    this.lucidezBarBg = this.scene.add
      .rectangle(width / 2, height - 40, 300, 20, 0x333333)
      .setScrollFactor(0);

    // Barra de lucidez (preenchimento)
    this.lucidezBar = this.scene.add
      .rectangle(width / 2 - 150, height - 40, 300, 20, 0x00ff00)
      .setScrollFactor(0)
      .setOrigin(0, 0.5);

    // Texto de lucidez
    this.lucidezText = this.scene.add
      .text(width - 120, height - 40, `Lucidez: 50%`, {
        fontSize: '14px',
        fill: '#00ff00',
        fontStyle: 'bold',
      })
      .setScrollFactor(0);

    // Status/aviso
    this.statusText = this.scene.add
      .text(width / 2, 20, 'Lúcido', {
        fontSize: '16px',
        fill: '#00ff00',
        align: 'center',
      })
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  /**
   * Atualiza lucidez a cada frame
   * @param {number} delta - Tempo em ms
   */
  update(delta) {
    // Deterioração natural (durante o jogo)
    this.lucidez = Math.max(
      this.minLucidez,
      this.lucidez - (this.decayRate * delta) / 1000
    );

    // Atualizar modificadores de dificuldade
    this.updateDifficultyModifiers();

    // Atualizar UI
    this.updateUI();

    // Aplicar efeitos visuais
    this.applyVisualEffects();
  }

  /**
   * Aumenta lucidez (ao derrotar inimigos)
   * @param {string} enemyType - Tipo do inimigo ('normal', 'elite', 'boss')
   */
  gainLucidez(enemyType = 'normal') {
    let gain = this.recoveryRate * 100; // Em %

    if (enemyType === 'elite') {
      gain *= 1.5;
    } else if (enemyType === 'boss') {
      gain = this.bossRecovery * 100;
    }

    this.lucidez = Math.min(this.maxLucidez, this.lucidez + gain);
  }

  /**
   * Diminui lucidez (ao receber dano)
   * @param {number} amount - Quantidade a diminuir
   */
  loseLucidez(amount = 5) {
    this.lucidez = Math.max(this.minLucidez, this.lucidez - amount);
  }

  /**
   * Atualiza modificadores de dificuldade baseado em lucidez
   * Lucidez alta = jogo mais fácil
   * Lucidez baixa = jogo mais difícil (pesadelo)
   */
  updateDifficultyModifiers() {
    const normalizedLucidez = this.lucidez / 100;

    // Multiplicador de dificuldade (inverte: baixa lucidez = alta dificuldade)
    this.difficultyMultiplier = 0.5 + (1 - normalizedLucidez) * 1.5; // 0.5 a 2.0

    // Inimigos mais rápidos com baixa lucidez
    this.enemySpeedMultiplier = 1 + (1 - normalizedLucidez) * 0.5; // 1.0 a 1.5

    // Inimigos fazem mais dano com baixa lucidez
    this.enemyDamageMultiplier = 1 + (1 - normalizedLucidez) * 0.8; // 1.0 a 1.8

    // Recompensas melhores com baixa lucidez (risco/recompensa)
    this.playerRewardMultiplier = 1 + (1 - normalizedLucidez) * 0.5; // 1.0 a 1.5

    // Intensidade de glitch baseado em lucidez
    this.glitchIntensity = (1 - normalizedLucidez) * 100; // 0 a 100
    this.colorDistortion = (1 - normalizedLucidez) * 0.3; // 0 a 0.3
    this.audioDistortion = (1 - normalizedLucidez) * 0.5; // 0 a 0.5
  }

  /**
   * Atualiza cor e texto da UI
   */
  updateUI() {
    const percentage = Math.round(this.lucidez);
    const width = this.scene.cameras.main.width;

    // Atualizar largura da barra (proporcional a lucidez)
    this.lucidezBar.setDisplaySize(300 * (this.lucidez / 100), 20);

    // Atualizar cor baseado em lucidez
    let color = this.getLucidezColor();
    this.lucidezBar.setFillStyle(parseInt(color.replace('#', '0x')));
    this.lucidezText.setColor(color);

    // Atualizar texto
    this.lucidezText.setText(`Lucidez: ${percentage}%`);

    // Status baseado em lucidez
    let status = this.getStatusText();
    this.statusText.setText(status).setColor(color);
  }

  /**
   * Retorna cor baseado em nível de lucidez
   * @returns {string} Cor hex
   */
  getLucidezColor() {
    if (this.lucidez > 75) {
      return '#00ff00'; // Verde: lúcido
    } else if (this.lucidez > 50) {
      return '#ffff00'; // Amarelo: sonhando
    } else if (this.lucidez > 25) {
      return '#ff8800'; // Laranja: pesadelo
    } else {
      return '#ff0000'; // Vermelho: pesadelo severo
    }
  }

  /**
   * Retorna texto de status
   * @returns {string}
   */
  getStatusText() {
    if (this.lucidez > 75) {
      return '✓ Lúcido';
    } else if (this.lucidez > 50) {
      return '◐ Sonhando';
    } else if (this.lucidez > 25) {
      return '◑ Pesadelo';
    } else {
      return '✕ Pesadelo Severo';
    }
  }

  /**
   * Aplica efeitos visuais baseado em lucidez
   */
  applyVisualEffects() {
    // Efeito de glitch (distorção de câmera)
    if (Math.random() < this.glitchIntensity / 500) {
      const offsetX = (Math.random() - 0.5) * this.glitchIntensity;
      const offsetY = (Math.random() - 0.5) * this.glitchIntensity;

      this.scene.cameras.main.shake(50, 0.01 * this.glitchIntensity);
    }

    // Efeito de distorção de cor (screen tint)
    if (this.colorDistortion > 0 && Math.random() < 0.05) {
      const currentAlpha = this.scene.cameras.main.alpha || 1;
      // Piscar vermelho em baixa lucidez
      if (this.lucidez < 30) {
        this.scene.cameras.main.flash(100, 255, 0, 0, false);
      }
    }

    // Efeito de inversão de cores em muito baixa lucidez
    if (this.lucidez < 10) {
      if (Math.random() < 0.02) {
        // Rarely flip the screen
        this.scene.cameras.main.setRotation(
          (Math.random() - 0.5) * 0.05
        );
        this.scene.time.delayedCall(100, () => {
          this.scene.cameras.main.setRotation(0);
        });
      }
    }
  }

  /**
   * Retorna modificador de velocidade para inimigos
   */
  getEnemySpeedMod() {
    return this.enemySpeedMultiplier;
  }

  /**
   * Retorna modificador de dano para inimigos
   */
  getEnemyDamageMod() {
    return this.enemyDamageMultiplier;
  }

  /**
   * Retorna multiplicador de recompensas
   */
  getRewardMultiplier() {
    return this.playerRewardMultiplier;
  }

  /**
   * Retorna se está em pesadelo severo
   */
  isSeverNightmare() {
    return this.lucidez < 25;
  }

  /**
   * Retorna se está lúcido
   */
  isLucid() {
    return this.lucidez > 75;
  }

  /**
   * Debug: Set lucidez manualmente
   */
  setLucidez(value) {
    this.lucidez = Math.max(0, Math.min(100, value));
  }
}
