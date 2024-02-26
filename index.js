var mineflayer = require("mineflayer")
var fs = require("fs")
var cmd_handler = require("./command-handler.js")
var util = require("./util.js")

const autoeat = require('mineflayer-auto-eat').plugin
const pathfinder = require('mineflayer-pathfinder').pathfinder
const armormanager = require('mineflayer-armor-manager')
const pvp = require('mineflayer-pvp').plugin
const readline = require('node:readline') 

const rl = readline.createInterface({ // creates our readline interface with our console as input and output
  input: process.stdin,
  output: process.stdout
})

var config = require("./config.json")
const { sleep } = require("openai/core.js")

var botVersion = "1.3"

var dougregex = /\[\[(.+)\] (.+) -> me\] (.+)/
var master_uuids = ["54360a28-a59c-4006-8001-9ff8c80e4840", "dcc3ce4f-d0b2-42fc-92ce-b1157bd13670", "317f3cee-0d9e-4c47-9670-473e56830248", "9c4f3ae3-5dcf-4df6-a6c8-787dc801069b"]

console.log("Loading Options")
var options = {
    username: config.bot.username || "BotGPT",
    auth: config.bot.auth || "microsoft",
    host: config.bot.host || "195.90.214.23",
    port: config.bot.port || 20262,
    checkTimeoutInterval: 5555*1000
}

console.log("Creating bot")
var bot = mineflayer.createBot(options)
//cmd_handler()

console.log("Loading plugins")
bot.loadPlugin(autoeat)
console.log("Loading plugins.")
bot.loadPlugin(pathfinder)
console.log("Loading plugins..")
bot.loadPlugin(pvp)
console.log("Loading plugins...")
bot.loadPlugin(armormanager)
console.log("Plugins Loaded")
/*for(var i = 0; i < 100; i++) {
  sleep(2000)
}*/ // I don't know why I did this. Was it important?

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
  // if (message.includes("Welcome to the hub,") && config.mode.server == "smp") {
  //   bot.chat("/smp")
  //   bot.chat("/home")
  // }

  if (message.startsWith(cmd_handler.prefix) && username != bot.username) {
    send_command(message)
  }
})

rl.on('line', (line) => {
  readline.moveCursor(process.stdout, 0, -1) // move cursor up one line
  readline.clearScreenDown(process.stdout) // clear all the lines below the cursor (i.e. the last line we entered)

  line = line.toString()
  if (line.startsWith(cmd_handler.prefix)) {
    send_command(line.toString()) // sends the line entered to command handler
  } else {
    console.log("Message must start with command prefix.")
  }
})

function send_command (message) {
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

module.exports.getBot = () => {
	return bot
}