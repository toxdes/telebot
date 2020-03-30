const commands = require("./commands.json");

const is_command = c => {
  if (!c) return;
  return c[0] == "!" || c[0] == "/";
};

const handle_command = c => {
  c = c.substr(1, c.length);
  switch (c) {
    case "help": {
      let res = `Yo.😡\nI don't <b>want</b> to help you, but then you won't shut up...So, I guess I'll have to force myself into helping you.`;
      res = `${res}\n\nAnyways, these are the commands I currently support.\n\n`;
      Object.keys(commands).map(each => {
        res = `${res}\`!${each}\` => ${commands[each].desc}`;
        res = `${res}\n\n`;
      });
      return res;
    }
    case "notify":
      return "Notifying all subscribers!";
    case "rate":
      return "oh do you want to rate this?";
    case "add":
      return "oh do you want to add this movie to database?";
    case "stop":
      return "you will not be notified anymore.";
    case "sub":
      return "cool, you are part of a cult now!";
    default:
      return "even I am better than you, and I am a bot.";
  }
};

exports.is_command = is_command;
exports.handle_command = handle_command;
