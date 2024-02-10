var name = "playurl"
var aliases = ["purl","pu"]
var description = "Play a url instead of a file"
var usage = "{prefix}playurl <url>"
var enabled = true
var hidden = false

var util = require("./../../util.js")
var parser = require("./../../parser.js")
var config = require("./../../config.json")
var blockmapper = require("./../../block-mapper.js")
var download = require("./../../songdownloader.js").download
var toNotebot = require("./../../miditonotebot").toNotebot

var fs = require("fs")
var path = require("path")

function execute(bot, cmd, username, args, handler) {
    if (args.length == 0) {
        return bot.chat(util.errorMessage(`Usage: ${handler.prefix}playurl <url>`))
    }
    if (bot.player.gamemode != 0) {
        bot.chat(util.errorMessage("Bot is not in survival mode!"))
        return
    }
    if (parser.isPlaying() == true) {
        bot.chat(util.errorMessage("Bot is already playing a song"))
        return
    }
    if (parser.isTuning() == true) {
        bot.chat(util.errorMessage("Bot is tuning"))
        return
    }
}


module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute