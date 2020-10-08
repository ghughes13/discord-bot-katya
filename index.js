require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client();
const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');

const prefix = '>>'

let stats = {};
if(fs.existsSync("stats.json")) {
  stats = jsonfile.readFileSync('stats.json');
}  


client.once('ready', () => {
  console.log('Initializing Katya...')
});

client.on('message', message => {
  if(message.content.startsWith(prefix)) { //If message starts with bot prefix (eg. It's a command to the bot) 
    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase();
    //Adding Commands Later
  } else if(!message.author.bot) { //If the message is from a user (add XP)
    //message.guild.id === Server ID

    if(message.guild.id in stats === false) {
      stats[message.guild.id] = {};
    }

    const guildStats = stats[message.guild.id];
    
    if(message.author.id in guildStats === false) {
      guildStats[message.author.id] = {
        xp: 0,
        level: 0,
        last_message: 0,
      }
    }

    const userStats = guildStats[message.author.id];
    userStats.xp += random.int(5, 15);

    const xpToNextLevel = 5 * (userStats.level**2) + 50 * userStats.level + 100;

    const getRole = (level) => {
      const rolesList = ["Bacon Bit",
      "Slice of Bacon",
      "Turkey Bacon",
      "Trashy Bacon",
      "Smoked Bacon",
      "Fancy Bacon",
      "Ribs",
      "Short Ribs",
      "BBQ Ribs",
      "Smoked Ribs",
      "Fancy Ribs",]

      console.log(level)
      const index = level.split('')[0]

      const roleToAdd = message.guild.roles.cache.find(r => r.name === rolesList[index])
      message.member.roles.add(roleToAdd)
      message.channel.send(message.author.username + ' is now level ' + userStats.level + ' and ranked up to ' + rolesList[index] + '!!')
    }

    if(userStats.xp >= xpToNextLevel) { //level up the user
      userStats.level++;
      userStats.xp = userStats.xp - xpToNextLevel
      
      if(userStats.level === 1) {
        getRole('00');
      } else if(userStats.level % 10 === 0) {
        getRole(userStats.level.toString())
      } else {
        message.channel.send(message.author.username + ' is now level ' + userStats.level)
      }
    }

    jsonfile.writeFileSync("stats.json", stats)

  }

  return
})


client.login(process.env.BOT_TOKEN)