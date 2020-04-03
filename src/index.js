require("dotenv").config();
const Telegraf = require("telegraf");

const { Client } = require("pg");
const { is_command, handle_command, get_message_id } = require("./helpers");

const { q } = require("./queries");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.context.BOT_USERNAME = process.env.BOT_USERNAME;
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

// client.query(q.select_subs, (err, res) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(res ? res.rows : undefined);
// });

console.log("bot started!");

bot.on("text", async ctx => {
  const message_text = ctx.message.text;
  let res = "what? I don't know what you're talking about 😢";

  console.log(`recieved: ${message_text}`);
  let options = {};
  const message_id = get_message_id(ctx);
  if (message_id != -1) {
    console.log(`message_id: ${message_id}`);
    options["reply_to_message_id"] = message_id;
  } else {
    options["reply_to_message_id"] = ctx.message.message_id;
  }

  if (is_command(message_text)) {
    res = await handle_command(client, message_text, ctx)();
  }
  console.log(ctx);
  //const chat_id = ctx.message.chat.id;
  if (!res) {
    return;
  }
  ctx.replyWithHTML(res, options);
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
