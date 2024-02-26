var name = "peermessage"
var aliases = ["tor","p2p"]
var description = "Sends a message to another player through the bot"
var usage = "{prefix}peermessage <reciever> <message>"
var enabled = true
var hidden = false

var util = require("./../../util.js")


function execute(bot, cmd, username, args, handler) {
    // get first element in args as other person's username
    const reciever = args.shift()
    
    // make rest of message into a string
    let oldmsg = args.toString().replaceAll(","," ")
    let msg = oldmsg.replaceAll("ß", ",")
    
    // log the username and message in case of bad message
    console.log(username + " said " + msg + " to " + recieve)
    bot.chat("/msg " + reciever + " (This is a message from another player) " + msg)
    bot.chat("/msg " + username + " Message sent.")
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute