# Telegram Bot

Telegram bot to store movies information lol idk what to write here, I just want to know if I can make a bot.

# What's New

### v0.2.0

- Added `!delete` command, so user commands, and bot's replies to those commands older than a certain specified limit (1 day) are deleted, maintained by using a table called `delete-queue`.
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
