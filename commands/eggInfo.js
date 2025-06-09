const { MessageEmbed, eggs, pets } = require("../utils");

module.exports = {
    name: "eggInfo",
    description: "View egg information.",
    caseInsensitive: true,
    usage: "",
    execute: async (msg, args) => {
        if (!args[0]) {
            msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Incorrect Usage`)
                .setDescription("Please specify an egg to view.").create
            ).catch(err => console.error(err));
            return;
        }
        let egg = args[0].charAt(0).toUpperCase() + args[0].toLowerCase().slice(1);
        for(let i = 0; i < eggs.length; i++) {
            if (eggs[i].name === egg) {
                egg = eggs[i];
                break;
            } 
        }
        if (!egg.level) {
            msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription("Couldn't find egg. Did you type it correctly?").create
            ).catch(err => console.error(err));
            return;
        }
        let level = await require("../utils").db.get(`users.${msg.author.id}.level`);
        if (egg.level > level) {
            msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription("Your level is not high enough for this egg.").create
            ).catch(err => console.error(err));
            return;
        }
        let format = '\n\n';
        let eggPets = [];
        let totalWeight = 0;
        for (pet in egg.pets) {
            eggPets.push([egg.pets[pet].weight, pets[pet].icon, pets[pet].power]);
            totalWeight += egg.pets[pet].weight;
        }
        eggPets.sort(function(a, b) {
            return b[2] - a[2];
        });
        for (let i = 0; i < eggPets.length; i++) {
            let chance = (eggPets[i][0] / totalWeight) * 100;
            format += `${eggPets[i][1]} - Power: ${eggPets[i][2]}, Chance: ${parseFloat(chance.toFixed(2))}%\n`;
        }
        msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#a0ff9c')
            .setAuthor(`${egg.name} Egg`)
            .setDescription(format).create
        ).catch(err => console.error(err));
    }
};
