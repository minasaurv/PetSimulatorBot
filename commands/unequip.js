const { MessageEmbed, db, pets } = require("../utils");

module.exports = {
    name: "unequip",
    description: "Unequip a pet.",
    caseInsensitive: true,
    usage: "<pet>",
    aliases: ["ue"],
    execute: async (msg, args) => {
        if (!args[0]) {
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Incorrect Usage`)
                .setDescription("Please specify a pet to unequip.").create
            ).catch(err => console.error(err));
        }
        let petNameInput = args[0].toLowerCase();
        let petName = Object.keys(pets).find(p => p.toLowerCase() === petNameInput);
        if (!petName) {
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription("That pet does not exist.").create
            ).catch(err => console.error(err));
        }
        let equipped = await db.get(`users.${msg.author.id}.equipped`) || [];
        let idx = equipped.indexOf(petName);
        if (idx === -1) {
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription("This pet is not equipped.").create
            ).catch(err => console.error(err));
        }
        equipped.splice(idx, 1);
        await db.set(`users.${msg.author.id}.equipped`, equipped);
        return msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#a0ff9c')
            .setAuthor(`Success`)
            .setDescription(`Unequipped ${pets[petName] ? pets[petName].icon + ' ' : ''}${petName}.`).create
        ).catch(err => console.error(err));
    }
};
