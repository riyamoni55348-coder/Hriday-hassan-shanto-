/**
 * ╔══════════════════════════════════════════╗
 * ║            💠 GOD BOT OWNER 💠            ║
 * ║          HRIDOY HASAN SHANTO              ║
 * ╚══════════════════════════════════════════╝
 */

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "2.0.0",
    author: "💠 HRIDOY HASAN SHANTO 💠",
    role: 0,
    countDown: 5,
    shortDescription: "Bot owner information",
    longDescription: "Displays bot owner information with a photo.",
    category: "Information",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const ownerText = `
╭━━━〔 💠 OWNER INFO 💠 〕━━━╮
┃
┃ 👑 Name: হৃদয় হাসান শান্ত
┃ 💠 Nickname: HRIDOY
┃ 💘 Relationship: Single
┃ 🎓 Profession: Student
┃ 🏡 Home District: Bogura, Bangladesh
┃ 🌏 Current Country: Malaysia
┃
┣━━━〔 🔗 CONTACT 〕━━━┫
┃ 📘 Facebook:
┃ https://www.facebook.com/
┃
┃ 💬 Messenger:
┃ https://www.messenger.com/
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

💠 BOT DEVELOPER
HRIDOY HASAN SHANTO
`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    try {
      await fs.ensureDir(cacheDir);

      // ছবি ডাউনলোডের লিংক
      const imgLink = "https://i.imgur.com/1G4ZhU7.jpeg";

      let imageBuffer = null;

      try {
        const response = await axios.get(imgLink, {
          responseType: "arraybuffer",
          timeout: 10000,
          maxContentLength: 8 * 1024 * 1024
        });

        const contentType =
          response.headers["content-type"] || "";

        if (contentType.startsWith("image/")) {
          imageBuffer = Buffer.from(response.data);
          await fs.writeFile(imgPath, imageBuffer);
        }
      } catch (imageError) {
        console.error(
          "[OWNER IMAGE ERROR]",
          imageError.message
        );
      }

      // ছবি থাকলে ছবিসহ, না থাকলে শুধু টেক্সট
      if (imageBuffer && await fs.pathExists(imgPath)) {
        return api.sendMessage(
          {
            body: ownerText,
            attachment: fs.createReadStream(imgPath)
          },
          event.threadID,
          err => {
            if (err) {
              console.error("[OWNER SEND ERROR]", err);
            }

            fs.remove(imgPath).catch(() => {});
          },
          event.messageID
        );
      }

      return api.sendMessage(
        ownerText,
        event.threadID,
        err => {
          if (err) {
            console.error("[OWNER SEND ERROR]", err);
          }
        },
        event.messageID
      );

    } catch (error) {
      console.error("[OWNER COMMAND ERROR]", error);

      return api.sendMessage(
        "❌ Owner information পাঠাতে সমস্যা হয়েছে।",
        event.threadID,
        undefined,
        event.messageID
      );
    }
  }
};
