module.exports = {
    name: "status",
    description: "Status minecraft serveru",
    execute(Discord, client, message) {
        console.log("status");
        const axios = require('axios')
        lastEmbedChannelId = message.channel.id

        var [cmdName, ...args] = message.content
            .trim()
            .split(" ")
        if (args[0]) {
            axios
                .get("https://api.mcsrvstat.us/2/" + args[0])
                .then(res => {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(args[0] + " Status")
                    if (res.data.online && (res.data.debug.ping || res.data.debug.query || res.data.debug.srv) && !args[0].includes("qplay")) {
                        embed.setColor("#000")
                        embed.addField("Status", "Online", true)
                        if (res.data.players.online) {
                            embed.addField("Počet hráčů", res.data.players.online + "/" + res.data.players.max, true)
                            if (res.data.debug.query) {
                                let playersText = ""
                                res.data.players.list.forEach(player => {
                                    playersText += "`" + player + "` "
                                })
                                embed.addField("Hráči", playersText)
                            }
                        } else {
                            embed.addField("Počet hráčů", "0/0", true)
                        }
                        embed.addField("Verze", res.data.version, true)
                        embed.addField("IP Adresa", args[0])
                        embed.addField("MOTD", res.data.motd.clean[0] + "\n" + res.data.motd.clean[1])
                        embed.addField("Host", res.data.hostname, true) + "\n" +
                        embed.addField("IP", res.data.ip, true)
                        embed.addField("Port", res.data.port, true)
                        embed.addField("Software", res.data.software, true)

                        if (res.data.info) {
                            let infoText = ""
                            res.data.info.clean.forEach(line => {
                                infoText += line + "\n"
                            })
                            embed.addField("Info", infoText)
                        }

                        embed.setFooter("", "")

                        embed.setTimestamp(new Date)
                    } else if ((res.data.debug.ping || res.data.debug.query || res.data.debug.sr) && !args[0].includes("qplay")) {
                        embed.setColor("#000")
                        embed.addField("Status", "offline", true)
                        embed.addField("Počet Hráčů", "0/0", true)
                        embed.addField("Verze", "-", true)

                        embed.setFooter("", "")

                        embed.setTimestamp(new Date)
                    } else {
                        embed.setColor("#DF484A")
                        embed.addField("<:x:869253018225373205> Error", "Server nenalezen. Buď jste špatně napsali adresu, nebo má server zakázáno zjišťovat status.")
                    }
                    client.channels.cache.get(lastEmbedChannelId).send(embed)
                })
                .catch(error => {
                    console.error(error)
                })

        } else {
            message.channel.send("<:x:869253018225373205> Správné použití: **status <adresa>**")
        }
    }
}