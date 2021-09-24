require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!";



const fs = require('fs')

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}


client.on('ready', async() => {
    console.log(`Přihlášen jako ${client.user.tag}!`)
    console.log('Bot je online :)');;
    client.commands.get('uptime').execute(client)
    client.user.setActivity("Servers", {
        type: "WATCHING",
        url: "https://google.com"
    });
});

var lastChannelId = "";
var lastEmbedChannelId = "";

client.on('message', (message) => {
    if (!message.author.bot) {
        if (message.content.toLowerCase() == "ip" || message.content.toLowerCase() == "!ip") {
            client.commands.get('ip').execute(message)
        } else if (message.content.toLowerCase().startsWith("status")) {
            client.commands.get('status').execute(Discord, client, message)
        } 
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);