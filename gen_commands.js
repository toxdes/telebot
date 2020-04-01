/*
Edit: lol linux is so much better, automated steps 2-3.
generate commands table, from commands.json,
 -> use `yarn gen-commands`. (that's it, you're done, no need to proceed further anymore.)
 -> output will be saved to `temp.md`.
 -> copy-paste the table to `readme.md` under commands session.
*/

const commands = require("./commands.json");

const gen_commands_table = commands => {
  console.log("# Commands");
  console.log(`| Command | Description | Usage | Status |`);
  console.log(`| :-------: | :-----------: | :-----: | :------: |`);
  Object.keys(commands).map(command => {
    let desc = commands[command].desc.replace(/\n/gi, " ");
    let usage = commands[command].usage
      ? commands[command].usage
      : "Is it not obvious?";
    usage = usage.replace(/\n/gi, " ");
    let status = commands[command].status;
    console.log(`|\`!${command}\` | ${desc} |${usage}| ${status} |`);
  });
};

gen_commands_table(commands);
