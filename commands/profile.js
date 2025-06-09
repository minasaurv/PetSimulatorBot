const { MessageEmbed, db, pets, icon } = require("../utils");

module.exports = {
    name: "profile",
    description: "View your profile, or someone else's by mention, ID, or name.",
    caseInsensitive: true,
    aliases: ["p"],
    usage: "[@mention|id|name]",
    execute: async (msg, args, bot) => {
        let targetId = msg.author.id;
        let targetName = msg.author.username;
        let targetAvatar = msg.author.avatar;
        if (msg.mentions[0] && (`<@${msg.mentions[0].id}>` == args[0])) {
            targetId = msg.mentions[0].id;
            targetName = msg.mentions[0].username;
            targetAvatar = msg.mentions[0].avatar;
        } else if (args[0]) {
            if (/^\d+$/.test(args[0])) {
                let userData = await db.get(`users.${args[0]}`);
                if (userData) {
                    targetId = args[0];
                    targetName = userData.name || `User ${args[0]}`;
                    let userObj = bot.users.get(args[0]);
                    if (userObj) targetAvatar = userObj.avatar;
                }
            } else {
                let users = await db.get('users');
                if (users) {
                    for (let id in users) {
                        if (users[id].name && users[id].name.toLowerCase() === args[0].toLowerCase()) {
                            targetId = id;
                            targetName = users[id].name;
                            let userObj = bot.users.get(id);
                            if (userObj) targetAvatar = userObj.avatar;
                            break;
                        }
                    }
                }
            }
        }
        const lvl = await db.get(`users.${targetId}.level`) || 1;
        const exp = await db.get(`users.${targetId}.exp`) || 0;
        const gold = await db.get(`users.${targetId}.gold`) || 0;
        const gems = await db.get(`users.${targetId}.gems`) || 0;
        let userPets = await db.get(`users.${targetId}.pets`);
        let equipped = await db.get(`users.${targetId}.equipped`) || [];
        let userPower = 1;
        if (equipped && equipped.length > 0) {
            for (let i = 0; i < equipped.length; i++) {
                let pet = equipped[i];
                if (pets[pet] && userPets && userPets[pet] > 0) {
                    userPower += pets[pet].power;
                }
            }
        }
        let equippedStr = '';
        if (equipped && equipped.length > 0) {
            let equippedCountMap = {};
            for (let i = 0; i < equipped.length; i++) {
                let pet = equipped[i];
                equippedCountMap[pet] = (equippedCountMap[pet] || 0) + 1;
            }
            equippedStr = '\n\n**Equipped Pets:**';
            for (let pet in equippedCountMap) {
                if (pets[pet]) {
                    equippedStr += `\n${pets[pet].icon} **${pet}** x${equippedCountMap[pet]}`;
                }
            }
        } else {
            equippedStr = '\n\n*No pets equipped*';
        }
        return msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#a0ff9c')
            .setAuthor(`${targetName}'s profile`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${targetId}/${targetAvatar}.png`)
            .setDescription(`${icon.gem} ${gems}\n${icon.gold} ${gold}\n\n*${userPower} Total Power*${equippedStr}`).create
        ).catch(err => console.error(err));
    }
};
