/**
 * RoomScene.js - Cena principal do jogo
 * Gerencia: gameplay, colisões, spawn, UI, transições
 */

import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Projectile } from '../entities/Projectile.js';
import { RoomGenerator } from '../procedural/RoomGenerator.js';
import { createRunRNG } from '../procedural/RNG.js';
import { LucidezSystem } from '../systems/LucidezSystem.js';
import { GlitchEffects } from '../systems/GlitchEffects.js';

export class RoomScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoomScene' });
    this.player = null;
    this.roomGenerator = null;
    this.currentRoom = null;
    this.enemies = [];
    this.items = [];
    this.walls = null;
    this.projectiles = null;

    // Sistemas
    this.lucidezSystem = null;
    this.glitchEffects = null;

    // UI
    this.healthText = null;
    this.lucidezBar = null;
    this.roomCountText = null;

    // Estado
    this.currentRoomNumber = 0;
    this.roomCleared = false;
    this.runSeed = Math.floor(Math.random() * 1000000);
    this.rng = createRunRNG(this.runSeed);

    // Estatísticas da run
    this.stats = {
      roomsCleared: 0,
      enemiesDefeated: 0,
      amuletCount: 0,
      finalLucidez: 50,
      runSeed: this.runSeed,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
    };

    // Controles
    this.cursors = null;
    this.shootDirection = { x: 0, y: 0 };
  }

  /**
   * Inicializa cena e cria assets
   */
  create() {
    // Criar RNG e gerador de salas para essa run
    this.roomGenerator = new RoomGenerator(
      this.cameras.main.width,
      this.cameras.main.height,
      this.rng
    );

    // Criar sistemas
    this.lucidezSystem = new LucidezSystem(this, 50);
    this.glitchEffects = new GlitchEffects(this);

    // Carregar primeira sala
    this.loadRoom();

    // Configurar input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', this.handleKeyPress, this);

    // Configurar mouse para direção de tiro
    this.input.on('pointermove', (pointer) => {
      const angle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        pointer.x,
        pointer.y
      );
      this.shootDirection.x = Math.cos(angle);
      this.shootDirection.y = Math.sin(angle);
    });

    // Click do mouse para disparar
    this.input.on('pointerdown', () => {
      this.player.shoot(
        this.projectiles,
        this.shootDirection.x,
        this.shootDirection.y,
        this
      );
    });

    // UI
    this.createUI();

    console.log(`🌙 Run iniciada com seed: ${this.runSeed}`);
  }

  /**
   * Carrega uma nova sala
   * @param {string} roomType - Tipo de sala ('normal', 'elite', 'boss')
   */
  loadRoom(roomType = 'normal') {
    this.currentRoomNumber++;

    // Determinar tipo de sala
    const isEveryTenthBoss = this.currentRoomNumber % 10 === 0;
    const isEliteRoom =
      this.rng.chance(0.3) && this.currentRoomNumber > 3 && !isEveryTenthBoss;

    if (isEveryTenthBoss) {
      roomType = 'boss';
    } else if (isEliteRoom) {
      roomType = 'elite';
    }

    // Gerar sala
    this.currentRoom = this.roomGenerator.generate(roomType);

    // Limpar cena anterior
    if (this.player) {
      this.player.destroy();
    }
    this.enemies.forEach(e => e.destroy());
    this.enemies = [];

    // Criar player
    const spawnPos = this.currentRoom.layout.spawnPoint;
    this.player = new Player(this, spawnPos.x, spawnPos.y);

    // Criar grupos de física
    if (!this.projectiles) {
      this.projectiles = this.physics.add.group();
    }

    // Criar paredes
    this.createWalls();

    // Spawn inimigos
    this.spawnEnemies();

    // Spawn itens
    this.spawnItems();

    // Boss especial
    if (this.currentRoom.boss) {
      this.spawnBoss();
    }

    // Reset flags
    this.roomCleared = false;

    console.log(`Sala ${this.currentRoomNumber} carregada: ${roomType}`);
  }

  /**
   * Cria paredes colidiveis
   */
  createWalls() {
    // Destruir grupo anterior
    if (this.walls) {
      this.walls.clear(true, true);
    }

    this.walls = this.physics.add.group();

    // Adicionar todas as paredes da sala
    this.currentRoom.layout.walls.forEach(wall => {
      const rect = this.walls.create(
        wall.x + wall.width / 2,
        wall.y + wall.height / 2
      );
      rect.setDisplaySize(wall.width, wall.height);
      rect.body.setImmovable(true);
    });

    // Colisão player com paredes
    this.physics.add.collider(this.player, this.walls);
  }

  /**
   * Cria inimigos na sala
   */
  spawnEnemies() {
    this.currentRoom.enemies.forEach(enemyConfig => {
      const enemy = new Enemy(
        this,
        enemyConfig.position.x,
        enemyConfig.position.y,
        enemyConfig.type
      );

      // Aplicar modificadores de lucidez
      const speedMod = this.lucidezSystem.getEnemySpeedMod();
      const damageMod = this.lucidezSystem.getEnemyDamageMod();
      enemy.speed = enemy.baseSpeed * speedMod;
      enemy.damage = Math.round(enemy.damage * damageMod);

      this.enemies.push(enemy);

      // Colisão com paredes
      this.physics.add.collider(enemy, this.walls);

      // Colisão com projéteis
      this.physics.add.overlap(
        this.projectiles,
        enemy,
        (projectile, enemyHit) => {
          this.handleProjectileEnemyCollision(projectile, enemyHit);
        }
      );

      // Colisão com player (dano)
      this.physics.add.overlap(this.player, enemy, () => {
        if (!this.damageTimer || Date.now() - this.damageTimer > 500) {
          this.player.takeDamage(enemy.damage);
          this.lucidezSystem.loseLucidez(3);
          this.stats.totalDamageReceived += enemy.damage;
          this.damageTimer = Date.now();
        }
      });
    });
  }

  /**
   * Cria o boss
   */
  spawnBoss() {
    const bossPos = this.currentRoom.boss.position;
    const boss = new Enemy(this, bossPos.x, bossPos.y, 'boss');
    boss.bossName = this.currentRoom.boss.bossType;

    this.enemies.push(boss);

    // Mesmas colisões que inimigos normais
    this.physics.add.collider(boss, this.walls);
    this.physics.add.overlap(this.projectiles, boss, (projectile, bossHit) => {
      this.handleProjectileEnemyCollision(projectile, bossHit);
    });
    this.physics.add.overlap(this.player, boss, () => {
      if (!this.damageTimer || Date.now() - this.damageTimer > 500) {
        this.player.takeDamage(boss.damage);
        this.damageTimer = Date.now();
      }
    });

    console.log(`Boss apareceu: ${boss.bossName}`);
  }

  /**
   * Cria itens (amuletos) na sala
   */
  spawnItems() {
    this.currentRoom.items.forEach(itemConfig => {
      const item = this.add.image(
        itemConfig.position.x,
        itemConfig.position.y,
        'item'
      );
      item.setScale(0.6);
      item.amulet = itemConfig.amulet;

      this.items.push(item);

      // Overlap com player (coleta)
      this.physics.add.overlap(this.player, item, () => {
        this.player.collectAmulet(item.amulet);
        item.destroy();
        this.items = this.items.filter(i => i.active);
      });
    });
  }

  /**
   * Atualiza lógica do jogo
   * @param {number} time - Tempo total
   * @param {number} delta - Tempo desde último frame
   */
  update(time, delta) {
    // Atualizar sistemas
    this.lucidezSystem.update(delta);
    this.glitchEffects.setIntensity(this.lucidezSystem.glitchIntensity);
    this.glitchEffects.update();

    // Verificar se player morreu
    if (!this.player.isAlive()) {
      console.log('💀 Player morreu! Salas: ' + this.stats.roomsCleared);
      this.stats.finalLucidez = this.lucidezSystem.lucidez;
      
      // Aguardar um pouco e ir para game over
      this.time.delayedCall(500, () => {
        this.scene.start('GameOverScene', this.stats);
      });
      return;
    }

    // Atualizar player
    this.player.move(this.cursors, delta);

    // Disparo automático baseado em direção do mouse
    if (this.shootDirection.x !== 0 || this.shootDirection.y !== 0) {
      this.player.shoot(
        this.projectiles,
        this.shootDirection.x,
        this.shootDirection.y,
        this
      );
    }

    // Atualizar inimigos
    this.enemies.forEach(enemy => {
      if (enemy.isAlive()) {
        enemy.update(this.player, delta);
      } else {
        enemy.destroy();
      }
    });

    // Remover inimigos mortos
    this.enemies = this.enemies.filter(e => e.active && e.isAlive());

    // Verificar se sala foi limpa
    if (this.enemies.length === 0 && !this.roomCleared) {
      this.roomCleared = true;
      this.onRoomCleared();
    }

    // Atualizar projéteis
    this.projectiles.children.entries.forEach(projectile => {
      projectile.update();
    });

    // Atualizar UI
    this.updateUI();
  }

  /**
   * Trata colisão entre projétil e inimigo
   * @param {Projectile} projectile - Projétil
   * @param {Enemy} enemy - Inimigo
   */
  handleProjectileEnemyCollision(projectile, enemy) {
    const collisionData = projectile.getCollisionData();

    enemy.takeDamage(collisionData.damage);
    this.stats.totalDamageDealt += collisionData.damage;

    // Aplicar efeitos
    if (collisionData.slowEffect) {
      enemy.applySlow(2000);
    }
    if (collisionData.stunEffect) {
      enemy.applyStun(1500);
    }

    // Verificar se inimigo morreu
    if (!enemy.isAlive()) {
      this.stats.enemiesDefeated++;
      this.lucidezSystem.gainLucidez(enemy.enemyType);
    }

    // Destruir projétil (ou fazer ricochete)
    if (!projectile.hasRicochet) {
      projectile.destroy();
    } else {
      projectile.bounceOffWall(enemy.body);
    }
  }

  /**
   * Chamado quando sala é limpa
   */
  onRoomCleared() {
    console.log(`✓ Sala ${this.currentRoomNumber} limpa!`);
    this.stats.roomsCleared++;

    // Efeito visual
    this.tweens.add({
      targets: this.player,
      alpha: 0.9,
      duration: 200,
      yoyo: true,
    });

    // Aguardar 2 segundos e carregar próxima sala
    this.time.delayedCall(2000, () => {
      this.loadRoom();
    });
  }

  /**
   * Trata input de teclado
   * @param {Phaser.Input.Keyboard.Key} event - Evento de tecla
   */
  handleKeyPress(event) {
    // Spacebar dispara projétil na direção do mouse
    if (event.key === ' ') {
      this.player.shoot(
        this.projectiles,
        this.shootDirection.x,
        this.shootDirection.y,
        this
      );
    }

    // R para resetar run
    if (event.key === 'r' || event.keyCode === 82) {
      this.scene.restart();
    }
  }

  /**
   * Cria elementos de UI
   */
  createUI() {
    const uiConfig = { fontSize: '16px', fill: '#fff' };

    this.healthText = this.add.text(20, 20, '', uiConfig).setScrollFactor(0);
    this.roomCountText = this.add
      .text(20, 50, '', uiConfig)
      .setScrollFactor(0);

    // Barra de lucidez (à implementar com gráficos)
    this.add
      .text(20, 80, 'Lucidez:', uiConfig)
      .setScrollFactor(0);
  }

  /**
   * Atualiza elementos de UI
   */
  updateUI() {
    this.healthText.setText(`❤️ Health: ${this.player.health}/${this.player.maxHealth}`);
    this.roomCountText.setText(`🌙 Sala: ${this.currentRoomNumber} | Inimigos: ${this.stats.enemiesDefeated}`);
  }
}