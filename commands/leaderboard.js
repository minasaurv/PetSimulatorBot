const { MessageEmbed, db, icon } = require("../utils");
let board = [];
module.exports = {
    name: "leaderboard",
    description: "Display the richest of the rich.",
    caseInsensitive: true,
    aliases: ["lb", "top"],
    usage: "",
    setBoard: (b) => { board = b; },
    execute: async (msg) => {
        let fields = [];
        let rank = 0;
        for (let i = 0; i < board.length; i++){
            if (board[i][1] === `${msg.author.username}`){
                rank = i + 1;
                break;
            }
        }
        let topBoard = board.slice(0, 10);
        for (let i = 0; i < topBoard.length; i++){
            fields.push({
                name: `#${i + 1}. ${topBoard[i][1]}`,
                value: `${icon.gold} ${topBoard[i][0]}`,
                inline: false
            });
        }
        for (let i = topBoard.length; i < 10; i++) {
            fields.push({
                name: `#${i + 1}. ---`,
                value: `---`,
                inline: false
            });
        }
        let embed = new MessageEmbed()
            .setColor('#a0ff9c')
            .setAuthor(`🏆 Leaderboard 🏆`);
        for (const field of fields) {
            embed.addField(field.name, field.value, field.inline);
        }
        embed.setFooter(`Your rank is #${rank}. Leaderboard updates once per minute.`);
        msg.channel.createMessage(embed.create)
            .catch(err => console.error(err));
    }
};
