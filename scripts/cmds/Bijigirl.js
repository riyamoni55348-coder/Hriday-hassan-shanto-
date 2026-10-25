
/**
 * ╔══════════════════════════════════════════╗
 * ║             😂 BIJI GIRL V2              ║
 * ║          GOATBOT V2 / V3                 ║
 * ║       💠 HRIDOY HASAN SHANTO 💠          ║
 * ╚══════════════════════════════════════════╝
 */

const fs = require("fs-extra");
const axios = require("axios");
const canvas = require("canvas");
const path = require("path");

const CONFIG = {
  NAME: "bijigirl",
  VERSION: "2.0.0",
  COOLDOWN: 60 * 1000,
  TEMPLATE_URL: "https://i.imgur.com/pmiFQcO.jpeg",
  REF: { width: 1024, height: 1536 },
  AVATAR: { x: 405, y: 358, size: 250 },

  BOSS_NOTICE:
    "乛 𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 乛\nবসকে BIJI_GIRL করা যাবে না রে পাগলা! 😂"
};

const CAPTIONS = [
  "প্রেমিকা হতে চেয়েছিলাম রাজকন্যা 👸 এখন হাতে সাবান আর থালা-বাসন ধন্য! 🤣",
  "প্রেমের রাজ্যে রানী হবো ভেবেছিলাম 👑 কপালে দেখি হাঁড়ি-পাতিলের দায়িত্ব! 😂",
  "ভালোবাসার নামে করলাম ভুল 😵‍💫 এখন বাসন মাজাই আমার স্কুল! 🏫",
  "মা বলেছিল, মন দিয়ে পড় 📚 আমি বলেছিলাম প্রেমই বড়! এখন শুধু বাসন মাজা! 😭",
  "প্রেমিকা ভেবেছিলাম হবো মহারানী 👑 এখন হাঁড়ি-পাতিলের কাহিনী! 🤣",
  "বান্ধবীরা সবাই ঘুরতে যায় 😭 আমার কপালে বাসন মাজা! ওরা খায় বিরিয়ানি, আমি মাজি থালা! 😂",
  "সাবান বলে, আপু আর কত ঘষবি? 😂 থালা বলে, আমাকে কবে ছাড়বি?",
  "প্রেমিক বলেছিল, তুমি আমার রানী 👸 এখন বুঝি সবই ছিল মিথ্যে বাণী! 🤣",
  "বাসন মাজি হাসিমুখে 😂 দুঃখ লুকাই বুকের ভেতরে! 😭",
  "দুনিয়াতে কত রকমের শাস্তি! 😂 আমার কপালে বাসন মাজা ডিউটি!"
];

const lastUsed = new Map();

function getAdminIDs() {
  const ids = [];

  if (global.config && Array.isArray(global.config.ADMINBOT)) {
    ids.push(...global.config.ADMINBOT);
  }

  if (
    global.GoatBot &&
    global.GoatBot.config &&
    Array.isArray(global.GoatBot.config.adminBot)
  ) {
    ids.push(...global.GoatBot.config.adminBot);
  }

  return [...new Set(ids.map(String))];
}

function getTargetID(event) {
  const mentions = event.mentions || {};
  const mentionIDs = Object.keys(mentions);

  if (mentionIDs.length > 0) {
    return String(mentionIDs[0]);
  }

  if (event.messageReply && event.messageReply.senderID) {
    return String(event.messageReply.senderID);
  }

  return String(event.senderID);
}

async function getUserInfo(api, uid) {
  return new Promise((resolve, reject) => {
    api.getUserInfo(uid, (err, info) => {
      if (err) return reject(err);
      resolve(info && info[uid] ? info[uid] : {});
    });
  });
}

async function getAvatar(api, uid) {
  // প্রথমে GoatBot API থেকে প্রোফাইল ছবির URL নেওয়া হবে।
  try {
    const info = await getUserInfo(api, uid);

    if (info.thumbSrc) {
      const response = await axios.get(info.thumbSrc, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      return Buffer.from(response.data);
    }
  } catch (error) {
    // পরের পদ্ধতিতে চেষ্টা করবে।
  }

  // ব্যাকআপ: Facebook profile picture endpoint
  const response = await axios.get(
    `https://graph.facebook.com/${encodeURIComponent(uid)}/picture?width=512&height=512`,
    {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: { "User-Agent": "Mozilla/5.0" }
    }
  );

  return Buffer.from(response.data);
}

async function getName(api, usersData, uid) {
  try {
    if (usersData && typeof usersData.getName === "function") {
      const name = await usersData.getName(uid);
      if (name) return name;
    }
  } catch (error) {}

  try {
    const info = await getUserInfo(api, uid);
    if (info.name) return info.name;
  } catch (error) {}

  return "বান্ধবী";
}

module.exports = {
  config: {
    name: CONFIG.NAME,
    version: CONFIG.VERSION,
    author: "💠 HRIDOY HASAN SHANTO 💠",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Generate a funny Biji Girl meme"
    },
    longDescription: {
      en: "Create a Biji Girl meme with a user's profile picture and a random Bengali caption."
    },
    category: "image",
    guide: {
      en: "{pn} [@mention / reply]"
    },
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": ""
    }
  },

  onStart: async function ({ message, event, api, usersData }) {
    const senderID = String(event.senderID);
    const threadID = event.threadID;
    const admins = getAdminIDs();
    const isAdmin = admins.includes(senderID);
    const targetID = getTargetID(event);

    // বট অ্যাডমিনকে টার্গেট করা যাবে না।
    if (admins.includes(targetID)) {
      return message.reply(CONFIG.BOSS_NOTICE);
    }

    // সাধারণ ইউজারের জন্য ১ মিনিট কুলডাউন।
    if (!isAdmin) {
      const last = lastUsed.get(senderID) || 0;
      const remaining = CONFIG.COOLDOWN - (Date.now() - last);

      if (remaining > 0) {
        return message.reply(
          `⏳ আর ${Math.ceil(remaining / 1000)} সেকেন্ড অপেক্ষা করো!`
        );
      }
    }

    const cacheDir = path.join(__dirname, "cache");
    const outputPath = path.join(
      cacheDir,
      `bijigirl_${senderID}_${Date.now()}.jpg`
    );

    let cooldownStarted = false;

    try {
      await fs.ensureDir(cacheDir);

      // টেমপ্লেট ডাউনলোড।
      const templateResponse = await axios.get(CONFIG.TEMPLATE_URL, {
        responseType: "arraybuffer",
        timeout: 20000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const template = await canvas.loadImage(
        Buffer.from(templateResponse.data)
      );

      // টার্গেটের প্রোফাইল ছবি।
      const avatarBuffer = await getAvatar(api, targetID);
      const avatar = await canvas.loadImage(avatarBuffer);

      const width = template.width;
      const height = template.height;

      const output = canvas.createCanvas(width, height);
      const ctx = output.getContext("2d");

      ctx.drawImage(template, 0, 0, width, height);

      // টেমপ্লেটের মাপ অনুযায়ী ছবির অবস্থান স্কেল।
      const scaleX = width / CONFIG.REF.width;
      const scaleY = height / CONFIG.REF.height;

      const x = CONFIG.AVATAR.x * scaleX;
      const y = CONFIG.AVATAR.y * scaleY;
      const size = CONFIG.AVATAR.size * Math.min(scaleX, scaleY);

      // গোল ফ্রেমে প্রোফাইল ছবি বসানো।
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        x + size / 2,
        y + size / 2,
        size / 2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();

      await fs.writeFile(outputPath, output.toBuffer("image/jpeg", {
        quality: 0.92
      }));

      const name = await getName(api, usersData, targetID);
      const caption =
        CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];

      // সফলভাবে তৈরি হলে কুলডাউন শুরু।
      if (!isAdmin) {
        lastUsed.set(senderID, Date.now());
        cooldownStarted = true;
      }

      return message.reply({
        body: `😂 𝐁𝐈𝐉𝐈 𝐆𝐈𝐑𝐋 𝐌𝐄𝐌𝐄 😂\n\n👤 ${name}\n\n${caption}\n\n💠`,
        mentions: [
          {
            id: targetID,
            tag: name
          }
        ],
        attachment: fs.createReadStream(outputPath)
      });
    } catch (error) {
      if (cooldownStarted) {
        lastUsed.delete(senderID);
      }

      console.error("[BIJIGIRL ERROR]", error);

      return message.reply(
        "❌ ছবি তৈরি করা যায়নি!\n\n" +
        "সম্ভাব্য কারণ: টেমপ্লেট লিংক, প্রোফাইল ছবি API, অথবা canvas dependency সমস্যা।\n" +
        "Console Logs পরীক্ষা করো।"
      );
    } finally {
      // ফাইল পাঠানোর স্ট্রিম শেষ হলে অস্থায়ী ছবি মুছে ফেলবে।
      setTimeout(() => {
        fs.remove(outputPath).catch(() => {});
      }, 30000);
    }
  }
};
