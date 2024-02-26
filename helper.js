/*
    This code is currently unused but is a reference for future features
*/

const { GoalNear, GoalBlock } = require('mineflayer-pathfinder').goals
const Movements = require('mineflayer-pathfinder').Movements
const { Vec3 } = require('vec3')
const { onChat } = require('./chat_handler')

// Home is where the bed is
function come (bot, username) {

    const defaultMove = new Movements(bot)

    defaultMove.digCost = 1000
    defaultMove.canOpenDoors = true

    bot.chat("/msg " + username + " ! I am coming to you.")
    const target = bot.players[username] ? bot.players[username].entity : null
    if (!target) {
    bot.chat("/msg " + username + " I don\'t see you!")
    return
    } 
    const p = target.position
    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1), true) // DYNAMIC GOAL

}

function home (bot, username) {

    // create new position object
    const pos = new Vec3(-372, 66, -99)
    
    const defaultMove = new Movements(bot)
    
    defaultMove.digCost = 1000
    
    bot.chat("/msg " + username + " ! I am coming home.")

    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.goto(new GoalNear(pos.x, pos.y, pos.z, 1), true) // DYNAMIC GOAL
    
}

function tp (bot) {
    bot.chat("/home Home")
    bot.chat("/msg Gurkenwerfer_ I am home.")
}

async function dropall(bot) {
    var inventoryItemCount = bot.inventory.items().length
    if (inventoryItemCount === 0) return
    
    while (inventoryItemCount > 0) {
        const item = bot.inventory.items()[0]
        //bot.chat(`Threw ${item.name}`)
        await bot.tossStack(item)
        inventoryItemCount--
    }
}

async function bring(bot, username, msg) {
    const defaultMove = new Movements(bot)
    mcData = require('minecraft-data')(bot.version)
    defaultMove.digCost = 1000
    // open nearby chests and look for glass
    const chestBlock = bot.findBlock({
        matching: ['chest', 'ender_chest', 'trapped_chest'].map(name => mcData.blocksByName[name].id),
        maxDistance: 6
    })
    if (chestBlock) {
        await bot.openChest(chestBlock)
        //const glass = bot.inventory.items().find(item => item.name.includes('glass'))
        const glass = item => item.name.includes(msg)
        if (glass) {
            
            bot.chat("/msg " + username + " I brought you some glass.")
        } else {
            bot.chat("/msg " + username + " I couldn\'t find any glass.")
        }
        await bot.closeWindow()
    } else {
        bot.chat("/msg " + username + " I couldn\'t find any chests.")
    }
}

async function kit(bot, username, msg) {
    // check msg against regex
    bot.chat("/msg " + username + " MSG: " + msg)
    let kit = msg.match(/obsidian/)
    if (kit) {
        // find obsidian in inventory
        const obsidian = bot.inventory.items().find(item => item.name.includes('obsidian'))
        if (obsidian) {
            // do something with obsidian
            bot.chat("/msg " + username + " Delivery started, please accept the tp request.")
            bot.chat("/tpa " + username)
            // toss obsidian
            await bot.waitForTicks(60)
            await bot.tossStack(obsidian)
            bot.chat("/home Home")

        } else {
            bot.chat("/msg " + username + " I couldn\'t find any obsidian.")
        }
    } else {
        bot.chat("/msg " + username + " I couldn\'t find any kits.")
    }

}

async function bringObby(bot, username) {
    const obsidian = bot.inventory.items().find(item => item.name.includes('glass'))
    if (obsidian) {
        // do something with obsidian
        bot.chat("/msg " + username + " Delivery started, please accept the tp request.")
        bot.chat("/tpa " + username)
        // toss obsidian
        bot.on("chat", onChat)
        let tpacceptregex = /(.+?)([\w-]+)_? accepted request/
        function onChat(username, message) {
            const match = message.match(tpacceptregex)
            console.log(match)
            if (match) {
                bot.chat("/msg " + username + " I am coming to you.")
            }
        }

        await bot.waitForTicks(240)
        await bot.tossStack(obsidian)
        bot.chat("/home Home")

    } else {
        bot.chat("/msg " + username + " I couldn\'t find any obsidian.")
    }
}

async function equipArmor(bot, username, msg) {
    // create switch case for armor types
    switch (msg) {
        case "helmet":
            // check inventory for helmet
            const helmet = bot.inventory.items().find(item => item.name.includes('helmet'))
            if (helmet) {
                // equip helmet
                await bot.equip(helmet, "head")
                bot.chat("/msg " + username + " I equipped the helmet.")
            }
            break
        case "chestplate":
            // check inventory for chestplate
            const chestplate = bot.inventory.items().find(item => item.name.includes('chestplate'))
            if (chestplate) {
                // equip chestplate
                await bot.equip(chestplate, "torso")
                bot.chat("/msg " + username + " I equipped the chestplate.")
            }
            break
        case "leggings":
            // check inventory for leggings
            const leggings = bot.inventory.items().find(item => item.name.includes('leggings'))
            if (leggings) {
                // equip leggings
                await bot.equip(leggings, "legs")
                bot.chat("/msg " + username + " I equipped the leggings.")
            }
            break
        case "boots":
            // check inventory for boots
            const boots = bot.inventory.items().find(item => item.name.includes('boots'))
            if (boots) {
                // equip boots
                await bot.equip(boots, "feet")
                bot.chat("/msg " + username + " I equipped the boots.")
            }
            break
        default:
            bot.chat("/msg " + username + " I couldn\'t find any armor.")
        }
    
}

async function playNotes(notes, bot) {
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i]
        await bot.waitForTicks(note.tick)
        bot.playSound('note.harp', note.pitch, 1)
    }
}

module.exports = { come, home, tp, dropall, bring, kit, bringObby, equipArmor }