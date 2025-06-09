const { MessageEmbed } = require("../utils");

module.exports = {
    name: "help",
    description: "Open the help menu.",
    caseInsensitive: true,
    usage: "[command]",
    aliases: ["?"],
    execute: (msg, args, bot) => {
        let cmds = [];
        if (!args[0]){
            cmds = Object.keys(bot.commands)
                .filter(command => bot.commands[command].description)
                .sort()
                .map(command => `\n**.${command}** - *${bot.commands[command].description}*`);
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#a0ff9c')
                .setAuthor(`🗣️ Commands`)
                .setDescription(cmds.join(''))
                .setFooter("Type '.help [command]' for usage.").create
            ).catch(err => console.error(err));
        }
        let commandKey = Object.keys(bot.commands).find(
            c => args[0].toLowerCase() === c.toLowerCase()
        );
        if (commandKey) {
            let commandObj = bot.commands[commandKey];
            let aliasStr = '';
            if (commandObj.aliases && commandObj.aliases.length > 0) {
                aliasStr = `\nAliases: ${commandObj.aliases.map(a => '.' + a).join(', ')}`;
            }
            let format = `*${commandObj.description}*\n Usage: .${commandKey} ${commandObj.usage}${aliasStr}`;
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#a0ff9c')
                .setAuthor(`.${commandKey}`)
                .setDescription(format)
                .setFooter("Type .help for more commands.").create
            ).catch(err => console.error(err));
        }
        return msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#ff0000')
            .setAuthor(`Hmmm...`)
            .setDescription(`${args[0].toLowerCase()} doesn't seem to be an actual command.`)
            .setFooter("Type '.help [command]' for usage.").create
        ).catch(err => console.error(err));
    }
};
