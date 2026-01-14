/**
 * RNG.js - Gerador de números pseudoaleatórios com seed
 * Permite reproduzibilidade de runs e mundo procedural consistente
 */

export class RNG {
  constructor(seed = null) {
    // Se não houver seed, usar timestamp
    this.seed = seed !== null ? seed : Math.floor(Math.random() * 1000000);
    this.current = this.seed;
  }

  /**
   * Gera próximo número pseudoaleatório (Linear Congruential Generator)
   * Retorna valor entre 0 e 1
   */
  next() {
    // Fórmula LCG (Linear Congruential Generator)
    // Parâmetros padrão usados em C++
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);

    this.current = (a * this.current + c) % m;
    return Math.abs(this.current) / m;
  }

  /**
   * Gera número inteiro entre min e max (inclusive)
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   */
  nextInt(min = 0, max = 1) {
    return Math.floor(this.next() * (max - min + 1) + min);
  }

  /**
   * Gera número entre min e max (float)
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   */
  nextFloat(min = 0, max = 1) {
    return this.next() * (max - min) + min;
  }

  /**
   * Retorna valor booleano com probabilidade dada
   * @param {number} probability - Probabilidade (0-1)
   */
  chance(probability = 0.5) {
    return this.next() < probability;
  }

  /**
   * Retira aleatoriamente um elemento de um array
   * @param {Array} array - Array para escolher
   */
  pick(array) {
    if (array.length === 0) return null;
    const index = this.nextInt(0, array.length - 1);
    return array[index];
  }

  /**
   * Embaralha um array (Fisher-Yates shuffle)
   * @param {Array} array - Array para embaralhar
   */
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Reseta o gerador com nova seed
   * @param {number} newSeed - Nova seed
   */
  reset(newSeed) {
    this.seed = newSeed;
    this.current = this.seed;
  }

  /**
   * Cria cópia do gerador com mesmo estado
   */
  clone() {
    const cloned = new RNG(this.seed);
    cloned.current = this.current;
    return cloned;
  }

  /**
   * Retorna estado atual
   */
  getState() {
    return {
      seed: this.seed,
      current: this.current,
    };
  }

  /**
   * Restaura estado anterior
   * @param {Object} state - Estado salvo
   */
  setState(state) {
    this.seed = state.seed;
    this.current = state.current;
  }
}

/**
 * RNG Global - Instância única para a aplicação
 */
export const globalRNG = new RNG();

/**
 * Factory para criar RNG com seed baseado em run
 * Permite consistência entre runs do mesmo seed
 * @param {number} runNumber - Número da run (ou timestamp)
 */
export function createRunRNG(runNumber) {
  return new RNG(runNumber);
}
