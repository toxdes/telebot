# Changelog

Changelog for the development

### v 0.3.2
- - added few more dev-scripts, and updated `package.json` with `dev-dependencies`
- Added functionality for user to add commands. So, the commands are now classified in two categories, one is core commands, and other is user commands. 
- To manage user commands, `!addcmd`, `!alias`, `!updatecmd` and `!deletecmd` are added. 
- `!deletecmd` is not yet implemented. Also a lot of testing is remaining. 
- Upgraded `pg` dependancy to latest version, so this setup works with `node 14`
  
### v0.2.1

- Updated version for `package.json`, minor fixes.
- Added `!delete` command, so user commands, and bot's replies to those commands older than a certain specified limit (1 day) are deleted, maintained by using a table called `delete-queue`.
- `!notify` now sends DMs to subscribers, provided they have enabled talking to the bot
- Removed _unnecessary_ commands from the source.
- Cool.

### v0.1.0

- Added changelog, version set to 0.1.0 cause most commands work now.
- fixed `!sub` command, added hint for user to press start button, so that the bot can DM the users
- some people don't have usernames, for them using `first_name` as username, however, mentioning a user is working.
- some minor fixes that I can't think of.
