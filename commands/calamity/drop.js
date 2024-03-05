var name = 'drop'
var aliases = ['gimmethedrugs']
var description = 'So I can get items'
var usage = '{prefix}gimmethedrugs'
var enabled = true
var hidden = false


const { exec } = require('child_process')
var util = require('./../../util.js')

var perms = require('./../../config.json').commands_perms

async function execute(bot, cmd, username, args, handler) {
  if (!perms.includes(username))
    return bot.chat(util.errorMessage('No permission to use this command.'))

  await bot.lookAt(bot.players[username].entity.position)
  bot.chat(`I am now looking at you, ${username}`)
  const botItems = bot.inventory
    .items()
  bot.chat(`I am about to drop ${botItems.length} items`)
  for (const item of botItems) {
    await bot.tossStack(item)
  }
}



module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute