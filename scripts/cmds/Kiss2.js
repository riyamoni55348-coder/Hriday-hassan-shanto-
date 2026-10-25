const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

/**
* @author MahMUD
* @author: do not delete it
*/

module.exports = {
  config: {
    name: "kiss2",
    aliases: ["k2"],
    version: "1.7",
    author: "MahMUD",
    role: 0,
    category: "fun",
    cooldown: 8,
    guide: "kiss2 [mention/reply/UID]",
  },

  onStart: async function ({ api, event, args }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage(
        "You are not authorized to change the author name.",
        event.threadID,
        event.messageID
      );
    }

    const { threadID, messageID, messageReply, mentions, senderID } = event;

    let id2;

    // reply support
    if (messageReply) {
      id2 = messageReply.senderID;

    // mention support
    } else if (Object.keys(mentions).length > 0) {
      id2 = Object.keys(mentions)[0];

    // UID support
    } else if (args[0]) {
      id2 = args[0];

    } else {
      return api.sendMessage(
        "👉 Reply, mention or provide UID of the target.",
        threadID,
        messageID
      );
    }

    try {
      const url = `${await baseApiUrl()}/api/dig?type=kiss&user=${senderID}&user2=${id2}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });

      const filePath = path.join(__dirname, `kiss_${id2}.png`);
      fs.writeFileSync(filePath, response.data);

      api.sendMessage(
        {
          attachment: fs.createReadStream(filePath),
          body: `জান উফ সেই স্বাদ 💋`
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

    } catch (err) {
      console.error(err);
      api.sendMessage("🥹 error, contact Farhan.", threadID, messageID);
    }
  }
};
