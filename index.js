const { Client } = require('discord.js-selfbot-v13');
const dotenv = require('dotenv');
const fs = require('fs');
require('dotenv').config();


const client = new Client({
    checkUpdate: false,
});
const jsonConfigFilePath = '/Users/benjaminfaershtein/Auto-Responder-X/JSON_CONFIG.JSON';
let replyEnabled = false;
let jsonConfig = { SAVED_USERS: {} }; // store JSON config in memory






function loadJsonConfig() {
    try {
        const jsonString = fs.readFileSync(jsonConfigFilePath);
        jsonConfig = JSON.parse(jsonString);
    } catch (err) {
        console.error(err);
    }
}
function printASCII (asciiArtFilePath) {
    fs.readFile(asciiArtFilePath, 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('\x1b[36m',data);
    });
}

client.on('ready', () => {
    console.log('Bot running, User Logged in as: ' + '\x1b[35m','\x1b[1m',client.user.tag);

    printASCII('/Users/benjaminfaershtein/Auto-Responder-X/ASCII/ASCII.txt');
    // Load JSON config from file
    try {
        const jsonString = fs.readFileSync(jsonConfigFilePath);
        jsonConfig = JSON.parse(jsonString);
    } catch (err) {
        console.error(err);
    }
});


fs.stat(jsonConfigFilePath, function(err, stat) {
    if (err == null) {
        return;
    } else if (err.code === 'ENOENT') {
        // file does not exist, create it
        fs.writeFileSync(jsonConfigFilePath, JSON.stringify({ SAVED_USERS: {} }));
    } else {
        console.log('Some other error: ', err.code);
    }
});


client.on('message', async (message) => {

    if (message.content === '!start' && message.author.id === client.user.id) {
        replyEnabled = true;
        message.channel.send('> `Auto-reply feature enabled!` :computer:');
    }

    if (message.content === '!stop' && message.author.id === client.user.id) {
        replyEnabled = false;
        message.channel.send('> `Auto-reply feature disabled!` :computer:');
    }

    if (message.content === '!reset' && message.author.id === client.user.id) {
        jsonConfig.SAVED_USERS = {};
        saveJsonConfig();
        message.channel.send('> `JSON config reset!` :computer:');
    }
// Display bot uptime
    if (message.content === '!uptime' && message.author.id === client.user.id) {
        const uptimeSeconds = Math.floor(process.uptime());
        const uptimeMinutes = Math.floor(uptimeSeconds / 60);
        const uptimeHours = Math.floor(uptimeMinutes / 60);
        const uptimeDays = Math.floor(uptimeHours / 24);
        const uptimeString = `${uptimeDays} days, ${uptimeHours % 24} hours, ${uptimeMinutes % 60} minutes, ${uptimeSeconds % 60} seconds`;
        message.channel.send('> `' + `Uptime: ${uptimeString}` + '` :computer:');
    }


    if (message.content.startsWith('!adduser') && message.author.id === client.user.id) {
        const args = message.content.slice(9).trim().split(' ');
        let newUserId = args[0];

        // Check if the user ID starts with '<@' and ends with '>'
        if (newUserId.startsWith('<@') && newUserId.endsWith('>')) {
            // Extract the user ID from the mention
            newUserId = newUserId.slice(2, -1);
        }

        const newMessage = args.slice(1).join(' ');

        // Fetch the user with the specified ID
        const user = await client.users.fetch(newUserId).catch(err => {
            console.error(err);
            return null;
        });

        if (!user) {
            return message.channel.send(`> \`User with ID ${newUserId} not found\` :computer:`);
        }

        // Get the username of the user
        const newUserName = user.username;

        // Check if the user already exists in the config file
        if (jsonConfig.SAVED_USERS[newUserName]) {
            return message.channel.send(`> \`User ${newUserName} already exists in the JSON config\` :computer:`);
        }

        // Add the new user to the config file
        jsonConfig.SAVED_USERS[newUserName] = {
            USER_ID: newUserId,
            MESSAGE: newMessage,
        };

        // Save the changes to the config file
        saveJsonConfig();

        message.channel.send(`> \`User ${newUserName} added with message "${newMessage}"\` :computer:`);

    }





    if (jsonConfig.SAVED_USERS[message.author.username]) {
        if (replyEnabled) {
            const user = message.author;
            message.channel.send(`${user}, ${jsonConfig.SAVED_USERS[message.author.username].MESSAGE}`);
        } else {
            return;
        }
        console.log('\x1b[35m','Message sent to ' + message.author.username);
    }


    if (message.content.startsWith('!modifyuser') && message.author.id === client.user.id) {
        const params = message.content.split(' ');
        if (params.length >= 3) {
            const identifier = params[1];
            const newMessage = params.slice(2).join(' ');
            let foundUser;

            if (identifier.startsWith('<@') && identifier.endsWith('>')) { // User mentioned
                const userId = identifier.slice(2, -1);
                foundUser = Object.values(jsonConfig.SAVED_USERS).find(user => user.USER_ID === userId);
            } else if (identifier.match(/^\d+$/)) { // User ID
                foundUser = Object.values(jsonConfig.SAVED_USERS).find(user => user.USER_ID === identifier);
            } else { // Username
                foundUser = jsonConfig.SAVED_USERS[identifier];
            }

            if (!foundUser) {
                return message.channel.send(`> \`User with identifier "${identifier}" not found\` :computer:`);
            }

            foundUser.MESSAGE = newMessage;

            // Save the changes to the config file
            saveJsonConfig();

            message.channel.send(`> \`Message for user ${identifier} modified to "${newMessage}"\` :computer:`);
        }
    }




    function getRepliedUserIds(message) {
        const repliedUserIds = [];
        if (message.reference) {
            const repliedMessage = message.channel.messages.cache.get(message.reference.messageID);
            if (repliedMessage) {
                repliedUserIds.push(repliedMessage.author.id);
                repliedUserIds.push(...getRepliedUserIds(repliedMessage));
            }
        }
        return repliedUserIds;
    }
});

function saveJsonConfig() {
    try {
        fs.writeFileSync(jsonConfigFilePath, JSON.stringify(jsonConfig));
    } catch (err) {
        console.error(err);
    }
}

client.login(process.env.TOKEN);