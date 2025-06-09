const { MessageEmbed, db } = require("../utils");

module.exports = {
    name: "resetme",
    description: "Reset your user data (irreversible).",
    caseInsensitive: true,
    usage: "",
    execute: async (msg) => {
        await db.set(`users.${msg.author.id}`, {
            inv: {},
            pets: {},
            gold: 0,
            gems: 0,
            level: 1,
            exp: 0,
            skills: {},
            chatCooldown: 0,
            equipped: []
        });
        return msg.channel.createMessage(
            new MessageEmbed()
            .setColor('#ff6666')
            .setAuthor('Reset Complete')
            .setDescription('Your user data has been reset.').create
        ).catch(err => console.error(err));
    }
};
