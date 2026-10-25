const axios = require("axios");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help2",
    version: "2.1.0",
    author: "💠 HRIDOY HASAN SHANTO 💠",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Simple help menu"
    },
    longDescription: {
      en: "Show all commands or command details"
    },
    category: "info",
    guide: {
      en: "{pn} [command name]"
    },
    priority: 1
  },

  onStart: async function ({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID);

    // COMMAND DETAILS
    if (args[0]) {
      const name = args[0].toLowerCase();
      const alias = aliases.get(name);
      const command = commands.get(name) ||
        (alias ? commands.get(alias) : null);

      if (!command || !command.config) {
        return message.reply(`❌ Command "${name}" not found.`);
      }

      const cfg = command.config;

      if ((cfg.role || 0) > role) {
        return message.reply("⛔ এই কমান্ড ব্যবহারের অনুমতি নেই।");
      }

      const roleNames = {
        0: "All users",
        1: "Group administrators",
        2: "Bot administrators"
      };

      const guide = cfg.guide?.en || "{pn}";
      const usage = guide
        .replace(/\{pn\}/g, `${prefix}${cfg.name}`)
        .replace(/\{p\}/g, prefix)
        .replace(/\{n\}/g, cfg.name);

      const description =
        cfg.longDescription?.en ||
        cfg.shortDescription?.en ||
        "No description";

      return message.reply(
        `╭──────〔 COMMAND INFO 〕──────╮\n` +
        `│ 🔹 Name: ${cfg.name}\n` +
        `│ 📝 Description: ${description}\n` +
        `│ 👑 Author: ${cfg.author || "Unknown"}\n` +
        `│ 🔖 Version: ${cfg.version || "1.0"}\n` +
        `│ 🔐 Role: ${roleNames[cfg.role || 0] || "Special"}\n` +
        `│ 📌 Usage: ${usage}\n` +
        `╰────────────────────────╯\n` +
        `💠 HRIDOY HASAN SHANTO 💠`
      );
    }

    // COMMAND LIST
    const categories = new Map();

    for (const [name, command] of commands) {
      if (!command || !command.config) continue;
      if ((command.config.role || 0) > role) continue;

      const category = command.config.category || "Other";

      if (!categories.has(category)) {
        categories.set(category, []);
      }

      categories.get(category).push(name);
    }

    let total = 0;

    for (const [, command] of commands) {
      if (command?.config && (command.config.role || 0) <= role) {
        total++;
      }
    }

    let msg =
      `╭──────〔 💠 HRIDOY BOT 〕──────╮\n` +
      `│ 📚 Help Menu\n` +
      `│ 🔑 Prefix: ${prefix}\n` +
      `│ ⚡ Total Commands: ${total}\n` +
      `╰──────────────────────────╯\n`;

    for (const category of [...categories.keys()].sort()) {
      const names = categories.get(category).sort();

      msg += `\n╭──〔 📂 ${category.toUpperCase()} 〕\n`;

      for (let i = 0; i < names.length; i += 3) {
        msg += `│ ${names.slice(i, i + 3).join(" | ")}\n`;
      }

      msg += `╰────────────────────\n`;
    }

    msg +=
      `\n📌 বিস্তারিত: ${prefix}help2 commandName\n` +
      `💠 HRIDOY HASAN SHANTO 💠`;

    // HELP IMAGE
    const imageUrl = "https://i.imgur.com/IanBTgA.jpeg";

    try {
      const response = await axios.get(imageUrl, {
        responseType: "stream",
        timeout: 15000
      });

      return message.reply({
        body: msg,
        attachment: response.data
      });
    } catch (error) {
      return message.reply(msg);
    }
  }
};
