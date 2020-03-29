const Telegraf = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const commands = ["notify", "rate", "add", "help", "sub", "stop"];

const is_command = c => {
  if (!c) return;
  return c[0] == "!" || c[0] == "/";
};

const handle_command = c => {
  c = c.substr(1, c.length);
  switch (c) {
    case "help":
      return commands.toString();
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
bot.on("text", ctx => {
  const message_text = ctx.message.text;
  let res = "what? I don't know what you're talking about :(";
  if (is_command(message_text)) {
    res = handle_command(message_text);
  }
  console.log(`recieved: ${message_text}`);
  //   console.log(ctx);
  //const chat_id = ctx.message.chat.id;
  const message_id = ctx.message.reply_to_message
    ? ctx.message.reply_to_message.message_id
    : 0;
  let options = {};
  if (message_id != 0) {
    console.log(`message_id: ${message_id}`);
    options["reply_to_message_id"] = message_id;
  }

  ctx.reply(res, message_id != 0 ? options : undefined);
  //   ctx.replyWithPoll(
  //     "How much would you rate this?",
  //     [
  //       " Extremely Bad 😡 ",
  //       " I enjoyed 😢 ",
  //       " Damn, underrated one! 🥰 ",
  //       " One of the best for me! 😍 "
  //     ],
  //     options
  //   );
});
bot.launch();
