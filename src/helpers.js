let commands = require("./commands.json");
const { q } = require("./queries");

const exclude_list = Object.keys(commands).filter(
  each => commands[each].exclude_from_delete === true
);

// Determine if the environment is production / dev
// If DEV_DATABASE_URL exists in the environment then it's a dev environment otherwise it's a production environment
const is_prod = () => process.env.DEV_DATABASE_URL === undefined;

const is_command = c => {
  c = c.split(" ")[0];
  if (!c || c.length == 1) return false;
  let one = 0;
  c.split("").forEach(each => {
    if (each == "!" || each == "/") one++;
  });

  return (c[0] == "!" || c[0] == "/") && one == 1;
};

const get_message_id = ctx => {
  return ctx.message.reply_to_message
    ? ctx.message.reply_to_message.message_id
    : -1;
};

const is_able = (who_is, who_can) => {
  who_is = who_is.toUpperCase();
  who_can = who_can.toUpperCase();
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

const get_username = message_context => {
  let username = message_context.from.username;
  let is_it = true;
  if (!username) {
    // because some imbeciles don't have usernames, wtf
    username = message_context.from.first_name;
    is_it = false;
  }
  return { has: is_it, username };
};

const mention_user = user_id => {
  return `tg://user?id=${user_id}`;
};

const get_chat_id = id => {
  //strip -100 from the id, cause it's a supergroup
  // also overflows for integer type so
  //idc about non-supergroups?
  let group_id = `${-1 * id}`;
  group_id = group_id.substring(3, group_id.length);
  return group_id;
};

const delete_messages = async (client, ctx) => {
  let res = await client.query(q.get_messages_to_delete);
  if (res.rowCount < 1) {
    return;
  }

  res.rows.forEach(async row => {
    // add -100, cause supergroup
    let chat_id = Number(`-100${row.chat_id}`);
    try {
      await ctx.telegram.deleteMessage(chat_id, row.message_id);
    } catch (e) {
      console.log(`couldn't delete message:${row.message_id}`);
      console.error(e);
    }
    try {
      await ctx.telegram.deleteMessage(chat_id, row.reply_id);
    } catch (e) {
      console.log(`couldn't delete reply: ${row.reply_id}`);
      console.error(e);
    }
    try {
      await client.query(q.update_delete_queue, [row.id]);
    } catch (e) {
      console.log(`couldn't update delete_queue: ${row.message_id}`);
      console.error(e);
    }
  });
};

// to handle user commands, substitute %s's of the command with desired text
const substitute = (cmd, text) => {
  let replacement = cmd.split(" ").slice(1);
  replacement = replacement.join(" ");
  console.log("replacement is ", replacement);
  // TODO: Fix this, don't know regex
  text = text.replace(new RegExp("%s", "g"), replacement);
  console.log("Final reply should be ", text);
  return text;
};

const sanitize_cmd = cmd => {
  let at_exists = cmd.search("@");
  if (at_exists != -1) {
    cmd = cmd.substr(0, at_exists);
  }
  cmd = cmd.replace(new RegExp("[!/]+", "g"), "");
  return cmd;
};
const handle_command = (client, cmd, ctx) => {
  let c = cmd.split(" ");
  console.log("command before is: ", c);
  c = sanitize_cmd(c[0]);
  console.log("command is:", c);
  switch (c) {
    case "help":
      return async () => {
        let res = `Yo.😡\nHumanity was a mistake.\n\nI don't <b>want</b> to help you, but then you won't shut up...So, I guess I'll have to force myself into helping you.`;
        res = `${res}\n\nAnyways, these are the core commands I currently support.\n\n`;
        Object.keys(commands).map(each => {
          res = `${res}<code>!${each}</code> => ${commands[each].desc}`;
          if (commands[each].status == "Not Implemented") {
            res = `${res}(not implemented yet).`;
          }
          res = `${res}\n\n`;
        });
        let cool = await client.query(q.get_user_commands);
        if (cool.rowCount != 0 && cool.rows) {
          res = `${res}\n\nI also support these user added commands. So, if you think it's stupid, you should know that I was also thinking the same.\n\n`;
          cool.rows.forEach(row => {
            res = `${res}\n<code>${row.command}</code> => ${substitute(
              `$!{row.command} [message]`,
              row.text
            )}`;
          });
        }
        return res;
      };
    case "notify":
      return async () => {
        let who = await get_privilige(client, ctx.message.from.id);
        if (!is_able(who, commands.notify.level)) {
          return commands.notify.usage;
        }
        res = await client.query(q.get_notified_users);
        const { has, username } = get_username(ctx.message);
        let group_id = get_chat_id(ctx.message.chat.id);
        let temp = "Cool. I'm doing what I can.";
        res.rows.map(async each => {
          try {
            const is_self = each.id == ctx.message.from.id;
            await ctx.telegram.sendMessage(
              each.id,
              `${
                is_self ? `<i>This is what I sent to everyone.</i>\n` : ``
              }Yo.\n<i>${username}</i> wants to tell y'all something.
              \n\n <a href="https://t.me/c/${group_id}/${
                ctx.message.message_id
              }">Take a look.</a>
            \n\n<i>You are recieving this because you asked me to do so.</i>\n${
              !has ? "Also, why don't you have a username yet?" : ""
            }`,
              { parse_mode: "HTML" }
            );
          } catch (e) {
            console.log(
              `This guy probably doesn't want to talk to me: ${each.username}`
            );
            temp = `${temp}\nThis guy probably doesn't want to talk to me: ${each.username}`;
          }
        });
        return temp;
      };
    case "rate":
      return async () => "Not implemented yet. 😊";
    /*
      return async () => {
        let res = cmd.split(" ");
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
        let { has, username } = get_username(ctx.message);
        if (message_id != -1) {
          // wants to know someone elses.
          user_id = ctx.message.reply_to_message.from.id;
          username = get_username(ctx.message.reply_to_message);
          has = username.has;
          // oh dear god pls forgive me for this.
          username = username.username;
        }
        let who = await get_privilige(client, user_id);
        switch (who) {
          case "USER":
            return `You wanted to know about <i>${username}</i>? 😳\n\n${
              commands.who.user_string
            }.\n${
              !has
                ? "\n<i>The sad part is, he doesn't have a username.</i>"
                : ""
            }`;
          case "GOD":
            return `You wanted to know about <i>${username}</i>? 😳\n\n${
              commands.who.god_string
            }.\n${
              !has
                ? "\n<i>The sad part is, he doesn't have a username.</i>"
                : ""
            }`;
          default:
            return `You wanted to know about <i>${username}</i>? 😳\n\n${
              commands.who.nobody_string
            }.\n${
              !has
                ? "\n<i>The sad part is, he doesn't have a username.</i>"
                : ""
            }`;
        }
      };
    case "sub":
      return async () => {
        const err_message = `Hello, fellow Homo Sapien.\nPlease try to live up with the standard.\nYou are already subscribed.😂😂`;
        try {
          // console.log(get_username(ctx.message));
          // console.log(ctx.message.from.id);
          let { has, username } = get_username(ctx.message);
          // user needs to click on start button, otherwise the bot can't initiate a conversation with a user.

          await client.query(q.subscribe, [ctx.message.from.id, username]);
          return `Tap Here -> ${
            ctx.BOT_USERNAME
          }, then tap on start button, otherwise I won't be able to talk to you.\n\n\n${
            commands.sub.success_message
          }.\n\n\n${!has ? "Bruh. Why don't you have a username yet?" : ""}`;
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
          let who_to_promote_username = get_username(
            ctx.message.reply_to_message
          ).username;

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
            return `Done!😊\n\n<i>${who_to_promote_username}</i> is a GOD now.🥳🥳\n\nI hope he knows that with great power, comes great responsibility.`;
          }
        } else {
          return `Who do you want to promote?\n\nObviously you cannot promote yourself.😅😅\n\n${commands.promote.usage}`;
        }
        return err_message;
      };
    case "suggest":
      return async () => {
        // send DMs to GODs(only those who have notifications enabled.)
        let gods = await client.query(q.get_active_gods, ["GOD"]);
        let message_id = get_message_id(ctx);
        if (message_id == -1) {
          return `Hello there fellow pleb, you don't know how to use this command.\n\n<i>${commands.suggest.usage}</i>`;
        }
        if (gods.rowCount > 0) {
          gods = gods.rows;
        } else {
          return commands.suggest.err_message;
        }
        let who_is_suggesting_username = get_username(ctx.message).username;
        let forward_from_chat_id = ctx.message.chat.id;
        let message_forward_id = ctx.message.message_id;
        let group_id = get_chat_id(forward_from_chat_id);
        gods.map(async each => {
          let user_id = each.id;
          try {
            await ctx.telegram.sendMessage(
              user_id,
              `<i>${who_is_suggesting_username}</i> is suggesting something to add to our epic collection.
              \n\n <a href="https://t.me/c/${group_id}/${message_forward_id}">Check out here.</a>
            \n\n<i>You are recieving this because you are a GOD.</i>`,
              { parse_mode: "HTML" }
            );
            // await ctx.telegram.forwardMessage(
            //   user_id,
            //   forward_from_chat_id,
            //   message_forward_id
            // );
          } catch (e) {
            console.log(
              "Cannot send a message to the user, because bots cannot initiate a conversation with a user"
            );
            console.log(
              `This guy probably doesn't want to talk to me: ${each.username}`
            );
          }
        });
        return "Oh, you want to add a movie?\n\nCool. I took care of it. Some GOD will be on it soon.\n\nThank you. ☺️☺️";
      };
    case "delete":
      return async () => {
        // testing delete queue
        await delete_messages(client, ctx);
        return "Deleted unimportant messages that were older than 5 minutes.";
      };
    case "alias":
      return async () => {
        let who = await get_privilige(client, ctx.message.from.id);
        console.log("result of privilige level query:", who);
        const err_message = `😕\nDo you even know how to use this?\n<code>!alias</code>: <i>${commands.alias.desc}</i>\n\n${commands.alias.usage}\n`;

        if (is_able(who, commands.alias.level)) {
          // check if first argument is already not an alias / command
          let args = cmd.split(" ");
          if (args.length != 3) {
            return err_message;
          }
          let alias_str = sanitize_cmd(args[1]);
          let cmd_str = sanitize_cmd(args[2]);
          let exists_alias = await client.query(q.get_cmd, [alias_str]);
          if (
            alias_str in Object.keys(commands) ||
            exists_alias.rowCount != 0
          ) {
            return `There is already a command for ${alias_str}.\n\n${err_message}`;
          }
          // check if second argument is already a command
          let exists_cmd = await client.query(q.get_cmd, [cmd_str]);
          if (exists_cmd.rowCount == 0) {
            return `There's no such command ${cmd_str}.\n\n${err_message}`;
          }
          if (cmd_str in Object.keys(commands)) {
            return `For now, you cannot alias something to core commands.\n\n${err_message}`;
          }

          // now it's okay to add that alias
          // TODO: Have a separate table for aliases, for now, it's unnecessarily duplicating data.
          await client.query(q.add_alias, [alias_str, cmd_str]);

          return `Done.😊\n\n Aliased <code>${cmd_str}</code> to <code>${alias_str}</code>`;
        }
        return err_message;
      };

    case "addcmd":
      return async () => {
        let who = await get_privilige(client, ctx.message.from.id);
        console.log("result of privilige level query:", who);
        const err_message = `😕\nDo you even know how to use this?\n<code>!alias</code>: <i>${commands.addcmd.desc}</i>\n\n${commands.addcmd.usage}\n`;

        if (is_able(who, commands.addcmd.level)) {
          // check if first argument is already not an alias / command
          let args = cmd.split(" ");
          if (args.length < 3) {
            return err_message;
          }
          let cmd_str = sanitize_cmd(args[1]);
          let text = args.slice(2).join(" ");
          let exists_cmd = await client.query(q.get_cmd, [cmd_str]);
          if (cmd_str in Object.keys(commands) || exists_cmd.rowCount != 0) {
            return `There is already a command for <code>!${cmd_str}</code>.\n\n${err_message}`;
          }
          console.log(`Command to be added ${cmd_str} and text is ${text}`);
          await client.query(q.add_cmd, [cmd_str, text]);
          return `Done.😊\n\n Added command <code>${cmd_str}</code>`;
        }
        return err_message;
      };

    case "updatecmd":
      return async () => {
        let who = await get_privilige(client, ctx.message.from.id);
        console.log("result of privilige level query:", who);
        const err_message = `😕\nDo you even know how to use this?\n<code>!updatecmd</code>: <i>${commands.updatecmd.desc}</i>\n\n${commands.updatecmd.usage}\n`;

        if (is_able(who, commands.updatecmd.level)) {
          // check if first argument is already a user command / alias
          let args = cmd.split(" ");
          if (args.length < 3) {
            return err_message;
          }
          let cmd_str = sanitize_cmd(args[1]);
          let exists_cmd = await client.query(q.get_cmd, [cmd_str]);
          if (cmd_str in Object.keys(commands)) {
            return `Cannot update core commands. ${cmd_str}.\n\n${err_message}`;
          }
          if (exists_cmd.rowCount == 0) {
            return `There's no such command as <code>${cmd_str}</code>.\n\n${err_message}`;
          }

          let text = args.slice(2).join(" ");
          // now it's okay to add that alias
          // TODO: Have a separate table for aliases, for now, it's unnecessarily duplicating data.
          await client.query(q.update_cmd, [cmd_str, text]);

          return `Done.😊\n\nUpdated <code>${cmd_str}</code>.`;
        }
        return err_message;
      };
    case "deletecmd":
      return async () => {
        let args = cmd.split(" ");
        let who = await get_privilige(client, ctx.message.from.id);
        console.log("result of privilige level query:", who);
        const err_message = `😕\nDo you even know how to use this?\n<code>!deletecmd</code>: <i>${commands.deletecmd.desc}</i>\n\n${commands.deletecmd.usage}\n`;
        if (args.length != 2) {
          return err_message;
        }
        let cmd_str = args[1];
        if (is_able(who, commands.deletecmd.level)) {
          await client.query(q.delete_cmd, [cmd_str]);
          return `Done.😊\n\nDeleted <code>${cmd_str}</code> and it's possible aliases.`;
        }
        return err_message;
      };
    default:
      return async () => {
        let cool = await client.query(q.get_cmd, [c]);
        let res = "Not implemented yet. 😊";
        console.log(cool);
        if (cool.rowCount != 0 && cool.rows) {
          let text = cool.rows[0].text;
          console.log(text);
          res = substitute(cmd, text);
        }
        return res;
      };
  }
};

exports.is_command = is_command;
exports.is_able = is_able;
exports.handle_command = handle_command;
exports.get_message_id = get_message_id;
exports.get_chat_id = get_chat_id;
exports.substitute = substitute;
exports.sanitize_cmd = sanitize_cmd;
exports.exclude_list = exclude_list;
exports.is_prod = is_prod;
exports.commands = commands;
