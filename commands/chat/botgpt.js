var name = 'botgpt'
var aliases = ['botgpt,', 'bgpt', 'botGPT'] // I want to add something so players can do botgpt, since I tend to do it but I'm not sure how
var description = 'AI says things'
var usage = '{prefix}botgpt <prompt>'
var enabled = true
var hidden = false
var fs = require('fs')
var util = require('../../util.js')
let generating_response = false

require('dotenv').config()

const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

function loadVariables(){
    try {
        var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
        let botStyles = config.botgpt.styles
        let styleIndex = config.botgpt.active
        let activeStyle = botStyles[styleIndex]
        return activeStyle
    } catch (error) {

        console.error('Error loading config:', error)
        return null
    }
}

async function execute(bot, cmd, username, args, handler) {
    // Loading stuff from the config file
    initPrompt = loadVariables()
    
    // whatever code we want
    let msg = args.toString().replaceAll(',',' ')
    msg = msg.replaceAll('‚', ',') //Replacing unicode comma with normal cause it might mess with chatgpt

    if (!generating_response){
        generating_response = true
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [ // Initializes the bot with its personality
                    {'role': 'system', 'content': 'You will respond as '+ bot.username + ' I am ' + username + '. ' + initPrompt},
                    // sends the user message
                    {'role': 'user', 'content': msg}
                ],
                max_tokens: 256
            })

            // Gets the chatgpt response from returned json format
            answer = response.choices[0].message.content
            // Bot says message then changes it so that it is no longer gererating a response
            bot.chat(answer)
            generating_response = false
        } catch (error) {
            console.error('Error:', error)
            bot.chat('I\'m sorry, there was a problem.')
            generating_response = false
        }
        } else {
        bot.chat('/msg ' + username + ' please wait for the previous response to finish')
        }
    }

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute