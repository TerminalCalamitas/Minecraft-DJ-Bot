var name = "convert"
var aliases = ["mtt","cv"]
var description = "convert midi file"
var usage = "{prefix}convert <File path>"
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
    var start = Date.now()
    const songsFolder = './songs';
    const fileList = fs.readdirSync(songsFolder).filter(file => path.extname(file) === '.mid')
    const listFiles = fs.readdirSync(songsFolder).filter(file => path.extname(file) === '.txt')
    //console.log(listFiles)
    console.log("sup im in the command")
    if(args.length > 0) {
        console.log("uh oh, args given")
        for (let i = 0; i < args.length; i++) {
            console.log("converting song " + i)
            var file = `./songs/${args[i]}`
            var filename = args[i]
            toNotebot(file, (filename, err) => {
                if (err || filename == undefined) {
                    console.log(util.errorMessage(err == undefined ? "Failed to parse midi file to notebot format" : err))
                    return
                } else {
                    bot.chat("Success")
                }
            })
        } 
    } else {
        console.log("no args")
        for (let i = 0; i < fileList.length; i++) {
            console.log("converting song " + i)
            var file = `./songs/${fileList[i]}`
            var filename = fileList[i]
            toNotebot(file, (filename, err) => {
                if (err || filename == undefined) {
                    console.log(util.errorMessage(err == undefined ? "Failed to parse midi file to notebot format" : err))
                    return
                } else {
                    bot.chat("Success")
                }
            })
        }      
    }
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.hidden = hidden
module.exports.execute = execute