/**
 * MenuScene.js - Menu principal do jogo
 * Apresenta opções e introdução
 */

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  /**
   * Cria tela de menu
   */
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Criar assets na primeira vez
    this.createAssets();

    // Background com gradiente (simulado)
    this.add
      .rectangle(width / 2, height / 2, width, height, 0x1a0033)
      .setScrollFactor(0);

    // Padrão de fundo
    this.createBackgroundPattern();

    // Título principal
    this.add
      .text(width / 2, 60, 'PESADELOS DE UM SONHADOR', {
        fontSize: '40px',
        fill: '#ff00ff',
        fontStyle: 'bold',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Subtítulo
    this.add
      .text(width / 2, 110, 'Um roguelike surrealista de pesadelos', {
        fontSize: '16px',
        fill: '#00ffff',
        fontStyle: 'italic',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Linha decorativa
    this.add
      .text(width / 2, 140, '═══════════════════════════════════', {
        fontSize: '16px',
        fill: '#ffff00',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Descrição do jogo
    const description = [
      'Você é uma criança presa em seus próprios pesadelos.',
      'Navegue pelo subconsciente, derrote seus traumas,',
      'e trabalhe para recuperar a lucidez.',
      '',
      'Cada morte te acorda, mas você mantém sua experiência.',
    ];

    let yPos = 180;
    description.forEach(line => {
      this.add
        .text(width / 2, yPos, line, {
          fontSize: '14px',
          fill: '#cccccc',
          fontFamily: 'Arial',
          align: 'center',
        })
        .setOrigin(0.5)
        .setScrollFactor(0);
      yPos += 30;
    });

    // Seção de controles
    yPos += 20;
    this.add
      .text(width / 2, yPos, '🎮 CONTROLES', {
        fontSize: '16px',
        fill: '#ffff00',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    yPos += 35;
    const controls = [
      '⬆️⬇️⬅️➡️ ou WASD - Mover',
      '🖱️ Mouse - Apontar',
      'Click Esquerdo - Disparar',
      'ESPAÇO - Disparo Rápido',
      'R - Reiniciar Run',
    ];

    controls.forEach(control => {
      this.add
        .text(width / 2, yPos, control, {
          fontSize: '13px',
          fill: '#00ff00',
          fontFamily: 'Courier',
        })
        .setOrigin(0.5)
        .setScrollFactor(0);
      yPos += 25;
    });

    // Botão de iniciar
    const buttonY = height - 120;

    this.createLargeButton(
      width / 2,
      buttonY,
      'INICIAR JOGO',
      () => {
        this.scene.start('RoomScene');
      },
      '#00ff00'
    );

    // Botão de créditos
    this.createButton(
      width / 2 - 100,
      buttonY + 80,
      'CRÉDITOS',
      () => {
        this.showCredits();
      },
      '#00ffff'
    );

    // Botão de dificuldade (placeholder)
    this.createButton(
      width / 2 + 100,
      buttonY + 80,
      'OPÇÕES',
      () => {
        this.showOptions();
      },
      '#ff00ff'
    );

    // Instrução de tecla
    this.add
      .text(width / 2, height - 20, 'Pressione ESPAÇO ou clique para começar', {
        fontSize: '12px',
        fill: '#666666',
        fontStyle: 'italic',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Input
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('RoomScene');
    });
  }

  /**
   * Cria todos os sprites do jogo
   */
  createAssets() {
    // Verificar se já foram criados
    if (this.textures.exists('player')) {
      return; // Já criados
    }

    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Player sprite
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('player', 32, 32);

    // Enemy sprite
    graphics.clear();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('enemy', 32, 32);

    // Projectile sprite
    graphics.clear();
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('projectile', 16, 16);

    // Item sprite
    graphics.clear();
    graphics.fillStyle(0xff00ff, 1);
    graphics.fillCircle(8, 8, 10);
    graphics.generateTexture('item', 16, 16);

    graphics.destroy();
  }

  /**
   * Cria padrão de fundo
   */
  createBackgroundPattern() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const spacing = 40;

    graphics.fillStyle(0x2d0052, 0.3);
    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        graphics.fillCircle(x, y, 2);
      }
    }

    graphics.generateTexture('pattern', width, height);
    this.add.image(width / 2, height / 2, 'pattern').setScrollFactor(0);
    graphics.destroy();
  }

  /**
   * Cria botão grande (iniciar)
   */
  createLargeButton(x, y, text, callback, color) {
    const width = 240;
    const height = 60;

    // Background
    const bg = this.add
      .rectangle(x, y, width, height, 0x1a1a1a)
      .setScrollFactor(0);
    bg.setStrokeStyle(3, parseInt(color.replace('#', '0x')));

    // Texto
    const btnText = this.add
      .text(x, y, text, {
        fontSize: '24px',
        fill: color,
        fontStyle: 'bold',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Interatividade
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => {
      bg.setFillStyle(0x333333);
      btnText.setFill('#ffffff');

      // Efeito de glow
      this.tweens.add({
        targets: bg,
        lineWidth: 5,
        duration: 100,
      });
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x1a1a1a);
      btnText.setFill(color);

      this.tweens.add({
        targets: bg,
        lineWidth: 3,
        duration: 100,
      });
    });
    bg.on('pointerdown', () => {
      this.tweens.add({
        targets: [bg, btnText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: callback,
      });
    });
  }

  /**
   * Cria botão pequeno
   */
  createButton(x, y, text, callback, color) {
    const width = 120;
    const height = 50;

    const bg = this.add
      .rectangle(x, y, width, height, 0x2a2a2a)
      .setScrollFactor(0);
    bg.setStrokeStyle(2, parseInt(color.replace('#', '0x')));

    const btnText = this.add
      .text(x, y, text, {
        fontSize: '14px',
        fill: color,
        fontStyle: 'bold',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => {
      bg.setFillStyle(0x444444);
      btnText.setFill('#ffffff');
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x2a2a2a);
      btnText.setFill(color);
    });
    bg.on('pointerdown', callback);
  }

  /**
   * Mostra créditos (simples)
   */
  showCredits() {
    console.log('Créditos: Pesadelos de um Sonhador - Jogo Roguelike');
  }

  /**
   * Mostra opções (placeholder)
   */
  showOptions() {
    console.log('Opções - A implementar');
  }

  /**
   * Atualiza scene (efeitos aleatórios)
   */
  update() {
    // Glitch ocasional no título
    if (Math.random() < 0.002) {
      const title = this.children.list[2];
      if (title) {
        const originalX = this.cameras.main.width / 2;
        title.x = originalX + (Math.random() - 0.5) * 10;

        this.time.delayedCall(50, () => {
          title.x = originalX;
        });
      }
    }
  }
}