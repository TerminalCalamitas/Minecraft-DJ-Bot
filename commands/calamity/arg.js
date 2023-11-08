var name = "."
var aliases = ["dQw4w9WgXcQ"]
var description = "Who knows?"
var usage = "{prefix}command"
var enabled = true
var hidden = false

var util = require("./../../util.js")

function execute(bot, cmd, username, args, handler) {
    bot.chat("^Congrats I guess")
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute
