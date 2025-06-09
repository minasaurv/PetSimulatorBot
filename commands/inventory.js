const { MessageEmbed, db, pets, icon } = require("../utils");

module.exports = {
    name: "inventory",
    description: "Open your inventory.",
    caseInsensitive: true,
    usage: "[@mention]",
    aliases: ["inv"],
    execute: async (msg, args) => {
        if (msg.mentions[0]) {
            if (`<@${msg.mentions[0].id}>` == args[0]){
                let itemFormat = '**Items:**';
                let petFormat = '**Pets:**';
                let petArray = [];
                let inv = await db.get(`users.${msg.mentions[0].id}.inv`);
                let petinv = await db.get(`users.${msg.mentions[0].id}.pets`);
                for (item in inv){
                    itemFormat += `\n**${item}** ${icon[item]}: *${inv[item]}*`;
                }
                for (pet in petinv){
                    petArray.push({name: pet, power: pets[pet].power})
                }
                petArray.sort((a, b) => b.name - a.name);
                petArray.sort((a, b) => b.power - a.power);
                for (let i = 0; i < petArray.length; i++){
                    petFormat += `\n${pets[petArray[i].name].icon} **${petArray[i].name}**: *${pets[petArray[i].name].power} Power* (x${petinv[petArray[i].name]})`;
                }
                return msg.channel.createMessage(
                    new MessageEmbed()
                    .setColor('#a0ff9c')
                    .setAuthor(`${msg.mentions[0].username}'s inventory`)
                    .setDescription(`${itemFormat}\n\n${petFormat}`).create
                ).catch(err => console.error(err));
            }
        }
        let itemFormat = '**Items:**';
        let petFormat = '**Pets:**';
        let petArray = [];
        let inv = await db.get(`users.${msg.author.id}.inv`);
        let petinv = await db.get(`users.${msg.author.id}.pets`);
        let equipped = await db.get(`users.${msg.author.id}.equipped`) || [];
        for (item in inv){
            itemFormat += `\n**${item}** ${icon[item]}: *${inv[item]}*`;
        }
        for (pet in petinv){
            petArray.push({name: pet, power: pets[pet].power})
        }
        petArray.sort((a, b) => b.name - a.name);
        petArray.sort((a, b) => b.power - a.power);
        for (let i = 0; i < petArray.length; i++){
            let equippedCount = equipped.filter(p => p === petArray[i].name).length;
            petFormat += `\n${pets[petArray[i].name].icon} **${petArray[i].name}**: *${pets[petArray[i].name].power} Power* (x${petinv[petArray[i].name]})`;
            if (equippedCount > 0) {
                petFormat += ` **[EQUIPPED x${equippedCount}]**`;
            }
        }
        msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#a0ff9c')
            .setAuthor(`${msg.author.username}'s inventory`)
            .setDescription(`${itemFormat}\n\n${petFormat}`).create
        ).catch(err => console.error(err));
    }
};
