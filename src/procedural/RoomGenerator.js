/**
 * RoomGenerator.js - Geração procedural de salas
 * Cria layouts, inimigos e itens baseado em RNG com seed
 */

import { globalRNG } from './RNG.js';

export class RoomGenerator {
  constructor(width = 800, height = 600, rng = null) {
    this.width = width;
    this.height = height;
    this.rng = rng || globalRNG;

    // Configuração de salas
    this.tileSize = 32;
    this.marginX = 50;
    this.marginY = 50;

    // Tipos de salas
    this.roomTypes = {
      normal: { enemyCount: 3, eliteCount: 0, itemCount: 2, difficulty: 1 },
      elite: { enemyCount: 2, eliteCount: 2, itemCount: 3, difficulty: 1.5 },
      boss: { enemyCount: 0, eliteCount: 0, itemCount: 4, difficulty: 2 },
    };

    // Pool de amuletos disponíveis
    this.amuletPool = [
      { type: 'health', value: 20, rarity: 0.4 },
      { type: 'speed', value: 30, rarity: 0.3 },
      { type: 'damage', value: 5, rarity: 0.25 },
      { type: 'ricochet', value: 2, rarity: 0.15 },
      { type: 'slow', value: 1, rarity: 0.1 },
      { type: 'stun', value: 1, rarity: 0.1 },
      { type: 'pierce', value: 2, rarity: 0.05 },
    ];
  }

  /**
   * Gera layout completo de uma sala
   * @param {string} type - Tipo de sala ('normal', 'elite', 'boss')
   * @returns {Object} Estrutura da sala
   */
  generate(type = 'normal') {
    const config = this.roomTypes[type];
    if (!config) {
      console.warn(`Tipo de sala desconhecido: ${type}, usando normal`);
      return this.generate('normal');
    }

    const room = {
      type: type,
      layout: this.generateLayout(),
      enemies: this.generateEnemies(
        config.enemyCount,
        config.eliteCount,
        type
      ),
      items: this.generateItems(config.itemCount),
      boss: type === 'boss' ? this.generateBoss() : null,
    };

    return room;
  }

  /**
   * Gera layout das paredes e passagens da sala
   * @returns {Object} Mapa com posições de paredes
   */
  generateLayout() {
    const layout = {
      walls: [],
      doors: [],
      spawnPoint: { x: this.width / 2, y: this.height - 100 },
      exitPoint: { x: this.width / 2, y: 100 },
    };

    // Criar paredes perimetrais
    // Parede superior
    for (let x = 0; x < this.width; x += this.tileSize) {
      layout.walls.push({ x: x, y: 20, width: this.tileSize, height: 40 });
    }

    // Parede inferior
    for (let x = 0; x < this.width; x += this.tileSize) {
      layout.walls.push({
        x: x,
        y: this.height - 60,
        width: this.tileSize,
        height: 40,
      });
    }

    // Parede esquerda
    for (let y = 60; y < this.height - 60; y += this.tileSize) {
      layout.walls.push({ x: 20, y: y, width: 40, height: this.tileSize });
    }

    // Parede direita
    for (let y = 60; y < this.height - 60; y += this.tileSize) {
      layout.walls.push({
        x: this.width - 60,
        y: y,
        width: 40,
        height: this.tileSize,
      });
    }

    // Gerar obstáculos aleatórios internos
    const obstacleCount = this.rng.nextInt(2, 5);
    for (let i = 0; i < obstacleCount; i++) {
      const x = this.rng.nextInt(150, this.width - 150);
      const y = this.rng.nextInt(150, this.height - 150);
      const width = this.rng.nextInt(40, 120);
      const height = this.rng.nextInt(40, 120);

      layout.walls.push({ x: x, y: y, width: width, height: height });
    }

    // Portas (abrem ao derrotar inimigos)
    layout.doors = [
      { x: this.width / 2 - 25, y: 0, width: 50, height: 20 },
      { x: this.width / 2 - 25, y: this.height - 20, width: 50, height: 20 },
    ];

    return layout;
  }

  /**
   * Gera lista de inimigos para a sala
   * @param {number} normalCount - Quantidade de inimigos normais
   * @param {number} eliteCount - Quantidade de inimigos elite
   * @param {string} roomType - Tipo de sala
   * @returns {Array} Lista de inimigos
   */
  generateEnemies(normalCount, eliteCount, roomType) {
    const enemies = [];
    const positions = this.generateSpawnPositions(normalCount + eliteCount);

    // Inimigos normais
    for (let i = 0; i < normalCount; i++) {
      enemies.push({
        type: 'normal',
        position: positions[i],
      });
    }

    // Inimigos elite
    for (let i = 0; i < eliteCount; i++) {
      enemies.push({
        type: 'elite',
        position: positions[normalCount + i],
      });
    }

    return enemies;
  }

  /**
   * Gera boss da sala
   * @returns {Object} Configuração do boss
   */
  generateBoss() {
    return {
      type: 'boss',
      position: {
        x: this.width / 2,
        y: this.height / 2,
      },
      bossType: this.rng.pick([
        'Pesadelo da Escuridão',
        'Fúria dos Medos',
        'Espectro do Trauma',
      ]),
    };
  }

  /**
   * Gera itens/amuletos para a sala
   * @param {number} count - Quantidade de itens
   * @returns {Array} Lista de itens
   */
  generateItems(count) {
    const items = [];
    const positions = this.generateSpawnPositions(count);

    for (let i = 0; i < count; i++) {
      // Selecionar amuleto com probabilidade baseada em raridade
      let amulet = this.selectAmuletByRarity();

      items.push({
        amulet: amulet,
        position: positions[i],
      });
    }

    return items;
  }

  /**
   * Seleciona um amuleto baseado em raridade
   * @returns {Object} Amuleto selecionado
   */
  selectAmuletByRarity() {
    const roll = this.rng.next();
    let accumulated = 0;

    for (let amulet of this.amuletPool) {
      accumulated += amulet.rarity;
      if (roll <= accumulated) {
        return { ...amulet };
      }
    }

    return this.amuletPool[0];
  }

  /**
   * Gera posições aleatórias seguras para spawn
   * @param {number} count - Quantidade de posições
   * @returns {Array} Array de posições {x, y}
   */
  generateSpawnPositions(count) {
    const positions = [];
    const minDist = 100; // Distância mínima entre spawns

    for (let i = 0; i < count; i++) {
      let pos;
      let valid = false;
      let attempts = 0;

      while (!valid && attempts < 10) {
        pos = {
          x: this.rng.nextInt(this.marginX, this.width - this.marginX),
          y: this.rng.nextInt(this.marginY, this.height - this.marginY),
        };

        // Verificar distância com outras posições
        valid = positions.every(
          p =>
            Math.hypot(p.x - pos.x, p.y - pos.y) > minDist
        );
        attempts++;
      }

      if (valid) {
        positions.push(pos);
      }
    }

    return positions;
  }

  /**
   * Retorna seed atual do RNG
   */
  getSeed() {
    return this.rng.seed;
  }

  /**
   * Define novo RNG com seed
   * @param {number} seed - Seed nova
   */
  setSeed(seed) {
    this.rng.reset(seed);
  }
}
