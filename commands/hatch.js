const { MessageEmbed, eggs, pets, icon, db } = require("../utils");

module.exports = {
    name: "hatch",
    description: "Hatch an egg.",
    caseInsensitive: true,
    usage: "<egg>",
    execute: async (msg, args) => {
        if (!args[0]) {
            msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Incorrect Usage`)
                .setDescription("Please specify an egg to hatch.").create
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
        const level = await db.get(`users.${msg.author.id}.level`);
        if (egg.level > level) {
            msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription("Your level is not high enough for this egg.").create
            ).catch(err => console.error(err));
            return;
        }
        let balance = await db.get(`users.${msg.author.id}.gold`);
        if (egg.price > balance) {
            msg.channel.createMessage(
                new MessageEmbed()
                .setColor('#d22b2b')
                .setAuthor(`Error`)
                .setDescription(`You need ${icon.gold} ${egg.price - balance} more to buy this egg.\nEgg Price: ${icon.gold} ${egg.price}\nYour Balance: ${icon.gold} ${balance}`).create
            ).catch(err => console.error(err));
            return;
        }
        let eggPets = [];
        let totalWeight = 0;
        for (pet in egg.pets) {
            eggPets.push([egg.pets[pet].weight, pets[pet].icon, pets[pet].power, pet]);
            totalWeight += egg.pets[pet].weight;
        }
        let nums = [];
        for (let i = 0; i < eggPets.length; i++) {
            nums.push(eggPets[i][0] / totalWeight);
            if (i > 0) {
                nums[i] += nums[i-1];
            }
        }
        let hatchedPet = [];
        const rand = Math.random();
        for (let i = 0; i < eggPets.length; i++) {
            let lastNum = nums[i-1] || 0;
            if (rand > lastNum && rand < nums[i]) {
                hatchedPet = eggPets[i];
                break;
            }
        }
        await db.sub(`users.${msg.author.id}.gold`, egg.price);
        await db.add(`users.${msg.author.id}.pets.${hatchedPet[3]}`, 1);
        let chance = (hatchedPet[0] / totalWeight) * 100;
        let petCount = await db.get(`users.${msg.author.id}.pets.${hatchedPet[3]}`);
        msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#a0ff9c')
            .setAuthor(`${egg.name} Egg`)
            .setDescription(`You hatched a ${hatchedPet[1]} ${hatchedPet[3]}!\nPower: ${hatchedPet[2]}\nRarity: ${pets[hatchedPet[3]].rarity} (${parseFloat(chance.toFixed(2))}%)\nYou now have ${petCount} ${hatchedPet[1]} ${hatchedPet[3]}(s)!\n`).create
        ).catch(err => console.error(err));
    }
};
