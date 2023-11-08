var mineflayer = require("mineflayer")
var fs = require("fs")
var cmd_handler = require("./command-handler.js")
var util = require("./util.js")
const autoeat = require('mineflayer-auto-eat').plugin
const pathfinder = require('mineflayer-pathfinder').pathfinder
const armormanager = require('mineflayer-armor-manager')
const pvp = require('mineflayer-pvp').plugin
var config = require("./config.json")

var botVersion = "1.2"

var dougregex = /\[\[(.+)\] (.+) -> me\] (.+)/
var master_uuids = ["54360a28-a59c-4006-8001-9ff8c80e4840", "dcc3ce4f-d0b2-42fc-92ce-b1157bd13670", "317f3cee-0d9e-4c47-9670-473e56830248", "9c4f3ae3-5dcf-4df6-a6c8-787dc801069b"]


var options = {
    username: config.bot.username || "BotGPT",
    auth: config.bot.auth || "microsoft",
    host: config.bot.host || "195.90.214.23",
    port: config.bot.port || 20262,
    checkTimeoutInterval: 5555*1000
}

var bot = mineflayer.createBot(options)
//cmd_handler()

bot.loadPlugin(autoeat)
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
bot.loadPlugin(armormanager)

bot.on("spawn", () => {
  console.log(`(${bot.username}) logged in!`)
  if (config.startup.active) {
    for (let i = 0; i < config.startup.messages.length; i++) {
      bot.chat(config.startup.messages[i])
    }
  }
  cmd_handler.load()

})

bot.on('message', async jsonMsg => {
  const msg = jsonMsg.toString()
  console.log(msg)
  if (dougregex.test(jsonMsg)) {
    var match = []
    match = msg.match(dougregex)
    if (match[3].startsWith(cmd_handler.prefix)) {
      message = match[3].replaceAll(",", "ß")
      let args = message.slice(cmd_handler.prefix.length).split(" ")
      let command = args.shift()

      if (cmd_handler.isCommand(command)) {
        let output = cmd_handler.execute(bot, command, match[2], args)
  
        if (output.status == "success") {
          if (typeof output.message == "string")
            bot.chat(util.infoMessage(output.message))
        } else if (output.status == "error") {
          if (typeof output.message == "string")
            bot.chat(util.errorMessage(output.message))
        }
      }
    }
  }
})


bot.on("chat", (username, message) => {
  if (message.includes("Welcome to the hub,") && config.mode.server == "smp") {
    bot.chat("/smp")
    bot.chat("/home")
  }

  if (message.startsWith(cmd_handler.prefix) && username != bot.username) {
    message = message.replaceAll(",", "ß")
    let args = message.slice(cmd_handler.prefix.length).split(" ")
    let command = args.shift()

    if (cmd_handler.isCommand(command)) {
      let output = cmd_handler.execute(bot, command, username, args)

      if (output.status == "success") {
        if (typeof output.message == "string")
          bot.chat(util.infoMessage(output.message))
      } else if (output.status == "error") {
        if (typeof output.message == "string")
          bot.chat(util.errorMessage(output.message))
      }
    }
  }

  /*
	if (message.startsWith(cmd_handler.prefix)) {
		let args = message.split(" ")
    let command = args.shift().slice(cmd_handler.prefix.length)
    
    let output = cmd_handler.execute(command, username, args, bot)
    if (output.status == "error") {
      let error = output.message
      //let code = output.code
      bot.chat(util.errorMessage(error))
    }
  }
  */
  
})

module.exports.getBot = () => {
	return bot
}

//--------------------------------Gurk old code

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
