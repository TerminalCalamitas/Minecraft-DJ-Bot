var name = "example"
var aliases = ["template"]
var description = "This command us an example"
var usage = "{prefix}example"
var enabled = true
var hidden = false

var util = require("./../../util.js")


function execute(bot, cmd, username, args, handler) {
    // whatever code we want
    bot.chat("yo i was supposed to remove this command")
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute