/**
 * GameOverScene.js - Tela de Game Over
 * Mostra estatísticas e permite reiniciar
 */

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
    this.stats = null;
  }

  /**
   * Inicia com dados de run anterior
   */
  init(data) {
    this.stats = data;
  }

  /**
   * Cria tela de game over
   */
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000)
      .setScrollFactor(0)
      .setAlpha(0.8);

    // Efeito de glitch na tela
    this.applyGameOverGlitch();

    // Título
    this.add
      .text(width / 2, height / 4, 'ACORDOU', {
        fontSize: '48px',
        fill: '#ff0000',
        fontStyle: 'bold',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Subtítulo
    this.add
      .text(width / 2, height / 4 + 60, 'Os Pesadelos Acabaram...', {
        fontSize: '20px',
        fill: '#ff6600',
        fontStyle: 'italic',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Estatísticas
    const startY = height / 2 - 50;
    const lineHeight = 40;
    let yPos = startY;

    this.add
      .text(width / 2, yPos, '═══════════════════════', {
        fontSize: '16px',
        fill: '#00ffff',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    yPos += lineHeight;

    // Salas conquistadas
    this.add
      .text(width / 2, yPos, `🌙 Salas Conquistadas: ${this.stats.roomsCleared}`, {
        fontSize: '18px',
        fill: '#ffff00',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    yPos += lineHeight;

    // Inimigos derrotados
    this.add
      .text(
        width / 2,
        yPos,
        `💀 Inimigos Derrotados: ${this.stats.enemiesDefeated}`,
        {
          fontSize: '18px',
          fill: '#ffff00',
          fontFamily: 'Arial',
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    yPos += lineHeight;

    // Amuletos coletados
    this.add
      .text(width / 2, yPos, `✨ Amuletos Coletados: ${this.stats.amuletCount}`, {
        fontSize: '18px',
        fill: '#ffff00',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    yPos += lineHeight;

    // Lucidez final
    const lucidezColor = this.getLucidezColor(this.stats.finalLucidez);
    this.add
      .text(
        width / 2,
        yPos,
        `◐ Lucidez Final: ${Math.round(this.stats.finalLucidez)}%`,
        {
          fontSize: '18px',
          fill: lucidezColor,
          fontFamily: 'Arial',
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    yPos += lineHeight;

    // Seed da run
    this.add
      .text(width / 2, yPos, `Seed: ${this.stats.runSeed}`, {
        fontSize: '12px',
        fill: '#888888',
        fontFamily: 'Courier',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    yPos += lineHeight * 1.2;

    this.add
      .text(width / 2, yPos, '═══════════════════════', {
        fontSize: '16px',
        fill: '#00ffff',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Botões de ação
    yPos += lineHeight * 1.5;

    // Botão Reiniciar
    this.createButton(
      width / 2 - 150,
      yPos,
      'NOVA RUN',
      () => {
        this.scene.start('RoomScene');
      },
      '#00ff00'
    );

    // Botão Menu
    this.createButton(
      width / 2 + 150,
      yPos,
      'MENU',
      () => {
        this.scene.start('MenuScene');
      },
      '#00ffff'
    );

    // Controle
    this.input.keyboard.on('keydown-R', () => {
      this.scene.start('RoomScene');
    });

    this.input.keyboard.on('keydown-M', () => {
      this.scene.start('MenuScene');
    });
  }

  /**
   * Cria botão interativo
   */
  createButton(x, y, text, callback, color) {
    const width = 120;
    const height = 50;

    // Background
    const bg = this.add
      .rectangle(x, y, width, height, 0x333333)
      .setScrollFactor(0);
    bg.setStrokeStyle(2, parseInt(color.replace('#', '0x')));

    // Texto
    const btnText = this.add
      .text(x, y, text, {
        fontSize: '16px',
        fill: color,
        fontStyle: 'bold',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Interatividade
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => {
      bg.setFillStyle(0x555555);
      btnText.setFill('#ffffff');
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x333333);
      btnText.setFill(color);
    });
    bg.on('pointerdown', callback);
  }

  /**
   * Retorna cor baseado em lucidez
   */
  getLucidezColor(lucidez) {
    if (lucidez > 75) {
      return '#00ff00';
    } else if (lucidez > 50) {
      return '#ffff00';
    } else if (lucidez > 25) {
      return '#ff8800';
    } else {
      return '#ff0000';
    }
  }

  /**
   * Aplica efeito de glitch na tela de game over
   */
  applyGameOverGlitch() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Linhas de glitch
    for (let i = 0; i < 3; i++) {
      const y = Math.random() * height;
      const lineHeight = Math.random() * 20 + 10;

      const line = this.add
        .rectangle(width / 2, y, width, lineHeight, 0xff00ff)
        .setScrollFactor(0)
        .setAlpha(0.2);

      // Animar linha
      this.tweens.add({
        targets: line,
        x: width / 2 + (Math.random() - 0.5) * 50,
        alpha: 0,
        duration: 1000 + Math.random() * 1000,
        onComplete: () => line.destroy(),
      });
    }

    // Animação de título com glitch
    this.tweens.add({
      targets: this.children.list[3], // Título
      x: 5,
      duration: 50,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.children.list[3].x =
          this.cameras.main.width / 2;
      },
    });
  }

  /**
   * Atualiza scene
   */
  update() {
    // Efeito de piscada ocasional
    if (Math.random() < 0.01) {
      this.cameras.main.flash(100, 255, 0, 255, false);
    }
  }
}
