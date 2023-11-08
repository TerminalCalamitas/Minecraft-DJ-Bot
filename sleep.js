const Movements = require('mineflayer-pathfinder').Movements
const helper = require('./helper.js')
let mcData

mcData = require('minecraft-data')
const { GoalNear } = require('mineflayer-pathfinder').goals

async function sleepInBed(bot, username) {
    const bed = bot.findBlock({
      matching: block => bot.isABed(block)
    })

    // if a bed is not found, bot will log "Couldn't find a bed"
    if (!bed) {
      bot.chat("/msg " + username + " Couldn't find a bed")
      return
    }
    // path to the bed
    const p = new Movements(bot, mcData)
    bot.pathfinder.setMovements(p)
    await bot.pathfinder.goto(new GoalNear(bed.position.x, bed.position.y, bed.position.z, 1))
  
    if (bed) {
      try {
        bot.chat("/msg " + username + " Going to bed...")
        await bot.sleep(bed)
      } catch (err) {
        bot.chat("/msg " + username + " " + err.message)
        //bot.chat(err.message)
      }
    }
}

module.exports = { sleepInBed }