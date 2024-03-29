const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
});

client.on("messageCreate", message => {
    if (message.author.bot) return;

    const results = message.content.matchAll(/(?<degrees>-?\d+(?:.\d+)?)[ °]?(?<unit>[FC])\b/gmi);

    const outputs = [];

    for (let result of results) {
        let { degrees, unit } = result.groups;
        unit = unit.toUpperCase();

        let degreesConv;
        let unitConv;

        if (unit === "F") {
            degreesConv = (degrees - 32) * 5 / 9;
            unitConv = "C";
        } else {
            degreesConv = (degrees * 9 / 5) + 32;
            unitConv = "F";
        }

        degreesConv = degreesConv.toFixed(1);

        outputs.push(`${degrees}°${unit} → **${degreesConv}°${unitConv}**`);
    }

    if (outputs.length === 0) return;

    const embed = new EmbedBuilder()
        .setTitle("Temperature Conversion")
        .setColor("#0099ff")
        .setDescription(outputs.join("\n"));

    message.channel.send({ embeds: [embed] });
});

client.login(process.env.API_TOKEN);
