var name = "songs"
var aliases = ["songlist"]
var description = "Says all available songs in chat"
var usage = "{prefix}songs <page number>"
var enabled = true
var hidden = false

var util = require("./../../util.js")
var config = require("./../../config.json")
var fs = require("fs")

var songlist = []
var pagelength = config.settings.song_list_length
var pages = 0

function execute(bot, cmd, username, args, handler) {
    updateList()
    var i = 0
    if (args.length == 0) {
        bot.chat(`There are ${pages} pages of songs, use ${usage} to view them`)
    } else {
        var songpage = `Page ${args[0]} | `
        for (var i = 1;  i < pagelength; i++) {
            songpage += songlist[i + (pagelength * args[0])]
            songpage += ` | `
        }
        bot.chat(songpage)
    }
}

function updateList() {
    var files = fs.readdirSync("./songs/")
    files.filter((file) => file.endsWith(".txt"))
    var i = 0
    files.forEach((file) => {
        songlist[i] = file
        i++
    })

    pages = Math.ceil(i / pagelength)
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute