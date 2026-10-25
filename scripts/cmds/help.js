
const axios = require("axios");
const { getPrefix, getStreamFromURL } = global.utils;
const { commands } = global.GoatBot;

let xfont = {};
let yfont = {};
let categoryEmoji = {};

const HELP_GIF = "https://files.catbox.moe/6touzq.mp4";

async function loadResources() {
  try {
    const [x, y, c] = await Promise.all([
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/xfont.json", { timeout: 8000 }),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/yfont.json", { timeout: 8000 }),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/category.json", { timeout: 8000 })
    ]);

    xfont = x.data || {};
    yfont = y.data || {};
    categoryEmoji = c.data || {};
  } catch (error) {
    console.error("[HELP] Resource loading failed:", error.message);
  }
}

function fontConvert(text, type = "command") {
  const map = type === "category" ? xfont : yfont;

  return String(text)
    .split("")
    .map(char => map[char] || char)
    .join("");
}

function getCategoryEmoji(category) {
  return categoryEmoji[String(category).toLowerCase()] || "🗂️";
}

function findCommand(name) {
  const target = String(name).toLowerCase();

  for (const [, cmd] of commands) {
    const config = cmd?.config;
    if (!config) continue;

    if (String(config.name).toLowerCase() === target) {
      return cmd;
    }

    const aliases = config.aliases;

    if (Array.isArray(aliases) &&
        aliases.some(alias => String(alias).toLowerCase() === target)) {
      return cmd;
    }

    if (typeof aliases === "string" &&
        aliases.toLowerCase() === target) {
      return cmd;
    }
  }

  return null;
}

async function replyWithDesign(message, body) {
  try {
    const attachment = await getStreamFromURL(HELP_GIF);
    return message.reply({ body, attachment });
  } catch (error) {
    console.error("[HELP] Attachment failed:", error.message);
    return message.reply(body);
  }
}

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "3.0.0",
    author: "💠 HRIDOY HASAN SHANTO 💠",
    countDown: 3,
    role: 0,
    category: "info",
    shortDescription: "Stylish command menu",
    guide: "{pn} | {pn} <command> | {pn} -c <category>"
  },

  onStart: async function ({ message, args, event, role }) {
    if (!Object.keys(xfont).length ||
        !Object.keys(yfont).length ||
        !Object.keys(categoryEmoji).length) {
      await loadResources();
    }

    const prefix = getPrefix(event.threadID);
    const input = args.join(" ").trim();

    // 📂 Collect commands available to this role
    const categories = {};

    for (const [name, cmd] of commands) {
      const config = cmd?.config;
      if (!config) continue;

      if (Number(config.role ?? 0) > Number(role ?? 0)) continue;

      const category = String(
        config.category || "UNCATEGORIZED"
      ).toUpperCase();

      if (!categories[category]) categories[category] = [];

      categories[category].push(String(config.name || name));
    }

    // 🗂️ Category details
    if (args[0]?.toLowerCase() === "-c" && args[1]) {
      const category = args[1].toUpperCase();
      const list = categories[category];

      if (!list) {
        return message.reply(`❌📂 Category "${category}" not found!`);
      }

      let msg = `╔════『 ${getCategoryEmoji(category)}💠 』════╗
✨📂 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘: ${fontConvert(category, "category")}
╚══════════════════════╝\n\n`;

      for (const name of [...list].sort()) {
        msg += `┃ ⚡💎 ${fontConvert(name)}\n`;
      }

      msg += `╰━━━━━━━━━━━━━━━━━━━━╯
📊✨ 𝐓𝐎𝐓𝐀𝐋: ${list.length}
🔑💠 𝐏𝐑𝐄𝐅𝐈𝐗: ${prefix}
👑💖 𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💖`;

      return replyWithDesign(message, msg);
    }

    // 💠 Main menu
    if (!input) {
      let msg = `╔══════『 💠🔥💠 』══════╗
     👑 𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 👑
 ✨💎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐇𝐄𝐋𝐏 𝐂𝐄𝐍𝐓𝐄𝐑 💎✨
╚══════『 👑💠👑 』══════╝\n\n`;

      for (const category of Object.keys(categories).sort()) {
        msg += `╭━━━『 ${getCategoryEmoji(category)}✨ ${fontConvert(category, "category")} 』━━━╮\n`;

        for (const name of [...categories[category]].sort()) {
          msg += `┃ ⚡💎 ${fontConvert(name)}\n`;
        }

        msg += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
      }

      const total = Object.values(categories)
        .reduce((sum, list) => sum + list.length, 0);

      msg += `╭━━━『 📊💠 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 💠📊 』━━━╮
┃ 🤖🔥 𝐁𝐎𝐓: HRIDOY BOT
┃ 📚✨ 𝐓𝐎𝐓𝐀𝐋: ${total}
┃ 🔑💫 𝐏𝐑𝐄𝐅𝐈𝐗: ${prefix}
┃
┃ 📖🎯 ${prefix}help
┃ 🔍💎 ${prefix}help command
┃ 🗂️✨ ${prefix}help -c category
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 👑💖 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 💖👑 』━━━╮
┃ 💠 HRIDOY HASAN SHANTO 💠
┃ 🔥✨ THANKS FOR USING HRIDOY BOT
╰━━━━━━━━━━━━━━━━━━━━╯`;

      return replyWithDesign(message, msg);
    }

    // 📄 Show only the command name
    const cmd = findCommand(input);

    if (!cmd) {
      return message.reply(`❌🔍 "${input}" কমান্ডটি পাওয়া যায়নি!`);
    }

    const infoMsg = `
╔══════『 💠📂💠 』══════╗
   👑✨ 𝐅𝐈𝐋𝐄 𝐍𝐀𝐌𝐄 ✨👑
╚══════『 🔥💎🔥 』══════╝

╭━━━『 📁💫 𝐅𝐈𝐋𝐄 𝐈𝐍𝐅𝐎 💫📁 』━━━╮
┃
┃ 📂⚡ 𝐍𝐀𝐌𝐄: ${cmd.config.name} 💠
┃
╰━━━━━━━━━━━━━━━━━━━━╯

💠👑 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎 👑💠
`;

    return replyWithDesign(message, infoMsg);
  }
};
