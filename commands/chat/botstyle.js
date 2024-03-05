var name = 'style'
var aliases = ['stl']
var description = 'Changes how botgpt responds'
var usage = '{prefix}style <style-name>'
var enabled = true
var hidden = false

var util = require('../../util.js')

const fs = require('fs')

const configFile = './config.json'

function execute(bot, cmd, username, args, handler) {
  let activeStyle = 0

  switch (args[0]) {
      case 'default':
          activeStyle = 0
          bot.chat('I\'m back to normal')
          break
  
      case 'frat-bro':
          activeStyle = 1
          bot.chat('What\'s up bro?')
          break
  
      case 'pirate':
          activeStyle = 2
          bot.chat('Ahoy me mateys')
          break
  
      case 'billy':
          activeStyle = 3
          bot.chat('Hi! Billy Mays here!')
          break
  
      case 'mario':
          activeStyle = 4
          bot.chat('It\'s-a me!')
          break
  
      case 'guide':
          activeStyle = 5
          bot.chat('How may I be of assistance?')
          break
  
      default:
          if (username !== 'Admiral_Porg') {
              bot.chat('/msg ' + username + ' !style <style> | Styles available: default, frat-bro, pirate, billy, mario, or guide')
          }
          break
  }
  
  console.log(activeStyle)
  
  try {
      const data = fs.readFileSync(configFile, 'utf8')
  
      // Parse the JSON data
      const config = JSON.parse(data)
  
      // Modify the desired property
      config.botgpt.active = activeStyle
  
      // Convert the modified config object back to JSON string
      const updatedConfig = JSON.stringify(config, null, 2)
  
      // Write the updated JSON string back to the file
      fs.writeFile(configFile, updatedConfig, 'utf8', (err) => {
          if (err) {
              console.error(`Error writing ${configFile}: ${err}`)
              return
          }
  
          console.log(`Successfully updated ${configFile}`)
      })
  } catch (err) {
      console.error(`Error reading ${configFile}: ${err}`)
  }
    //fs.closeSync(configFile)
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute