module.exports = {
    name: "status", // Jméno commandu
    description: "Status minecraft serveru", // Popis commandu
    execute(Discord, client, message) {
        console.log("[LOG] Status command proveden"); // Console log o provedení status commandu 
        const axios = require('axios')
        lastEmbedChannelId = message.channel.id

        var [cmdName, ...args] = message.content
            .trim()
            .split(" ")
        if (args[0]) {
            axios
                .get("https://api.mcsrvstat.us/2/" + args[0]) // API Endpoint
                .then(res => {
                    const embed = new Discord.MessageEmbed() // Nový embed
                        .setTitle(args[0] + " Status") // Nadpis embedu
                    if (res.data.online && (res.data.debug.ping || res.data.debug.query || res.data.debug.srv) && !args[0].includes("qplay")) {
                        embed.setColor("#000") // Barva online embedu
                        embed.addField("Status", "Online", true) // Status online
                        if (res.data.players.online) {
                            embed.addField("Počet hráčů", res.data.players.online + "/" + res.data.players.max, true) // Počet hráčů
                            if (res.data.debug.query) {
                                let playersText = ""
                                res.data.players.list.forEach(player => {
                                    playersText += "`" + player + "` "
                                })
                                embed.addField("Hráči", playersText) // Pole hráči
                            }
                        } else {
                            embed.addField("Počet hráčů", "0/0", true)
                        }
                        embed.addField("Verze", res.data.version, true) // Verze serveru
                        embed.addField("IP Adresa", args[0]) // IP Adresa serveru
                        embed.addField("MOTD", res.data.motd.clean[0] + "\n" + res.data.motd.clean[1]) // MOTD serveru
                        embed.addField("Host", res.data.hostname, true) + "\n" + // Hostname serveru
                        embed.addField("IP", res.data.ip, true) // IP Adresa serveru
                        embed.addField("Port", res.data.port, true) // Port serveru
                        embed.addField("Software", res.data.software, true) // Software serveru

                        if (res.data.info) {
                            let infoText = ""
                            res.data.info.clean.forEach(line => {
                                infoText += line + "\n"
                            })
                            embed.addField("Info", infoText)
                        }

                        embed.setFooter("", "") // Prázdný footer pro název vašeho serveru :)

                        embed.setTimestamp(new Date)
                    } else if ((res.data.debug.ping || res.data.debug.query || res.data.debug.sr) && !args[0].includes("qplay")) {
                        embed.setColor("#000") // Barva offline embedu
                        embed.addField("Status", "offline", true) // Offline status
                        embed.addField("Počet Hráčů", "0/0", true) // Offline hráči
                        embed.addField("Verze", "-", true) // Offline verze

                        embed.setFooter("", "") // Prázdný footer pro název vašeho serveru :)

                        embed.setTimestamp(new Date) // Čas ve footeru
                    } else {
                        embed.setColor("#DF484A") // Error embed barva + níže zpráva
                        embed.addField("<:x:869253018225373205> Error", "Server nenalezen. Buď jste špatně napsali adresu, nebo má server zakázáno zjišťovat status.")
                    }
                    client.channels.cache.get(lastEmbedChannelId).send(embed)
                })
                .catch(error => {
                    console.error(error) // Console log error
                })

        } else {
            message.channel.send("<:x:869253018225373205> Správné použití: **status <adresa>**") // Správné použití (odpověď na command "status")
        }
    }
}
