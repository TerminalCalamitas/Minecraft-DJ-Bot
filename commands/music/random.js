var name = "playrandom"
var aliases = ["pr"]
var description = "Play a random notebot song"
var usage = "{prefix}playrandom"
var enabled = true
var shuffle = false

var fs = require("fs")

var blockmapper = require("./../../block-mapper.js")
var parser = require("./../../parser.js")
var util = require("./../../util.js")

function execute(bot, cmd, username, args, handler) {
    /*
	if(args.length == 0) {
		bot.chat(util.errorMessage(`Usage: ${handler.prefix}play <song>`))
		return
	}
    */
	if(bot.player.gamemode != 0) {
		bot.chat(util.errorMessage("Bot is not in survival mode!"))
		return
	}
	if(parser.isPlaying() == true) {
		bot.chat(util.errorMessage("Bot is already playing a song"))
		return
	}
	if(parser.isTuning() == true) {
		bot.chat(util.errorMessage("Bot is tuning"))
		return
	}

    shuffle = true

    var files = fs.readdirSync("./songs/")
    files.filter((file) => file.endsWith(".txt"))
    // pick random file
    var file = files[Math.floor(Math.random() * files.length)]
    bot.chat(util.infoMessage(`Picked random song: &b${file.replace(".txt", "")}`))
    file = `./songs/${file}`
	if(!file.endsWith(".txt")) {
		file += ".txt"
	}

	if(!parser.isValidFile(file)) {
		bot.chat(util.errorMessage(`${file} appears to be a invalid notebot file`))
		return
	}

	var test = file.match(/\\/g) 
	test == null ? 0 : test

	if(file.match(/\//g).length > 2 || test > 0) {// so people dont try to go outside of the ./songs/ directory
		bot.chat(util.errorMessage("no dont even try with that dir"))
		return
	}

	let noteblocks = blockmapper.mapnoteblocks(bot)
	// removed to make the bot less spammy
	//bot.chat(util.infoMessage(`Found &b${noteblocks.length}&7 noteblocks!`))

	parser.tuneNoteblocks(file, noteblocks, true, (success, error) => {
		if(success) {
			util.wait(80).then(() => console.log(util.infoMessage(success))) // made it so it doesnt spam chat
			util.wait(200).then(() => {
				var songName = file.replace(".txt", "")
				parser.editNowPlaying(songName, 0, undefined, undefined, username)
				//bot.chat(util.infoMessage(`Now playing &e${file.replace("./songs/", "").replace(".txt", "")}`))
				parser.play(bot, noteblocks, file)
			})
		} else if(error) {
			util.wait(80).then(() => bot.chat(util.errorMessage(error)))
		} else {
			console.log(`The playing of song ${file} has been cancelled manually`)
			util.wait(80).then(() => bot.chat(util.infoMessage(`The playing of song &b${file.replace("./songs/", "").replace(".txt", "")}&7 has been cancelled manually`)))
		}
	})

}

function getShuffle() {
    return shuffle
}

function setShuffle(value) {
    shuffle = value
}

module.exports.name = name
module.exports.aliases = aliases
module.exports.description = description
module.exports.usage = usage
module.exports.enabled = enabled
module.exports.shuffle = shuffle
module.exports.execute = execute
module.exports.getShuffle = getShuffle
module.exports.setShuffle = setShuffle