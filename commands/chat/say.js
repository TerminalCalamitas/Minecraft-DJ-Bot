var name = 'say'
var aliases = ['s']
var description = 'Says things'
var usage = '{prefix}say <message>'
var enabled = true
var hidden = false

var util = require('../../util.js')
var perms = require('../../config.json').commands_perms


function execute(bot, cmd, username, args, handler) {
    if (!perms.includes(username)) {
        return bot.chat(util.errorMessage('No permisson to use this command.'))
    }

    // whatever code we want
    let msg = args.toString().replaceAll(',',' ')
    bot.chat(msg)
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute