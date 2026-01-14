/**
 * Enemy.js - Classe para inimigos (traumas)
 * Tipos: normal, elite, boss
 * Mecânicas: perseguição, padrões de movimento, inteligência IA
 */

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'normal') {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Tipo e dificuldade
    this.enemyType = type; // 'normal', 'elite', 'boss'
    this.setupStats(type);

    // Movimento e IA
    this.direction = { x: 0, y: 0 };
    this.speed = this.baseSpeed;
    this.chaseRange = 200;
    this.patternTimer = 0;
    this.patternDuration = Phaser.Math.Between(2000, 4000);

    // Física
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setDrag(0.99);

    // Efeitos de status
    this.isSlowed = false;
    this.slowDuration = 0;
    this.isStunned = false;
    this.stunDuration = 0;

    // Aparência
    this.updateVisuals();
  }

  /**
   * Define stats baseado no tipo de inimigo
   * @param {string} type - Tipo do inimigo
   */
  setupStats(type) {
    const stats = {
      normal: { health: 30, damage: 5, speed: 100, color: 0x666666 },
      elite: { health: 60, damage: 10, speed: 120, color: 0xff6600 },
      boss: { health: 150, damage: 20, speed: 80, color: 0xff0066 },
    };

    const stat = stats[type] || stats.normal;
    this.health = stat.health;
    this.maxHealth = stat.health;
    this.damage = stat.damage;
    this.baseSpeed = stat.speed;
    this.color = stat.color;
  }

  /**
   * Atualiza visuais baseado no tipo
   */
  updateVisuals() {
    this.setTint(this.color);
    if (this.enemyType === 'elite') {
      this.setScale(1.3);
    } else if (this.enemyType === 'boss') {
      this.setScale(1.8);
    } else {
      this.setScale(1);
    }
  }

  /**
   * Lógica principal de movimento (perseguição ou padrão)
   * @param {Player} player - Referência ao player
   * @param {number} delta - Tempo desde último frame
   */
  update(player, delta) {
    // Atualizar efeitos de status
    this.updateStatusEffects(delta);

    // Se está stunned, não se move
    if (this.isStunned) {
      this.setVelocity(0, 0);
      return;
    }

    // Calcular distância até player
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player.x,
      player.y
    );

    // Comportamento baseado em distância
    if (distance < this.chaseRange) {
      this.chase(player);
    } else {
      this.patrol();
    }

    // Aplicar velocidade
    const velocity = this.isSlowed ? this.speed * 0.5 : this.speed;
    this.setVelocity(this.direction.x * velocity, this.direction.y * velocity);
  }

  /**
   * Persegue o player
   * @param {Player} player - Referência ao player
   */
  chase(player) {
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      player.x,
      player.y
    );
    this.direction.x = Math.cos(angle);
    this.direction.y = Math.sin(angle);
  }

  /**
   * Patrulha em padrão (movimento aleatório ou padrão fixo)
   */
  patrol() {
    this.patternTimer += 16; // ~60fps

    if (this.patternTimer > this.patternDuration) {
      // Novo padrão
      const angle = Math.random() * Math.PI * 2;
      this.direction.x = Math.cos(angle);
      this.direction.y = Math.sin(angle);
      this.patternTimer = 0;
      this.patternDuration = Phaser.Math.Between(2000, 4000);
    }
  }

  /**
   * Atualiza efeitos de status (slow, stun)
   * @param {number} delta - Tempo desde último frame
   */
  updateStatusEffects(delta) {
    // Atualizar slow
    if (this.isSlowed) {
      this.slowDuration -= delta;
      if (this.slowDuration <= 0) {
        this.isSlowed = false;
        this.clearTint();
      } else {
        this.setTint(0x0099ff); // Cor de slow
      }
    }

    // Atualizar stun
    if (this.isStunned) {
      this.stunDuration -= delta;
      if (this.stunDuration <= 0) {
        this.isStunned = false;
        this.clearTint();
      } else {
        // Efeito de glitch durante stun
        if (Math.random() < 0.1) {
          this.setPosition(
            this.x + Phaser.Math.Between(-3, 3),
            this.y + Phaser.Math.Between(-3, 3)
          );
        }
        this.setTint(0xffff00); // Cor de stun
      }
    }
  }

  /**
   * Recebe dano
   * @param {number} damage - Quantidade de dano
   */
  takeDamage(damage) {
    this.health -= damage;
    // Piscar quando recebe dano
    this.setTint(0xff0000);
    setTimeout(() => this.clearTint(), 100);
  }

  /**
   * Aplica efeito de slow
   * @param {number} duration - Duração em ms
   */
  applySlow(duration = 2000) {
    this.isSlowed = true;
    this.slowDuration = duration;
  }

  /**
   * Aplica efeito de stun
   * @param {number} duration - Duração em ms
   */
  applyStun(duration = 1500) {
    this.isStunned = true;
    this.stunDuration = duration;
  }

  /**
   * Verifica se está vivo
   */
  isAlive() {
    return this.health > 0;
  }
}
