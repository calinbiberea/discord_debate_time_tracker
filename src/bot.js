const eris = require('eris');
const {BOT_TOKEN} = {
    "BOT_TOKEN": process.env.BOT_KEY,
    "BOT_OWNER_ID": process.env.CALIN_KEY,
    "LOG_CHANNEL_ID": process.env.SERVER_KEY
};

// Create a Client instance with our bot token.
const bot = new eris.Client(BOT_TOKEN);
const PREFIX = '!';
const MINUTE = 60000;

// When the bot is connected and ready, log to console.
bot.on('ready', () => {
    console.log('Ziua buna, io tin timpul.');
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const commandHandlerForCommandName = {};

commandHandlerForCommandName['start'] = (msg, args) => {
    return msg.channel.createMessage(`Mi-am facut treaba si n-am crapat, ce viata.`);
};

// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".
bot.on('messageCreate', async (msg) => {
    const botWasMentioned = msg.mentions.find(
        mentionedUser => mentionedUser.id === bot.user.id,
    );

    if (botWasMentioned) {
        try {
            await msg.channel.createMessage('Ai zis ceva de mine?');
        } catch (err) {
            // There are various reasons why sending a message may fail.
            // The API might time out or choke and return a 5xx status,
            // or the bot may not have permission to send the
            // message (403 status).
            console.warn('Eroare de mentiune.');
            console.warn(err);
        }
    }

    const content = msg.content;

    // Ignore any messages sent as direct messages.
    // The bot will only accept commands issued in
    // a guild.
    if (!msg.channel.guild) {
        return;
    }

    // Ignore any message that doesn't start with the correct prefix.
    if (!content.startsWith(PREFIX)) {
        return;
    }

    // Extract the parts of the command and the command name
    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length);

    if (commandName === 'start') {
        msg.channel.createMessage(`Timpul incepe sa se scurga.`);
        msg.channel.createMessage(`Inca un test sa fac cu neuronu.`);
        await sleep(1);
        msg.channel.createMessage(`Timpul protejat expira. Sariti cu POIs.`);
        await sleep(6 * 1);
        msg.channel.createMessage(`Timpul protejat incepe iar. Calmati-va.`);
    }

    // Get the appropriate handler for the command, if there is one.
    const commandHandler = commandHandlerForCommandName[commandName];

    if (!commandHandler) {
        return;
    }

    // Separate the command arguments from the command prefix and command name.
    const args = parts.slice(1);

    try {
        // Execute the command.
        await commandHandler(msg, args);
    } catch (err) {
        console.warn('Eroare de handling.');
        console.warn(err);
    }
});

bot.on('error', err => {
    console.warn(err);
});

bot.connect();
