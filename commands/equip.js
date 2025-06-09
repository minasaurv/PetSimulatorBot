const MessageEmbed = require("davie-eris-embed");
const { db, pets } = require("../utils");

module.exports = {
    name: "equip",
    description: "Equip a pet.",
    caseInsensitive: true,
    aliases: ["eq"],
    usage: "<pet>",
    execute: async (msg, args) => {
        if (!args[0]) {
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Incorrect Usage`)
                .setDescription("Please specify a pet to equip.").create
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
        let userPets = await db.get(`users.${msg.author.id}.pets`);
        let equipped = await db.get(`users.${msg.author.id}.equipped`) || [];
        if (!userPets || !userPets[petName] || userPets[petName] < 1) {
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription("You do not own this pet.").create
            ).catch(err => console.error(err));
        }
        if (equipped.length >= 3) {
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription("You can only equip up to 3 pets.").create
            ).catch(err => console.error(err));
        }
        let equippedCount = equipped.filter(p => p === petName).length;
        if (equippedCount >= userPets[petName]) {
            return msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription(`You only own ${userPets[petName]} of this pet and already have all equipped.`).create
            ).catch(err => console.error(err));
        }
        equipped.push(petName);
        await db.set(`users.${msg.author.id}.equipped`, equipped);
        return msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#a0ff9c')
            .setAuthor(`Success`)
            .setDescription(`Equipped ${pets[petName] ? pets[petName].icon + ' ' : ''}${petName}.`).create
        ).catch(err => console.error(err));
    }
};
