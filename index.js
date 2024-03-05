// Using vars for other files
var cmd_handler = require('./command-handler.js')
var util = require('./util.js')
var config = require('./config.json')

// Using const for external dependancies
const fs = require('fs')
const { sleep } = require('openai/core.js')
const mineflayer = require('mineflayer')
const autoeat = require('mineflayer-auto-eat').plugin
const pathfinder = require('mineflayer-pathfinder').pathfinder
const armormanager = require('mineflayer-armor-manager')
const pvp = require('mineflayer-pvp').plugin
const readline = require('node:readline') 


// Now this is setting up variables for the runtime
const rl = readline.createInterface({ // creates our readline interface with our console as input and output
  input: process.stdin,
  output: process.stdout
})

var botVersion = '1.3'

var serverRegex = new RegExp(config.server.msgRegex)
var owner_uuids = config.owners

console.log('Loading Options')
// Will load options from runtime args or if they don't exist, load from the config
var options = {
    host: process.argv[3] || config.bot.host,
    port: parseInt(process.argv[4]) ||config.bot.port,
    username: process.argv[2] || config.bot.username,
    auth: process.argv[5] || config.bot.auth,
    version: '1.20.4',
    checkTimeoutInterval: 32*1000
}

//Simple logging for debuging in case a bot isn't launching
console.log('Creating bot')
var bot = mineflayer.createBot(options)
console.log('Loading plugins')
bot.loadPlugin(autoeat)
console.log('Loading plugins.')
bot.loadPlugin(pathfinder)
console.log('Loading plugins..')
bot.loadPlugin(pvp)
console.log('Loading plugins...')
bot.loadPlugin(armormanager)
console.log('Plugins Loaded')

bot.on('resourcePack', () => { // resource pack sent by server
  bot.acceptResourcePack()
})

bot.on('spawn', () => {
  console.log(`(${bot.username}) running Minecraft-DJ-Bot v${botVersion} logged in!`)
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
  if (serverRegex.test(jsonMsg)) {
    var match = []
    match = msg.match(serverRegex)
    if (match[3].startsWith(cmd_handler.prefix)) {
      message = match[3].replaceAll(',', '‚')
      let args = message.slice(cmd_handler.prefix.length).split(' ')
      let command = args.shift()

      if (cmd_handler.isCommand(command)) {
        let output = cmd_handler.execute(bot, command, match[2], args)
  
        if (output.status == 'success') {
          if (typeof output.message == 'string')
            bot.chat(util.infoMessage(output.message))
        } else if (output.status == 'error') {
          if (typeof output.message == 'string')
            bot.chat(util.errorMessage(output.message))
        }
      }
    }
  }
})


bot.on('chat', (username, message) => {
  if (message.includes('Welcome to the hub,') && config.mode.server == 'smp') {
    bot.chat('/smp')
    bot.chat('/home')
  }

  if (message.startsWith(cmd_handler.prefix) && username != bot.username) {
    send_command(username, message)
  }
})

rl.on('line', (line) => {
  readline.moveCursor(process.stdout, 0, -1) // move cursor up one line
  readline.clearScreenDown(process.stdout) // clear all the lines below the cursor (i.e. the last line we entered)

  line = line.toString()
  
  // if (line.startsWith(cmd_handler.prefix)) {
  //   send_command(line.toString()) // sends the line entered to command handler
  // } else {
  //   console.log(line)
  //   console.log('Message must start with ' + cmd_handler.prefix)
  // }
})

// I replace the commas in a message with a unicode character that looks the same. NOTE: this might not work on old versions of minecraft.
function send_command (username, message) {
  message = message.replaceAll(',', '‚') 
  let args = message.slice(cmd_handler.prefix.length).split(' ')
  let command = args.shift()

  if (cmd_handler.isCommand(command)) {
    let output = cmd_handler.execute(bot, command, username, args)

    if (output.status == 'success' && typeof output.message == 'string') {
      bot.chat(util.infoMessage(output.message))
    } else if (output.status == 'error' && typeof output.message == 'string') {
      bot.chat(util.errorMessage(output.message))
    }
  }
}

module.exports.getBot = () => {
	return bot
}