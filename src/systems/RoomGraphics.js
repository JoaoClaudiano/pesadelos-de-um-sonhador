/**
 * RoomGraphics.js - Renderização visual das salas
 * Cria backgrounds, paredes e efeitos de ambiente
 */

export class RoomGraphics {
  constructor(scene) {
    this.scene = scene;
    this.backgroundGraphics = null;
    this.wallGraphics = null;
    this.glitchLayer = null;
  }

  /**
   * Desenha background de sala normal
   */
  drawNormalRoomBackground() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Gradiente azul-púrpura
    graphics.fillStyle(0x1a0033, 1);
    graphics.fillRect(0, 0, width, height / 2);
    graphics.fillStyle(0x330066, 1);
    graphics.fillRect(0, height / 2, width, height / 2);

    // Padrão de pontos (teste do subconsciente)
    graphics.fillStyle(0x00ffff, 0.1);
    for (let i = 0; i < width; i += 40) {
      for (let j = 0; j < height; j += 40) {
        graphics.fillCircle(i, j, 2);
      }
    }

    // Linhas horizontais suaves
    graphics.lineStyle(1, 0x00ff00, 0.05);
    for (let i = 0; i < height; i += 60) {
      graphics.lineBetween(0, i, width, i);
    }

    graphics.generateTexture('room_normal_bg', width, height);
    graphics.destroy();

    // Adicionar à cena
    const bg = this.scene.add.image(
      width / 2,
      height / 2,
      'room_normal_bg'
    );
    bg.setDepth(-10);
    bg.setScrollFactor(0);
  }

  /**
   * Desenha background de sala elite
   */
  drawEliteRoomBackground() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Gradiente avermelhado
    graphics.fillStyle(0x330011, 1);
    graphics.fillRect(0, 0, width, height / 2);
    graphics.fillStyle(0x660033, 1);
    graphics.fillRect(0, height / 2, width, height / 2);

    // Padrão mais denso
    graphics.fillStyle(0xff0066, 0.15);
    for (let i = 0; i < width; i += 30) {
      for (let j = 0; j < height; j += 30) {
        graphics.fillCircle(i, j, 3);
      }
    }

    // Pulsação de linhas
    graphics.lineStyle(2, 0xff6600, 0.08);
    for (let i = 0; i < height; i += 40) {
      graphics.lineBetween(0, i, width, i);
    }

    graphics.generateTexture('room_elite_bg', width, height);
    graphics.destroy();

    const bg = this.scene.add.image(
      width / 2,
      height / 2,
      'room_elite_bg'
    );
    bg.setDepth(-10);
    bg.setScrollFactor(0);
  }

  /**
   * Desenha background de sala boss
   */
  drawBossRoomBackground() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Gradiente negro com magenta
    graphics.fillStyle(0x0a0000, 1);
    graphics.fillRect(0, 0, width, height / 2);
    graphics.fillStyle(0x330066, 1);
    graphics.fillRect(0, height / 2, width, height / 2);

    // Padrão agressivo
    graphics.fillStyle(0xff00ff, 0.2);
    for (let i = 0; i < width; i += 25) {
      for (let j = 0; j < height; j += 25) {
        graphics.fillCircle(i, j, 4);
      }
    }

    // Cruz no centro (simbolismo)
    graphics.lineStyle(3, 0xff00ff, 0.3);
    graphics.lineBetween(width / 2, 0, width / 2, height);
    graphics.lineBetween(0, height / 2, width, height / 2);

    // Vortex oscilante no centro
    graphics.lineStyle(2, 0xffff00, 0.1);
    for (let r = 10; r < 100; r += 10) {
      graphics.strokeCircle(width / 2, height / 2, r);
    }

    graphics.generateTexture('room_boss_bg', width, height);
    graphics.destroy();

    const bg = this.scene.add.image(
      width / 2,
      height / 2,
      'room_boss_bg'
    );
    bg.setDepth(-10);
    bg.setScrollFactor(0);
  }

  /**
   * Renderiza as paredes da sala
   */
  renderWalls(wallsList) {
    const graphics = this.scene.add.graphics();
    graphics.setDepth(5);

    wallsList.forEach(wall => {
      // Parede com gradiente
      graphics.fillStyle(0x2a2a6a, 1);
      graphics.fillRect(wall.x, wall.y, wall.width, wall.height);

      // Borda brilhante
      graphics.lineStyle(2, 0x00ffff, 0.6);
      graphics.strokeRect(wall.x, wall.y, wall.width, wall.height);

      // Detalhes interiores
      graphics.fillStyle(0x1a1a4a, 0.5);
      graphics.fillRect(wall.x + 2, wall.y + 2, wall.width - 4, wall.height - 4);
    });
  }

  /**
   * Desenha portas de sala
   */
  renderDoors(doorsList) {
    const graphics = this.scene.add.graphics();
    graphics.setDepth(4);

    doorsList.forEach(door => {
      // Porta selada (inicialmente)
      graphics.fillStyle(0x666666, 0.8);
      graphics.fillRect(door.x, door.y, door.width, door.height);

      // Símbolo de lacre
      graphics.lineStyle(2, 0xff0000, 0.8);
      graphics.strokeRect(door.x + 2, door.y + 2, door.width - 4, door.height - 4);

      // X (lacrada)
      graphics.lineBetween(door.x, door.y, door.x + door.width, door.y + door.height);
      graphics.lineBetween(door.x + door.width, door.y, door.x, door.y + door.height);
    });

    // Animar pulsação
    this.scene.tweens.add({
      targets: graphics,
      alpha: 0.6,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Anima abertura de porta
   */
  openDoor(doorPos, doorsList) {
    const graphics = this.scene.add.graphics();
    graphics.setDepth(4);
    graphics.clear();

    // Efeito de abertura
    graphics.lineStyle(3, 0x00ff00, 1);
    graphics.strokeRect(doorPos.x, doorPos.y, doorPos.width, doorPos.height);

    // Fazer porta desaparecer
    this.scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: 500,
      onComplete: () => graphics.destroy(),
    });

    // Efeito de brilho
    this.scene.cameras.main.flash(200, 0, 255, 0, false);
  }

  /**
   * Desenha efeitos de partículas (destruição de inimigos)
   */
  createDeathParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      const particle = this.scene.add.sprite(x, y, 'particle_damage');
      particle.setDepth(8);

      const angle = (Math.PI * 2 * i) / 8;
      const velocity = {
        x: Math.cos(angle) * 150,
        y: Math.sin(angle) * 150,
      };

      this.scene.tweens.add({
        targets: particle,
        x: x + velocity.x,
        y: y + velocity.y,
        alpha: 0,
        duration: 600,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }

    // Som de morte
    const soundManager = this.scene.soundManager;
    if (soundManager) {
      soundManager.playEnemyDefeatedSound();
    }
  }

  /**
   * Desenha efeito de coleta de item
   */
  createCollectParticles(x, y) {
    for (let i = 0; i < 6; i++) {
      const particle = this.scene.add.sprite(x, y, 'particle_heal');
      particle.setDepth(8);

      this.scene.tweens.add({
        targets: particle,
        x: x + (Math.random() - 0.5) * 100,
        y: y - 80,
        alpha: 0,
        scale: 0.5,
        duration: 500,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }

    // Som de coleta
    const soundManager = this.scene.soundManager;
    if (soundManager) {
      soundManager.playCollectSound();
    }
  }

  /**
   * Desenha efeito de dano ao player
   */
  createDamageFlash() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    const flash = this.scene.make.graphics({ x: 0, y: 0, add: false });
    flash.fillStyle(0xff0000, 0.5);
    flash.fillRect(0, 0, width, height);
    flash.generateTexture('damage_flash', width, height);
    flash.destroy();

    const image = this.scene.add.image(width / 2, height / 2, 'damage_flash');
    image.setScrollFactor(0);
    image.setDepth(998);

    this.scene.tweens.add({
      targets: image,
      alpha: 0,
      duration: 150,
      onComplete: () => image.destroy(),
    });
  }

  /**
   * Desenha aviso visual de boss chegando
   */
  drawBossWarning(bossName) {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    const warning = this.scene.add.text(width / 2, height / 2, `${bossName}\n APROXIMANDO...`, {
      fontSize: '32px',
      fill: '#ff0000',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    warning.setOrigin(0.5);
    warning.setDepth(100);
    warning.setScrollFactor(0);

    // Shake
    this.scene.cameras.main.shake(300, 0.1);

    // Fazer desaparecer
    this.scene.tweens.add({
      targets: warning,
      alpha: 0,
      duration: 1500,
      delay: 500,
      onComplete: () => warning.destroy(),
    });

    // Som
    const soundManager = this.scene.soundManager;
    if (soundManager) {
      soundManager.playGlitchSound();
    }
  }

  /**
   * Cria aura de efeito especial (slow, stun, etc)
   */
  createStatusEffectAura(target, effectType) {
    const colors = {
      slow: 0x0099ff,
      stun: 0xffff00,
      damage: 0xff0000,
    };

    const color = colors[effectType] || 0x00ff00;
    const aura = this.scene.add.graphics();

    this.scene.tweens.add({
      targets: aura,
      onUpdate: (tween) => {
        aura.clear();
        aura.lineStyle(2, color, 0.8);
        const radius = 20 + Math.sin(tween.progress * Math.PI * 2) * 5;
        aura.strokeCircle(target.x, target.y, radius);
      },
      duration: 1000,
      onComplete: () => aura.destroy(),
    });
  }

  /**
   * Renderiza logo/título da sala
   */
  renderRoomTitle(roomNumber) {
    const width = this.scene.cameras.main.width;

    const title = this.scene.add.text(width / 2, 30, `Sala ${roomNumber}`, {
      fontSize: '24px',
      fill: '#00ffff',
      fontStyle: 'bold',
      stroke: '#0066ff',
      strokeThickness: 2,
    });
    title.setOrigin(0.5);
    title.setScrollFactor(0);
    title.setDepth(100);

    // Fade in/out
    title.setAlpha(0);
    this.scene.tweens.add({
      targets: title,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        this.scene.tweens.add({
          targets: title,
          alpha: 0,
          duration: 300,
          delay: 2000,
          onComplete: () => title.destroy(),
        });
      },
    });
  }
}
