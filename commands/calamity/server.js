var name = "server"
var aliases = ["svr"]
var description = "Changes which server to connect to"
var usage = "{prefix}server <smp or hub>"
var enabled = true
var hidden = false

var util = require("./../../util.js")

const fs = require('fs');

const configFile = './config.json';

function execute(bot, cmd, username, args, handler) {
    connectServer = args[0]

    try {
        const data = fs.readFileSync(configFile, 'utf8');

        // Parse the JSON data
        const config = JSON.parse(data);

        // Modify the desired property
        config.mode.server = connectServer;

        // Convert the modified config object back to JSON string
        const updatedConfig = JSON.stringify(config, null, 2);

        // Write the updated JSON string back to the file
        fs.writeFile(configFile, updatedConfig, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing ${configFile}: ${err}`);
                return;
            }

            console.log(`Successfully updated ${configFile}`);
        });
    } catch (err) {
        console.error(`Error reading ${configFile}: ${err}`);
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