/**
 * Projectile.js - Classe para projéteis (pensamentos)
 * Mecânicas: velocidade, dano, efeitos especiais baseados em amuletos
 */

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, dirX, dirY, inventory = []) {
    // Define cor baseado em aleatoriedade
    const colors = ['0xffff00', '0x00ffff', '0xff00ff', '0x00ff00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    super(scene, x, y, 'projectile');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Velocidade base
    this.vx = dirX * 400;
    this.vy = dirY * 400;
    this.setVelocity(this.vx, this.vy);

    // Dano base
    this.baseDamage = 10;
    this.damage = this.baseDamage;

    // Propriedades especiais
    this.hasRicochet = false;
    this.hasSlowEffect = false;
    this.hasStunEffect = false;
    this.bounceCount = 0;
    this.maxBounces = 0;
    this.lifespan = 10000; // 10 segundos
    this.createdAt = Date.now();

    // Aplicar buffs de amuletos ao projétil
    this.applyAmuletEffects(inventory);

    // Estilo visual
    this.setTint(parseInt(randomColor));
    this.setScale(0.8);
  }

  /**
   * Aplica efeitos de amuletos ao projétil
   * @param {Array} inventory - Array de amuletos do player
   */
  applyAmuletEffects(inventory) {
    inventory.forEach(amulet => {
      switch (amulet.type) {
        case 'damage':
          this.damage += amulet.value;
          this.setScale(1.2);
          break;
        case 'ricochet':
          this.hasRicochet = true;
          this.maxBounces = amulet.value || 2;
          break;
        case 'slow':
          this.hasSlowEffect = true;
          break;
        case 'stun':
          this.hasStunEffect = true;
          break;
        case 'pierce':
          this.pierceCount = amulet.value || 2;
          this.setScale(1.3);
          break;
      }
    });
  }

  /**
   * Atualiza projétil (posição, colisões, etc)
   */
  update() {
    // Verifica se expirou
    if (Date.now() - this.createdAt > this.lifespan) {
      this.destroy();
      return;
    }

    // Efeito de glitch se tiver stun
    if (this.hasStunEffect && Math.random() < 0.1) {
      this.setPosition(
        this.x + Phaser.Math.Between(-2, 2),
        this.y + Phaser.Math.Between(-2, 2)
      );
    }
  }

  /**
   * Trata ricochete em paredes
   * @param {Phaser.Physics.Arcade.Body} wallBody - Corpo da parede
   */
  bounceOffWall(wallBody) {
    if (!this.hasRicochet || this.bounceCount >= this.maxBounces) {
      this.destroy();
      return;
    }

    this.bounceCount++;

    // Inverte velocidade apropriada
    if (Math.abs(this.vx) > Math.abs(this.vy)) {
      this.vx *= -0.8; // Perde 20% de velocidade
    } else {
      this.vy *= -0.8;
    }

    this.setVelocity(this.vx, this.vy);

    // Efeito visual de ricochete
    this.setTint(0xffaa00);
  }

  /**
   * Trata colisão com inimigo
   * @returns {Object} Objeto com dano e efeitos especiais
   */
  getCollisionData() {
    return {
      damage: this.damage,
      slowEffect: this.hasSlowEffect,
      stunEffect: this.hasStunEffect,
    };
  }
}
