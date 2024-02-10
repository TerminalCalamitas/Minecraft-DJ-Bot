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