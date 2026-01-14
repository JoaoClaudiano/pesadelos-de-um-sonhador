/**
 * CONSOLE COMMANDS - Pesadelos de um Sonhador
 * 
 * Copie e cole estes comandos no console do navegador (F12)
 * para testar e debugar o jogo rapidamente!
 */

// ============================================
// VERIFICAÇÃO INICIAL
// ============================================

// Ver se jogo carregou
window.game
// Deve retornar: Game object (não undefined)

// Ver todas as cenas
window.game.scene.scenes
// Deve retornar array com 3 cenas

// Ver cena atual
window.game.scene.isActive('RoomScene')
// Deve retornar: true


// ============================================
// ACESSAR ELEMENTOS DO JOGO
// ============================================

// Pegar referência da cena principal
const scene = window.game.scene.scenes[1]

// Acessar player
const player = scene.player
player  // Ver propriedades

// Ver saúde do player
player.health
player.maxHealth

// Ver inventário do player
player.inventory

// Ver inimigos
scene.enemies
scene.enemies.length  // Quantidade


// ============================================
// TESTAR MOVIMENTO
// ============================================

// Mover player para lado (testando física)
scene.player.setVelocityX(200)

// Mover para cima
scene.player.setVelocityY(-200)

// Parar de mover
scene.player.setVelocity(0, 0)

// Teletransportar player para posição
scene.player.setPosition(400, 300)


// ============================================
// TESTAR DISPARO
// ============================================

// Disparar manualmente
scene.player.shoot(
  scene.projectiles,
  1,  // direção X (1 = direita)
  0,  // direção Y (0 = sem movimento vertical)
  scene
)

// Ver projéteis ativos
scene.projectiles.children.entries

// Ver quantidade de projéteis
scene.projectiles.children.entries.length


// ============================================
// TESTAR DANO
// ============================================

// Dar dano ao player
scene.player.takeDamage(10)

// Ver vida depois
scene.player.health

// Matar player instantaneamente
scene.player.health = 0
scene.player.update(0, 16)  // Force update


// ============================================
// TESTAR AMULETOS
// ============================================

// Coletar amuleto manualmente
scene.player.collectAmulet({
  type: 'health',
  value: 20
})

// Ver inventário
scene.player.inventory

// Coletar todos os tipos
scene.player.collectAmulet({ type: 'speed', value: 30 })
scene.player.collectAmulet({ type: 'damage', value: 5 })
scene.player.collectAmulet({ type: 'ricochet', value: 2 })


// ============================================
// TESTAR LUCIDEZ
// ============================================

// Ver lucidez atual
scene.lucidezSystem.lucidez

// Aumentar lucidez
scene.lucidezSystem.gainLucidez('normal')

// Diminuir lucidez
scene.lucidezSystem.loseLucidez(10)

// Setar lucidez diretamente (teste)
scene.lucidezSystem.setLucidez(50)
scene.lucidezSystem.setLucidez(25)
scene.lucidezSystem.setLucidez(100)

// Ver estado atual
scene.lucidezSystem.getStatusText()

// Ver cor atual
scene.lucidezSystem.getLucidezColor()


// ============================================
// TESTAR EFEITOS DE GLITCH
// ============================================

// Ativar glitch
scene.glitchEffects.setEnabled(true)

// Desativar glitch
scene.glitchEffects.setEnabled(false)

// Mudar intensidade (0-100)
scene.glitchEffects.setIntensity(50)
scene.glitchEffects.setIntensity(100)

// Triggerar efeito específico
scene.glitchEffects.triggerEffect('scanline')
scene.glitchEffects.triggerEffect('chromaAberration')
scene.glitchEffects.triggerEffect('inversion')
scene.glitchEffects.triggerEffect('pixelation')
scene.glitchEffects.triggerEffect('screenTear')
scene.glitchEffects.triggerEffect('doubleVision')


// ============================================
// TESTAR ÁUDIO
// ============================================

// Checar se áudio está disponível
scene.soundManager.isAudioAvailable()

// Ativar/desativar sons
scene.soundManager.setSoundsEnabled(true)
scene.soundManager.setSoundsEnabled(false)

// Testar efeitos sonoros individuais
scene.soundManager.playShootSound()
scene.soundManager.playDamageSound()
scene.soundManager.playCollectSound()
scene.soundManager.playEnemyDefeatedSound()
scene.soundManager.playSalaVictorySound()
scene.soundManager.playDeathSound()
scene.soundManager.playGlitchSound()
scene.soundManager.playSlowSound()
scene.soundManager.playStunSound()

// Mudar volume
scene.soundManager.setMasterVolume(0.5)  // 50%
scene.soundManager.setMasterVolume(1.0)  // 100%


// ============================================
// TESTAR INIMIGOS
// ============================================

// Ver inimigos na sala
scene.enemies

// Ver propriedades de primeiro inimigo
if (scene.enemies.length > 0) {
  const enemy = scene.enemies[0]
  console.log(`Health: ${enemy.health}`)
  console.log(`Damage: ${enemy.damage}`)
  console.log(`Speed: ${enemy.speed}`)
  console.log(`Type: ${enemy.enemyType}`)
}

// Matar todos os inimigos
scene.enemies.forEach(e => e.health = 0)

// Dar dano a todos os inimigos
scene.enemies.forEach(e => e.takeDamage(10))

// Aplicar slow em todos
scene.enemies.forEach(e => e.applySlow(2000))

// Aplicar stun em todos
scene.enemies.forEach(e => e.applyStun(1500))


// ============================================
// TESTAR SALAS
// ============================================

// Ver sala atual
scene.currentRoom

// Ver layout da sala
scene.currentRoom.layout

// Ver lista de paredes
scene.currentRoom.layout.walls

// Ver número de sala
scene.currentRoomNumber

// Forçar próxima sala
scene.loadRoom()

// Forçar sala específica (tipo)
scene.loadRoom('normal')
scene.loadRoom('elite')
scene.loadRoom('boss')


// ============================================
// TESTAR GERADORES PROCEDURAIS
// ============================================

// Ver gerador de salas
scene.roomGenerator

// Ver seed da run
scene.runSeed

// Ver RNG
scene.rng

// Testar RNG manualmente
scene.rng.next()        // 0-1
scene.rng.nextInt(1, 6) // Dado de 6 lados
scene.rng.chance(0.5)   // 50% chance
scene.rng.pick([1, 2, 3, 4, 5])  // Escolher aleatório


// ============================================
// TESTAR ESTATÍSTICAS
// ============================================

// Ver estatísticas da run
scene.stats

// Ver salas conquistadas
scene.stats.roomsCleared

// Ver inimigos derrotados
scene.stats.enemiesDefeated

// Ver dano total
scene.stats.totalDamageDealt
scene.stats.totalDamageReceived


// ============================================
// TRANSIÇÕES DE CENA
// ============================================

// Ir para menu
scene.scene.start('MenuScene')

// Ir para game over
scene.scene.start('GameOverScene', scene.stats)

// Reiniciar jogo
scene.scene.restart()


// ============================================
// DEBUGGING AVANÇADO
// ============================================

// Monitorar saúde em tempo real
setInterval(() => {
  console.log(`❤️ Saúde: ${scene.player.health}/${scene.player.maxHealth}`)
}, 500)

// Monitorar lucidez em tempo real
setInterval(() => {
  console.log(`◐ Lucidez: ${scene.lucidezSystem.lucidez.toFixed(1)}%`)
}, 500)

// Monitorar inimigos em tempo real
setInterval(() => {
  console.log(`👹 Inimigos: ${scene.enemies.length}`)
}, 500)

// Parar monitoramento (executar isto depois)
// Recarregar página (Ctrl+R)


// ============================================
// CRIAR RELATÓRIO COMPLETO
// ============================================

function gameReport() {
  console.log('=== RELATÓRIO DO JOGO ===')
  console.log(`Player HP: ${scene.player.health}/${scene.player.maxHealth}`)
  console.log(`Lucidez: ${scene.lucidezSystem.lucidez.toFixed(1)}%`)
  console.log(`Sala: ${scene.currentRoomNumber}`)
  console.log(`Inimigos vivos: ${scene.enemies.length}`)
  console.log(`Projectis ativos: ${scene.projectiles.children.entries.length}`)
  console.log(`Amuletos coletados: ${scene.player.inventory.length}`)
  console.log(`Seed: ${scene.runSeed}`)
  console.log(`FPS: ${Math.round(window.game.loop.actualFps)}`)
  console.log('========================')
}

gameReport()  // Executar relatório


// ============================================
// ATALHOS ÚTEIS
// ============================================

// Cria variável "s" para cena rápida
s = window.game.scene.scenes[1]

// Agora pode usar:
s.player.health
s.enemies.length
s.lucidezSystem.lucidez

// Matar player rápido
s.player.health = 0

// Próxima sala
s.loadRoom()

// Boss time!
s.loadRoom('boss')

// Ver status
s.lucidezSystem.getStatusText()


// ============================================
// CHEATS E TESTES
// ============================================

// GODMODE (invulnerável)
const original = scene.player.takeDamage
scene.player.takeDamage = function() {} // Não toma dano

// Desativar godmode
scene.player.takeDamage = original

// INFINITE AMMO
// Não tem munição, crio quantos quiser
for (let i = 0; i < 50; i++) {
  scene.player.shootCooldown = -1000  // Sempre pode disparar
}

// TODOS OS AMULETOS
const amuletos = [
  { type: 'health', value: 20 },
  { type: 'speed', value: 30 },
  { type: 'damage', value: 5 },
  { type: 'ricochet', value: 2 },
  { type: 'slow', value: 1 },
  { type: 'stun', value: 1 },
  { type: 'pierce', value: 2 }
]
amuletos.forEach(a => scene.player.collectAmulet(a))

// JUMP TO LEVEL X
function jumpToLevel(n) {
  scene.currentRoomNumber = n - 1
  scene.loadRoom()
}
jumpToLevel(50)  // Ir para sala 50


// ============================================
// TESTES AUTOMÁTICOS
// ============================================

// Teste de stress: Spawnar muitos inimigos
for (let i = 0; i < 20; i++) {
  scene.enemySpawner({ x: Math.random() * 800, y: Math.random() * 600 }, 'normal')
}

// Teste FPS: Jogar por 10 segundos e relatar
setTimeout(() => {
  console.log(`FPS Final: ${Math.round(window.game.loop.actualFps)}`)
}, 10000)
