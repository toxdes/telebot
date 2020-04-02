const commands = require("./commands.json");
const { q } = require("./queries");
const is_command = c => {
  if (!c) return;
  return c[0] == "!" || c[0] == "/";
};

const get_message_id = ctx => {
  return ctx.message.reply_to_message
    ? ctx.message.reply_to_message.message_id
    : -1;
};

const is_able = (who_is, who_can) => {
  let levels = {
    NOBODY: 0,
    USER: 1,
    GOD: 2
  };
  let valid = who_is in levels && who_can in levels;
  if (!valid) {
    console.log("levels are wrong, please fix it.");
    return false;
  }
  return levels[who_is] >= levels[who_can];
};

const get_privilige = async (client, user_id) => {
  let who = "NOBODY";
  let res = await client.query(q.privilige_level, [user_id]);
  // console.log("get privilige", res);
  if (res.rowCount == 1) {
    who = res.rows[0].roll;
  }
  return who;
};

const is_subbed = async (client, user_id) => {
  let res = await client.query(q.is_subbed, [user_id]);
  return res.rowCount == 1;
};

const handle_command = (client, c, ctx) => {
  c = c.substr(1, c.length);
  switch (c) {
    case "help":
      return async () => {
        let res = `Yo.😡\nI don't <b>want</b> to help you, but then you won't shut up...So, I guess I'll have to force myself into helping you.`;
        res = `${res}\n\nAnyways, these are the commands I currently support.\n\n`;
        Object.keys(commands).map(each => {
          res = `${res}<code>!${each}</code> => ${commands[each].desc}`;
          res = `${res}\n\n`;
        });
        return res;
      };
    case "notify":
      return async () => {
        let res = await client.query(q.get_notified_usernames);
        let temp = "";
        res.rows.map(each => {
          temp = `${temp}\n@${each.username}`;
        });
        return temp;
      };
    case "rate":
      return async () => "Not implemented yet. 😊";
    /*
      return async () => {
        let res = c.split(" ");
        const err_message = `😕\nDo you even know how to use this?\n<code>${command.rate.usage}</code>\n`;
        if (res.length != 2 || ref_message_id === -1) {
          return err_message;
        }
        let rating = -1;
        try {
          rating = Number(res[1]);
          if (rating > 0 && rating <= 10) {
            // TODO: complete this, adding a new table would be a good idea?
            res = await client.query(q.rate_movie, [
              ctx.message.from.id,
              rating
            ]);
          } else {
            return err_message;
          }
        } catch (e) {
          return err_message;
        }
      };*/
    case "add":
      return async () => {
        let who = await get_privilige(client, ctx.message.from.id);
        console.log("result of privilige level query:", who);
        const err_message = `😕\nDo you even know how to use this?\n<code>!add</code>: <i>${commands.add.desc}</i>\n\n${commands.add.usage}\n`;

        if (is_able(who, commands.add.level)) {
          let message_id = get_message_id(ctx);
          if (message_id == -1) {
            return err_message;
          }
          await client.query(q.add_movie, [message_id, ctx.message.from.id]);
          return "Added brother.\n👌👌\n😊";
        }
        console.log("privilige:", who);
        return err_message;
      };
    case "start":
      return async () => {
        let user_id = ctx.message.from.id;
        let subbed = await is_subbed(client, user_id);
        if (!subbed) {
          return `😕\n\n\nDude, you are not even subbed.`;
        }
        await client.query(q.start_notifications, [user_id]);
        return `Done! 😊\n\nI will try my best to notify you.\n\n🔔<i>Notifications are enabled now.</i>`;
      };
    case "stop":
      return async () => {
        let user_id = ctx.message.from.id;
        let subbed = await is_subbed(client, user_id);
        if (!subbed) {
          return `😕\n\n\nDude, you are not even subbed.`;
        }
        await client.query(q.stop_notifications, [user_id]);
        return `Okay. I get it.😞\n\nI will stop bothering you.\n\n🔕<i>Notifications are disabled now.</i>`;
      };
    case "who":
      return async () => {
        const message_id = get_message_id(ctx);
        // const err_message =
        // "I don't know you. Maybe something bad has happened.\n\nI am the one who gets to say sorry here.😢";
        let user_id = ctx.message.from.id;
        let username = ctx.message.from.username;
        if (message_id != -1) {
          // wants to know someone elses.
          user_id = ctx.message.reply_to_message.from.id;
          username = ctx.message.reply_to_message.from.username;
        }
        let who = await get_privilige(client, user_id);
        let res = await client.query(q.select_subs);
        console.log("sub", res);
        // console.log(res);
        switch (who) {
          case "USER":
            return `You wanted to know about <i>${username}</i>? 😳\n\n${commands.who.user_string}`;
          case "GOD":
            return `You wanted to know about <i>${username}</i>? 😳\n\n${commands.who.god_string}`;
          default:
            return `You wanted to know about <i>${username}</i>? 😳\n\n${commands.who.nobody_string}`;
        }
      };
    case "sub":
      return async () => {
        const err_message = `Hello, fellow Homo Sapien.\nPlease try to live up with the standard.\nYou are already subscribed.😂😂`;
        try {
          // console.log(ctx.message.from.username);
          // console.log(ctx.message.from.id);

          let res = await client.query(q.subscribe, [
            ctx.message.from.id,
            ctx.message.from.username
          ]);
          return commands.sub.success_message;
        } catch (e) {
          return err_message;
        }
      };
    case "promote":
      return async () => {
        const err_message =
          "😡\n\nYou have no <i>right</i> to do this.\n\nEthically, morally and legally.";
        let message_id = get_message_id(ctx);
        if (message_id != -1) {
          let who_to_promote_id = ctx.message.reply_to_message.from.id;
          let who_to_promote_username =
            ctx.message.reply_to_message.from.username;
          let who_is_promoting_id = ctx.message.from.id;
          let promoter_privilige = await get_privilige(
            client,
            who_is_promoting_id
          );
          // if the guy that we are promoting is not subbed, we need to insert into subbed first, and set his level to god
          let subbed = await is_subbed(client, who_to_promote_id);
          if (subbed === false) {
            // he is not subbed, first sub;
            await client.query(q.subscribe, [
              who_to_promote_id,
              who_to_promote_username
            ]);
          }
          if (is_able(promoter_privilige, commands.promote.level)) {
            await client.query(q.update_privilige, [who_to_promote_id, "GOD"]);
            return `Done!😊\n\n@${who_to_promote_username} is a GOD now.🥳🥳\n\nI hope he knows that with great power, comes great responsibility.`;
          }
        } else {
          return `Who do you want to promote?\n\nObviously you cannot promote yourself.😅😅\n\n${commands.promote.usage}`;
        }
        return err_message;
      };
    default:
      return async () => "Not implemented yet. 😊";
  }
};

exports.is_command = is_command;
exports.handle_command = handle_command;
exports.get_message_id = get_message_id;
