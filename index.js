const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json"); // Input souboru s nastavením

// Console logy při zapnutí + Activity status
client.on('ready', () => { // Bot úspěšně zapnut
  console.log('-----------------------');
  console.log('| GalaxyCode Bot v1.2 |');
  console.log('| By Marek_p          |');
  console.log('-----------------------');
  console.log(`[LOG] Přihlášen jako ${client.user.tag}`); // Uživatel
  console.log('[LOG] Bot je online :)');
  console.log('');
  client.user.setActivity("Visual Studio Code", { // Activity Status
	type: "PLAYING" // Typ statusu
  });
  client.user.setStatus('dnd'); // Stav nerušit
});

const fs = require('fs')

// Integrace se složkou commands 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

// Výchozí proměnné
var lastChannelId = "";
var lastEmbedChannelId = "";

// Speciální commandy 
client.on('message', (message) => {
    if (!message.author.bot) {
        if (message.content.toLowerCase() == "ip" || message.content.toLowerCase() == "!ip") {
            client.commands.get('ip').execute(message)
        } else if (message.content.toLowerCase().startsWith("status")) {
            client.commands.get('status').execute(Discord, client, message)
        } 
    }
});

client.on('message', message => {

// Embed Command
if (message.content.startsWith(config.prefix + "embed")) { // Reakce na command embed

	if(message.member.roles.cache.has(config.staffid)) {

		// Nový Embed
		const command = config.prefix + "embed"
		const args = message.content.slice(command.length).trim().split(/ +/g);
		const announcement = args.slice(0).join(" ")
		var parts = announcement.split('_', 2);
		const announcementembed = new Discord.MessageEmbed()
		.setColor(`#000`) // HEX Barva embedu
		.addFields(
			{ name: parts[0], value: parts[1]},)
			message.delete() // Smazání zprávy
			message.channel.send(announcementembed); // Současný chat
			console.log('[LOG] Byl poslán nový embed'); // Console log při novém embedu

	}else {

// Permission Error
message.channel.send(`❌Nemáte dostatečné oprávnění k použití tohoto příkazu.`) // Error Zpráva

}}else


// Help Command
if (message.content.startsWith(config.prefix + "help")) { // Reakce na command embed

	if(message.member.roles.cache.has(config.verifyid)) {

		// Embed zpráva s help
		const command = config.prefix + "help"
		const announcementembed = new Discord.MessageEmbed()
		.setColor(`#000`) // HEX Barva embedu
		.addFields(
			{ name: 'GalaxyCode Bot', value: '> **status <ip>**  zobrazí status serveru \n> **.invite**  zobrazí invite'},) // Text v embedu
			message.channel.send(announcementembed); // Současný chat
			console.log(`[LOG] Help command proveden`); // Console log o provedení help commandu

	}else {

// Permission Error
message.channel.send(`❌Nemáte dostatečné oprávnění k použití tohoto příkazu.`) // Error Zpráva

}}else

// Restart Command
if (message.content.startsWith(config.prefix + "restartbot")) { // Reakce na command restartbot

	// Restart bota  !!! Beta !!!
	if(message.member.roles.cache.has(config.staffid)) {
		console.log(`[LOG] GalaxyCode Bot se restartuje...`); // Restart console log
		message.channel.send('♻️GalaxyCode Bot se restartuje...').then(sentMessage =>  process.exit(0)) // Restart zpráva

}else {

// Permission Error
message.channel.send(`❌Nemáte dostatečné oprávnění k použití tohoto příkazu.`) // Error Zpráva
}}});


// Odpověď na "Ahoj"
client.on("message", msg => {
	if (msg.content === "Ahoj") { // Zpráva na kterou má bot odpovědět
		msg.channel.send("Čau"); // Odpověď na zprávu o řádek výše
	}
  })


// Command .invite
client.on("message", msg => {
	if (msg.content === ".invite") { // Zpráva na kterou má bot odpovědět
		msg.channel.send("https://dsc.gg/galaxycode"); // Odpověď na zprávu o řádek výše
		console.log(`[LOG] Invite command proveden`); // Console log o provedení invite commandu
	}
  })


// Token
client.login(config.token); // Import tokenu z nastavení
