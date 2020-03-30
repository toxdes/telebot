require("dotenv").config();
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const { Client } = require("pg");
const { is_command, handle_command } = require("./helpers");

const { q } = require("./queries");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const bot = new Telegraf(process.env.BOT_TOKEN);

client.connect();
client.query(q.drop_tables, (err, res) => {
  if (err) console.error(err);
  if (res) console.log(res.rows);
});

client.query(q.create_tables, (err, res) => {
  if (err) console.error(err);
  if (res) console.log(res.rows);
});

client.query(q.insert_dummy, (err, res) => {
  if (err) console.error(err);
  if (res) console.log(res.rows);
});

client.query(q.select_subs, (err, res) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(res ? res.rows : undefined);
});

console.log("bot started!");

bot.on("text", ctx => {
  const message_text = ctx.message.text;
  let res = "what? I don't know what you're talking about 😢";
  if (is_command(message_text)) {
    res = handle_command(message_text);
  }
  console.log(`recieved: ${message_text}`);
  console.log(ctx);
  //const chat_id = ctx.message.chat.id;
  const message_id = ctx.message.reply_to_message
    ? ctx.message.reply_to_message.message_id
    : 0;
  let options = {
    parse_mode: "html"
  };
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

bot.command("simple", ctx => {
  return ctx.replyWithHTML(
    "<b>Coke</b> or <i>Pepsi?</i>",
    Extra.markup(Markup.keyboard(["Coke", "Pepsi"]))
  );
});
bot.launch();
