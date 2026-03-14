// Load libraries
const Eris = require("eris");
const MessageEmbed = require("davie-eris-embed");
const { QuickDB } = require("quick.db");

// Load database
const db = new QuickDB({ filePath: "db.sqlite" });

// Load config file
const config = require("./config.json");
const icon = config.icon;
const pets = config.pets;
const eggs = config.eggs;

// Leaderboard
let board = [];
async function lb() {
	
	// Clear the board
	board = [];
	
	// Get users
	let database = await db.get('users');
	for (user in database){
		if (user != 1109635837588680764) board.push([database[user].gold, database[user].name])
	}
	// Sort users by money
	board.sort(function(a, b){return b[0] - a[0]});

	// Schedule a new call in 60 seconds
    setTimeout(lb, 60000);
}

// Start leaderboard loop
lb();

// Initialize bot
const bot = new Eris.CommandClient("Bot " + require("./token.json").token, {
	intents: [
		"guilds",
		"guildMessages"
	]
}, {
	defaultHelpCommand: false,
    prefix: "."
});

// Run when bot is ready
bot.on("ready", async () => {
    console.log('\x1b[31m%s\x1b[0m', "Pet Simulator is now online.");
		bot.editStatus('idle',{
		type: 0,
		name: `Pet Simulator | .help`
	});
});

// Log errors instead of crashing
bot.on("error", (err) => {
    console.error(err);
});

// Ensures all required user properties exist, adds defaults if missing
function ensureUserDefaults(userData) {
    const defaults = {
        inv: {},
        pets: {},
        gold: 0,
        gems: 0,
        level: 1,
        exp: 0,
        skills: {},
        chatCooldown: 0,
        equipped: [],
        name: undefined
    };
    let changed = false;
    for (const key in defaults) {
        if (!(key in userData)) {
            userData[key] = defaults[key];
            changed = true;
        }
    }
    return changed;
}

// On message sent
bot.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    // Initialize user if not exists
    let userKey = `users.${msg.author.id}`;
    let userData = await db.get(userKey);
    if (!userData) {
        userData = {
            inv: {},
            pets: {},
            gold: 0,
            gems: 0,
            level: 1,
            exp: 0,
            skills: {},
            chatCooldown: 0,
            equipped: [],
            name: msg.author.username
        };
        await db.set(userKey, userData);
    } else {
        // Patch missing properties for old users
        if (ensureUserDefaults(userData)) {
            await db.set(userKey, userData);
        }
    }
    // Ensure equipped property exists for old users
    if (!userData.equipped) {
        userData.equipped = [];
        await db.set(`${userKey}.equipped`, []);
    }

    // Calculate user power (equipped pets only)
    let userPets = userData.pets || {};
    let equippedPets = userData.equipped || [];
    let userPower = 1;
    if (equippedPets.length > 0) {
        for (const pet of equippedPets) {
            if (pets[pet] && userPets[pet] > 0) {
                userPower += pets[pet].power * userPets[pet];
            }
        }
    }

    // Update username in database (for leaderboard)
    if (userData.name !== msg.author.username) {
        await db.set(`${userKey}.name`, msg.author.username);
    }

    // Chat cooldown and gold
    const lastChat = userData.chatCooldown || 0;
    if (Date.now() - lastChat > 59999) {
        await db.add(`${userKey}.gold`, Math.floor(Math.random() * 10) * userPower);
        await db.set(`${userKey}.chatCooldown`, Date.now());
    }
});

// Ping command
bot.registerCommand("ping", (msg) => {
    msg.channel.createMessage(
        new MessageEmbed()
        .setColor('#a0ff9c')
        .setAuthor(`${msg.author.username}`)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`)
        .setDescription('Pong!')
        .setFooter("What else were you expecting?").create
    ).catch(err => console.error(err));
}, {
    description: "Ping, pong... you know the drill by now.",
    caseInsensitive: true,
    usage: ""
});

// Dynamic command loading
const fs = require("fs");
const path = require("path");
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
const commandModules = {};

// Load and register commands dynamically
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (!command.name || typeof command.name !== "string") {
        console.warn(`Skipping command file ${file}: missing or invalid 'name' property.`);
        continue;
    }
    commandModules[command.name] = command;
    // Special handling for leaderboard to inject board array
    if (command.name === "leaderboard" && typeof command.setBoard === "function") {
        command.setBoard(board);
    }
    // Register command
    bot.registerCommand(command.name, async (msg, args) => {
        // Pass bot instance if needed
        if (command.execute.length >= 3) {
            return command.execute(msg, args, bot);
        } else {
            return command.execute(msg, args);
        }
    }, {
        description: command.description,
        caseInsensitive: command.caseInsensitive,
        usage: command.usage
    });
    // Register aliases if any
    if (command.aliases) {
        for (const alias of command.aliases) {
            bot.registerCommandAlias(alias, command.name);
        }
    }
}

// Start bot
bot.connect();