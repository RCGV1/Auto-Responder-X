# Auto-Responder-X :robot:

Auto-Responder-X is a Discord selfbot that allows you to set up auto-reply messages for specific users.

## Features :rocket:

- Start and stop auto-reply feature with `!start` and `!stop` commands.
- Reset JSON config with `!reset` command.
- Display bot uptime with `!uptime` command.
- Add new users with custom auto-reply messages using `!adduser` command.
- Modify auto-reply messages for existing users with `!modifyuser` command.
- Remove users from auto-reply list with `!removeuser` command.
- View list of all users with auto-reply messages with `!listusers` command.
- Custom ASCII art display on bot startup.

## Installation :computer:

1. Clone the repository or download the ZIP file.
2. Install the required dependencies using `npm install` command.
3. Set up your Discord bot token in a `.env` file. The `.env` file should be placed in the root directory of the bot project, and it should contain the following line with your Discord bot token: 
 `TOKEN=<your-discord-bot-token>`  
4. Run the bot using `node index.js` command.


## Commands :keyboard:

- `!start`: Start auto-reply feature.
- `!stop`: Stop auto-reply feature.
- `!reset`: Reset JSON config.
- `!uptime`: Display bot uptime.
- `!adduser <user> <message>`: Add a new user with a custom auto-reply message.
- `!modifyuser <user> <message>`: Modify the auto-reply message for an existing user.

## Example Usage :speech_balloon:

1. Start auto-reply feature: `!start`.
2. Add a new user with a custom auto-reply message: `!adduser @username Hello! I am currently unavailable.`
3. Modify the auto-reply message for an existing user: `!modifyuser @username Hi there! I will get back to you soon.`
4. Stop auto-reply feature: `!stop`.
5. Reset JSON config: `!reset`.
6. Display bot uptime: `!uptime`.

