
const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const http = require("http");

const CREDIT = "💠 HRIDOY HASAN SHANTO 💠";

module.exports = {
  config: {
    name: "cutereply",
    version: "3.0.0",
    author: CREDIT,
    countDown: 1,
    role: 0,
    shortDescription: "Smart trigger reply",
    longDescription: "Automatic text, image and reaction replies",
    category: "system"
  },

  onStart: async function () {
    console.log(`✅ CuteReply V3 loaded | ${CREDIT}`);
  },

  onChat: async function ({ event, message, api }) {
    if (!event || !api || !event.body || !event.threadID) return;

    const body = String(event.body).toLowerCase().trim();
    const threadID = event.threadID;
    const messageID = event.messageID;

    if (!body || !messageID) return;

    try {
      if (
        typeof api.getCurrentUserID === "function" &&
        String(event.senderID) === String(api.getCurrentUserID())
      ) return;
    } catch (_) {}

    const triggers = [
      {
        words: [
          "হৃদয় হাসান শান্ত",
          "হৃদয় হাসান শান্ত",
          "Šħẫňto Hřiȡẫy Ħẫššẫň",
          "hriday hassan shanto"
        ],
        replies: [
          {
            text: "👉 হৃদয় হাসান শান্ত বস এখন বিজি, যা বলার আমাকে বলতে পারেন! 😼🥰",
            image: "https://i.imgur.com/vWIuNpc.jpeg"
          },
          {
            text: "🔥 বস হৃদয় হাসান শান্তকে ডাকিস না, পারলে একটা জি এফ দে! 😃",
            image: "https://i.imgur.com/mvjVHCD.jpeg"
          },
          {
            text: "😎 বস এখন বিজি আছে। ইনবক্সে মেসেজ দিয়ে রাখো! 🧡",
            image: "https://i.imgur.com/rkrXNso.jpeg"
          }
        ]
      },
      {
        words: ["@riya riya", "@asha moni", "@mim"],
        replies: [
          {
            text: "🤖 আমাকে মেনশন দিয়ে লাভ নাই! 😆 আমি একটা রোবট, শুধু ফান করার জন্য!",
            image: "https://i.imgur.com/soczOm3.jpeg"
          },
          {
            text: "😽 আমি একটা বট, বস হৃদয় হাসান শান্ত বানাইছে! 😎",
            image: "https://i.imgur.com/UZ7d8w7.jpeg"
          }
        ]
      }
    ];

    const matched = triggers.find(item =>
      item.words.some(word => body.includes(word))
    );

    if (!matched) return;

    // Per-group cooldown
    const now = Date.now();
    const previous = global.cuteReplyCooldown || new Map();

    if (now - (previous.get(String(threadID)) || 0) < 1500) return;

    previous.set(String(threadID), now);
    global.cuteReplyCooldown = previous;

    const reply =
      matched.replies[Math.floor(Math.random() * matched.replies.length)];

    const output =
      "╭━━━〔 💠 riya BOT 💠 〕━━━╮\n\n" +
      reply.text +
      "\n\n╰━━━〔 " + CREDIT + " 〕━━━╯";

    let filePath;

    try {
      filePath = path.join(
        __dirname,
        `cutereply_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`
      );

      await downloadImage(reply.image, filePath);

      await send(api, {
        body: output,
        attachment: fs.createReadStream(filePath)
      }, threadID, messageID);

    } catch (error) {
      console.error("[CuteReply] Image error:", error.message);

      try {
        await send(api, { body: output }, threadID, messageID);
      } catch (sendError) {
        console.error("[CuteReply] Send error:", sendError.message);
      }
    } finally {
      if (filePath) {
        await fs.remove(filePath).catch(() => {});
      }
    }

    if (typeof api.setMessageReaction === "function") {
      const reactions = ["😆", "🔥", "😂", "😎"];
      const emoji = reactions[Math.floor(Math.random() * reactions.length)];

      api.setMessageReaction(emoji, messageID, err => {
        if (err) console.error("[CuteReply] Reaction error:", err);
      }, true);
    }
  }
};

function send(api, data, threadID, replyToMessageID) {
  return new Promise((resolve, reject) => {
    api.sendMessage(data, threadID, err => {
      if (err) return reject(err);
      resolve();
    }, replyToMessageID);
  });
}

function downloadImage(url, destination, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      return reject(new Error("Too many redirects"));
    }

    let parsed;

    try {
      parsed = new URL(url);
    } catch (_) {
      return reject(new Error("Invalid image URL"));
    }

    if (!["https:", "http:"].includes(parsed.protocol)) {
      return reject(new Error("Unsupported URL protocol"));
    }

    const client = parsed.protocol === "https:" ? https : http;

    const request = client.get(parsed, response => {
      const status = response.statusCode || 0;

      if ([301, 302, 303, 307, 308].includes(status)) {
        const location = response.headers.location;
        response.resume();

        if (!location) return reject(new Error("Missing redirect URL"));

        return downloadImage(
          new URL(location, parsed).toString(),
          destination,
          redirects + 1
        ).then(resolve, reject);
      }

      if (status !== 200) {
        response.resume();
        return reject(new Error(`HTTP ${status}`));
      }

      const file = fs.createWriteStream(destination);

      file.on("error", reject);
      response.on("error", reject);
      file.on("finish", () => {
        file.close(err => err ? reject(err) : resolve(destination));
      });

      response.pipe(file);
    });

    request.setTimeout(15000, () => {
      request.destroy(new Error("Image download timed out"));
    });

    request.on("error", reject);
  });
}
