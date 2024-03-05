var name = 'tpa-to-me'
var aliases = ['tpatome', 'tpa']
var description = 'So I can make the bot move'
var usage = '{prefix}tpatome'
var enabled = true
var hidden = false

var util = require('./../../util.js')
var perms = require('./../../config.json').commands_perms


function execute(bot, cmd, username, args, handler) {
    if (!perms.includes(username)) {
        return bot.chat(util.errorMessage('You don\'t have the right!'))
    }
    bot.chat('/tpa ' + username)
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute