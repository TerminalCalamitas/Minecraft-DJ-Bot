
// PVP bullshit
let guardPos = null

bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return

  setTimeout(() => {
    const sword = bot.inventory.items().find(item => item.name.includes('sword'))
    if (sword) bot.equip(sword, 'hand')
  }, 150)
})

bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return

  setTimeout(() => {
    const shield = bot.inventory.items().find(item => item.name.includes('shield'))
    if (shield) bot.equip(shield, 'off-hand')
  }, 250)
})

bot.on('stoppedAttacking', () => {
  if (guardPos) {
    cmd_handler.moveToGuardPos()
    console.log("Stopped attacking, moving to guard position...")
  }
})

bot.on('physicsTick', () => {
  if (bot.pvp.target) return
  if (bot.pathfinder.isMoving()) return

  const entity = bot.nearestEntity()

  if (!entity) return
  if (entity.type !== 'hostile' && entity.type !== 'player' || (master_uuids.includes(entity.uuid))) return
  if ((entity.position.y < bot.entity.position.y - 2) || entity.position.distanceTo(bot.entity.position) > 16) return

  bot.lookAt(entity.position.offset(0, entity.height, 0))

})
 
bot.on('physicsTick', () => {
  if (!guardPos) return

  const filter = e => e.type === 'hostile' && e.position.distanceTo(bot.entity.position) < 16 &&
                      e.mobType !== 'Armor Stand' && (master_uuids.includes(entity.uuid))// Mojang classifies armor stands as mobs for some reason?

  const entity = bot.nearestEntity(filter)
  if (entity) {
    bot.pvp.attack(entity)
  }
})

bot.on('physicsTick', () => {
  if (!guardPos) return

  // TODO: Better filter || old crap from video not working at all or im stupid
  //const filter = e => entity.type === 'mob' && e.position.distanceTo(bot.entity.position)

  const entity = bot.nearestEntity()

  if (!entity) return
  if (entity.type !== 'hostile' && entity.type !== 'player') return

  if (entity.position.y < bot.entity.position.y - 2 || entity.position.y > bot.entity.position.y + 3 || entity.position.distanceTo(guardPos) > 20) return
  if (master_uuids.includes(entity.uuid)) return

  //console.log("I see " + entity.name + " " + entity.type + " " + entity.mobType)
  bot.pvp.attack(entity)

})


// Log errors and kick reasons:
bot.on('kicked', function (message) {
  console.log
})
bot.on('error', function (message) {
  console.log
})
bot.on('timedout', function(message) {
  console.log
})
// TODO: Sleep in bed
// AutoEat
bot.once('spawn', () => {
  bot.autoEat.options.priority = 'foodPoints'
  bot.autoEat.options.startAt = 19
  bot.autoEat.options.offhand = true
  //bot.autoEat.options.bannedFood.push('golden_apple', 'enchanted_golden_apple')
  
})

bot.on('autoeat_started', () => {
console.log('Eating...')
})

bot.on('health', () => {
if (bot.food === 20) bot.autoEat.disable()
else bot.autoEat.enable()
})
7