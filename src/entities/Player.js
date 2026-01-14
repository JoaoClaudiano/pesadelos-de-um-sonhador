/**
 * Player.js - Classe responsável pelo player (criança)
 * Mecânicas: movimento top-down, disparo de pensamentos, inventário de amuletos
 */
import { Projectile } from './Projectile.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Propriedades básicas
    this.health = 100;
    this.maxHealth = 100;
    this.speed = 200;
    this.lucidez = 50; // 0-100, afeta dificuldade e efeitos visuais
    this.inventory = []; // Amuletos coletados

    // Física
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setDrag(0.99);

    // Disparo de projéteis
    this.shootCooldown = 0;
    this.shootRate = 300; // ms entre tiros
    this.projectiles = [];
  }

  /**
   * Atualiza posição do player baseado em input
   * @param {Phaser.Input.Keyboard.CursorKeys} cursors - Teclas de movimento
   * @param {number} delta - Tempo desde último frame
   */
  move(cursors, delta) {
    this.setVelocity(0, 0);

    if (cursors.left.isDown) {
      this.setVelocityX(-this.speed);
    }
    if (cursors.right.isDown) {
      this.setVelocityX(this.speed);
    }
    if (cursors.up.isDown) {
      this.setVelocityY(-this.speed);
    }
    if (cursors.down.isDown) {
      this.setVelocityY(this.speed);
    }

    // Update cooldown de tiro
    if (this.shootCooldown > 0) {
      this.shootCooldown -= delta;
    }
  }

  /**
   * Dispara um projétil (pensamento) na direção indicada
   * @param {Phaser.Physics.Arcade.Group} projectileGroup - Grupo de projéteis
   * @param {number} dirX - Direção X (-1, 0, 1)
   * @param {number} dirY - Direção Y (-1, 0, 1)
   * @param {Phaser.Scene} scene - Cena atual
   */
  shoot(projectileGroup, dirX, dirY, scene) {
    if (this.shootCooldown <= 0 && (dirX !== 0 || dirY !== 0)) {
      const projectile = new Projectile(
        scene,
        this.x,
        this.y,
        dirX,
        dirY,
        this.inventory
      );
      projectileGroup.add(projectile);
      this.projectiles.push(projectile);
      this.shootCooldown = this.shootRate;

      // Efeito visual de glitch conforme lucidez cai
      if (this.lucidez < 30) {
        scene.tweens.add({
          targets: this,
          alpha: 0.8,
          duration: 50,
          yoyo: true,
        });
      }
    }
  }

  /**
   * Recebe dano
   * @param {number} damage - Quantidade de dano
   */
  takeDamage(damage) {
    this.health -= damage;
    if (this.health < 0) this.health = 0;

    // Efeito de piscar quando recebe dano
    this.setTint(0xff0000);
    setTimeout(() => this.clearTint(), 100);
  }

  /**
   * Coleta um amuleto e adiciona ao inventário
   * @param {Object} amulet - Objeto amuleto com propriedades de buff
   */
  collectAmulet(amulet) {
    this.inventory.push(amulet);

    // Aplicar efeito imediatamente
    if (amulet.type === 'health') {
      this.health = Math.min(this.health + amulet.value, this.maxHealth);
    } else if (amulet.type === 'speed') {
      this.speed += amulet.value;
    } else if (amulet.type === 'damage') {
      // Damage será aplicado aos projéteis futuros
    }
  }

  /**
   * Altera o nível de lucidez do player
   * @param {number} amount - Quantidade a adicionar/subtrair
   */
  changeLucidez(amount) {
    this.lucidez = Math.max(0, Math.min(100, this.lucidez + amount));
  }

  /**
   * Retorna se o player está vivo
   */
  isAlive() {
    return this.health > 0;
  }

  /**
   * Limpa projéteis da memória
   */
  cleanProjectiles() {
    this.projectiles = this.projectiles.filter(p => p.active);
  }
}
