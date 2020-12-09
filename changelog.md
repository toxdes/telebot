# Changelog

Changelog for the development

### v 0.3.4
- Added a `config.sh` file, which just has some variables. Also changed README a bit, added installation instructions to it. 
- For `!delete`, changed interval from 1 day to 5 minutes
- Also, need to store timestamp instead of date in `delete_queue` table, so fixed that.
- I think this is it.

### v 0.3.3
- Added `jest` for unit testing, but only a few tests are currently added to the test suite, so a lot of tests still need to be written. I don't know if I should waste my time writing those tests. Also need to figure out how do I use `jest` to test asynchronous code.
- Finished implementing `!deletecmd` command.
- Added more fields to commands table to handle command aliases in a better way.
- I keep track if each command in the commands table is an alias, and if it is, then for which command it is aliased to. This way, when the command is updated, I can update it everywhere, and there's no inconsistency whatsoever(I hope so). 
- Bug-fixes to certain helper functions. 


### v 0.3.2
- Added few more dev-scripts, and updated `package.json` with `dev-dependencies`
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

### v0.1.0

- Added changelog, version set to 0.1.0 cause most commands work now.
- fixed `!sub` command, added hint for user to press start button, so that the bot can DM the users
- some people don't have usernames, for them using `first_name` as username, however, mentioning a user is working.
- some minor fixes that I can't think of.
