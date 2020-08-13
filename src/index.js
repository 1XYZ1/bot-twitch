require("dotenv").config();
const tmi = require("tmi.js");
const BLOCKED_WORDS = ['cat', 'dog', 'fuck']
const options = {
    options: {
        debug: true,
    },
    connection: {
        reconnect: true,
    },
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN,
    },
    channels: [process.env.CHANNEL_NAME],
};

const client = new tmi.client(options);

client.connect();

client.on("connected", (address, port) => {
    client.action(
        process.env.BOT_USERNAME,
        `Hello, Gamers! Connected to ${address}:${port}`
    );
});

client.on("chat", (channel, ctx, message, self) => {
    // ignore messages from the bot
    if (self) return;

    const commandName = message.trim().toLowerCase();


    console.log(channel);
    // console.log(ctx);

    if (commandName === "hola") {
        client.say(channel, `Holaaa<3 ${ctx.username}!`);
    } else if (commandName === "!juego") {
        client.action(channel, "Estoy jugando con sus corazones.");
    } else if (commandName === "!dice") {
        const num = rollDice();
        client.say(channel, `You rolled a ${num}`)
    }
    checkTwitchChat(ctx, message, channel);
});

function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

function checkTwitchChat(ctx, message, channel) {
    message = message.toLowerCase();
    let shouldSendMessage = false
        // check message
    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))

    if (shouldSendMessage) {
        // tell user
        client.say(channel, `@${ctx.username}, Lo siento! Tu mensaje ha sido eliminado.`)
            // delete message
        client.deletemessage(channel, ctx.id)
    }

}