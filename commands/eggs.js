const { MessageEmbed, eggs, icon } = require("../utils");

module.exports = {
    name: "eggs",
    description: "View eggs.",
    caseInsensitive: true,
    usage: "",
    execute: async (msg) => {
        let eggList = '\n\n';
        for (let i = 0; i < eggs.length; i++) {
            if (!eggs[i]) break;
            let egg = eggs[i];
            eggList += `${egg.icon} ${egg.name} Egg - ${icon.gold} ${egg.price}\n`;
        }
        msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#a0ff9c')
            .setAuthor(`Eggs`)
            .setDescription(eggList)
            .setFooter("Do .eggInfo <egg> to see possible pets.").create
        ).catch(err => console.error(err));
    }
};
