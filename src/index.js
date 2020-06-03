require("dotenv").config();
const Telegraf = require("telegraf");

const { Client } = require("pg");
const {
  is_command,
  handle_command,
  get_chat_id,
  sanitize_cmd,
  exclude_list,
  is_prod
} = require("./helpers");

const { q } = require("./queries");

// create a postgres db client
const client = new Client({
  connectionString: is_prod()
    ? process.env.DEV_DATABASE_URL
    : process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.context.BOT_USERNAME = process.env.BOT_USERNAME;
// bot.command(Object.keys(commands));

client.connect(err => {
  if (err) {
    console.log("Couldn't connect to database.");
    console.error(err);
  }
});
console.log(
  `bot started in ${is_prod() ? "production" : "development"} environment`
);

bot.on("text", async ctx => {
  const message_text = ctx.message.text;
  let res = "what? I don't know what you're talking about 😢";
  // await client.query(q.drop_tables);
  await client.query(q.create_tables);
  // await client.query(q.insert_dummy);

  console.log(`received: ${message_text}`);
  let options = {};
  // if (message_id != -1) {
  //   console.log(`message_id: ${message_id}`);
  //   options["reply_to_message_id"] = message_id;
  // } else {
  //   options["reply_to_message_id"] = ctx.message.message_id;
  // }
  let should_keep = false;
  let keep = {
    sender_id: ctx.message.from.id,
    message_id: ctx.message.message_id,
    bot_id: process.env.BOT_USERID,
    reply_id: undefined,
    chat_id: ctx.chat.id
  };
  options["reply_to_message_id"] = ctx.message.message_id;
  if (is_command(message_text)) {
    let cmd = sanitize_cmd(message_text.split(" ")[0]);
    should_keep = !exclude_list.includes(cmd);
    try {
      res = await handle_command(client, message_text, ctx)();
    } catch (e) {
      console.log(e);
      res = "You are crashing the server. Please stop.";
    }
  } else {
    // don't reply anythin, the user wasn't talking to the bot
    return;
  }
  // console.log(ctx);
  if (!res) {
    return;
  }
  let message = await ctx.replyWithHTML(res, options);
  if (!message) {
    console.log("maybe bot failed to send the message.");
    return;
  }
  keep.reply_id = message.message_id;
  if (should_keep) {
    await client.query(q.insert_into_delete_queue, [
      keep.message_id,
      keep.bot_id,
      keep.reply_id,
      get_chat_id(keep.chat_id)
    ]);
  }
  console.log(message);
});

bot.launch();
