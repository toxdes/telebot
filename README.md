# Telegram Bot

Telegram bot to store movies information lol idk what to write here, I just want to know if I can make a bot.

# What's New
### v 0.3.4
- For `!delete`, changed interval from 1 day to 5 minutes
- Added `jest` for unit testing, but only a few tests are currently added to the test suite
- Finished implementing `!deletecmd` command.
- Added more fields to commands table to handle command aliases in a better way.

### v 0.3.0
- Added functionality for user to add commands. So, the commands are now classified in two categories, one is core commands, and other is user commands. 
- To manage user commands, `!addcmd`, `!alias`, `!updatecmd` and `!deletecmd` are added. 
- `!deletecmd` is not yet implemented. Also a lot of testing is remaining. 
- Upgraded `pg` dependancy to latest version, so this setup works with `node 14`
  
### v0.2.1

- Updated version for `package.json`, minor fixes.
- Added `!delete` command, so user commands, and bot's replies to those commands older than a certain specified limit (5 minutes) are deleted, maintained by using a table called `delete-queue`.
- `!notify` now sends DMs to subscribers, provided they have enabled talking to the bot
- Removed _unnecessary_ commands from the source.
- Cool.

[see here](./changelog.md) the full changelog.

# Commands
| Command | Description | Usage | Status |
| :-------: | :-----------: | :-----: | :------: |
|`!who` | Literally tells who they <i> really </i>are lol. |If used as a reply to someone's message, you get to know who they are. Else, I will tell you what society really thinks of you.  <code> !whoami </code> That's it.😊| Implemented |
|`!notify` | Send a notification to all subscribers. |Command must be a reply to some message. You need to be at least a USER.  How about some <code>!sub</code>...?  😁😁| Implemented |
|`!rate` | Give YOUR rating to a movie you watched. | Command must be a reply to some message. Rating must be on a scale of (0,10]. <code>!rate your_rating </code>| Not Implemented |
|`!add` | Add a movie to the database |Requires GOD privilige. Refernced message must be in proper format, so that title and other details can be extracted| Not Implemented |
|`!help` | This very message, you idiot! |Is it not obvious?| Implemented |
|`!sub` | Make yourself a subscriber. |Is it not obvious?| Implemented |
|`!start` | You will recieve notifications from me |You need to be a subscriber furst.| Implemented |
|`!stop` | You will NOT recieve notifications from me |You need to be a subscriber furst.| Implemented |
|`!suggest` | Suggest a movie to add to our epic collection. |Must be a reply to some message.| Implemented |
|`!promote` | promote USERs to GODs. |Command must be a reply to someone's message.  Usage: <code>!promote</code>| Implemented |
|`!delete` | Delete bot and user command messages that were older than the limit decided by my creator. |Is it not obvious?| Implemented |
|`!addcmd` | Create A new Command. |Requires GOD privilige.  Usage: <code>!addcmd [command] [%s to get remaining message after the command is called] [your_text]</code>| Implemented |
|`!alias` | Add an alias to a command, to make it shorter/convinient? |Requires GOD privilige.  Usage: <code>!alias [new-name] [old-command-name]</code>| Implemented |
|`!updatecmd` | Update an existing user defined command. |Requires GOD privilige. Usage: <code>!updatecmd [command] [new_command_text]</code>| Not Implemented |
|`!deletecmd` | Delete an existing user defined command. |Requires GOD privilige. Usage: <code>!deletecmd [command]</code>| Not Implemented |
