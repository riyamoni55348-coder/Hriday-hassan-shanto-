
const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ===== AUTHOR =====
const LOCKED_AUTHOR = "HRIDOY HASAN SHANTO";

module.exports = {
  config: {
    name: "owner",
    aliases: ["admin", "intro", "contact"],
    version: "4.1.0",
    author: LOCKED_AUTHOR,
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "Owner Information"
    },
    description: {
      en: "Owner and bot information panel"
    },
    category: "owner"
  },

  onStart: async function ({
    api,
    event,
    usersData,
    threadsData,
    message
  }) {
    try {
      // ===== AUTHOR CHECK =====
      if (module.exports.config.author !== LOCKED_AUTHOR) {
        return message.reply(
          "⛔ Author modified! This command is disabled."
        );
      }

      // ===== OWNER INFORMATION =====
      const ownerName = "Šħẫňto Hřiȡẫy Ħẫššẫň";
      const ownerReligion = "ISLAM";
      const ownerRelation = "SINGLE";
      const ownerAddress = "MALAYSIA";
      const ownerAge = "20";

      // ===== CONTACT =====
      const facebook = "fb.com/MR.MUNNA.220";
      const whatsapp = "wa.me/601116710390";
      const telegram = "t.me/DEVIL_FARHAN_420";
      const youtube = "yb.com/@munna-vai-mbs";

      // ===== BOT INFORMATION =====
      const botName =
        global.GoatBot?.config?.nickNameBot || "HRIDOY BOT";

      const prefix =
        global.GoatBot?.config?.prefix || "/";

      const totalCommands =
        global.GoatBot?.commands?.size || 0;

      // ===== USERS & GROUPS =====
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();

      const totalUsers = allUsers.length;
      const totalGroups = allThreads.length;

      // ===== UPTIME =====
      const uptime = process.uptime();

      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeText =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // ===== DATE & TIME =====
      const now = moment().tz("Asia/Kuala_Lumpur");
      const time = now.format("hh:mm:ss A");
      const date = now.format("DD/MM/YYYY");

      // ===== CACHE DIRECTORY =====
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const videoPath = path.join(cacheDir, "owner.mp4");
      const videoUrl = "https://files.catbox.moe/wzosnu.mp4";

      // ===== DOWNLOAD VIDEO =====
      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
        timeout: 30000
      });

      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
        response.data.on("error", reject);
      });

      // ===== OWNER PANEL MESSAGE =====
      const msg = `
╔═══✦════════════✦═══╗
║ 👑 𝐎𝐖𝐍𝐄𝐑 𝐏𝐀𝐍𝐄𝐋 👑 ║
╚═══✦════════════✦═══╝

┏━━━━━━━━━━━━━━━━━━┓
┃ 👑 NAME: ${ownerName}
┃ 🕌 RELIGION: ${ownerReligion}
┃ 💞 RELATION: ${ownerRelation}
┃ 🌏 LOCATION: ${ownerAddress}
┃ 🎂 AGE: ${ownerAge}
┃ 🟢 ACTIVE: 24/7
┗━━━━━━━━━━━━━━━━━━┛

╭──── 📱 CONTACT ME ────╮
│ 🌐 FACEBOOK
│ └─ ${facebook}
│ 💬 WHATSAPP
│ └─ ${whatsapp}
│ ✈️ TELEGRAM
│ └─ ${telegram}
│ ▶️ YOUTUBE
│ └─ ${youtube}
╰──────────────────────╯

╭───── 🤖 BOT DETAILS ─────╮
│ ⚡ NAME: ${botName}
│ 👥 USERS: ${totalUsers}
│ 💬 GROUPS: ${totalGroups}
│ 📦 COMMANDS: ${totalCommands}
│ 🔰 PREFIX: ${prefix}
╰─────────────────────────╯

╭──────── 🕒 TIME ────────╮
│ 📅 DATE: ${date}
│ ⏰ TIME: ${time}
│ ⏳ UPTIME: ${uptimeText}
╰────────────────────────╯

╔═══✦════════════✦═══╗
║ 💠 HRIDOY HASAN SHANTO 💠 ║
║    THANKS FOR USING    ║
╚═══✦════════════✦═══╝
`;

      // ===== SEND MESSAGE + VIDEO =====
      try {
        await message.reply({
          body: msg,
          attachment: fs.createReadStream(videoPath)
        });
      } finally {
        // ===== CLEANUP =====
        setTimeout(async () => {
          try {
            await fs.remove(videoPath);
          } catch (error) {
            console.error("Video cleanup error:", error.message);
          }
        }, 10000);
      }

    } catch (err) {
      console.error("Owner command error:", err);

      return message.reply(
        "❌ Owner command error. Check the bot console logs."
      );
    }
  }
};
