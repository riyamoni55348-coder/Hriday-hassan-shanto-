const axios = require("axios");  
const fs = require("fs-extra");  
const path = require("path");  
const { createCanvas, loadImage } = require("canvas");  
  
const ORIGINAL_AUTHOR = "Farhan-Khan";  
  
function verifyAuthor(configAuthor) {  
  return configAuthor === ORIGINAL_AUTHOR;  
}  
  
module.exports = {  
  config: {  
    name: "chor",  
    version: "2.3.0",  
    author: ORIGINAL_AUTHOR,  
    countDown: 5,  
    role: 0,  
    category: "fun",  
    description: "Street chor meme 😂",  
    guide: "{pn} @mention or reply"  
  },  
  
  onStart: async function ({ api, event, message }) {  
  
    if (!verifyAuthor(this.config.author)) {  
      return message.reply("❌ This file has been modified illegally. Author mismatch detected!");  
    }  
  
    const { threadID, messageID, mentions, messageReply } = event;  
  
    const cacheDir = path.join(process.cwd(), "cache");  
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);  
  
    let targetID = null;  
  
    if (mentions && Object.keys(mentions).length > 0) {  
      targetID = Object.keys(mentions)[0];  
    } else if (messageReply && messageReply.senderID) {  
      targetID = messageReply.senderID;  
    }  
  
    if (!targetID) {  
      return message.reply("মামা কাউরে মেনশন দে বা রিপ্লাই দে 😂");  
    }  
  
    try {  
      const userInfo = await api.getUserInfo(targetID);  
      const userName = userInfo[targetID]?.name || "User";  
  
      const imgLink = "https://i.imgur.com/fO720aw.jpeg";  
      const filePath = path.join(cacheDir, `chor_${Date.now()}.png`);  
  
      message.reply("চোর ধরতেছি মামা... 🚨⏳");  
  
      const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";  
      const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;  
  
      const [baseImage, targetPfp] = await Promise.all([  
        loadImage(imgLink),  
        loadImage(targetPfpUrl)  
      ]);  
  
      const canvas = createCanvas(baseImage.width, baseImage.height);  
      const ctx = canvas.getContext("2d");  
  
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);  
  
      // 🔥 Slightly more right + balanced face fit
      const pfpSize = 110;  
      const x = 370;  // আগে 355 ছিল → এখন একটু বেশি ডান  
      const y = 35;  
  
      ctx.save();  
      ctx.shadowColor = "rgba(0,0,0,0.4)";  
      ctx.shadowBlur = 10;  
  
      ctx.beginPath();  
      ctx.arc(x + pfpSize / 2, y + pfpSize / 2, pfpSize / 2, 0, Math.PI * 2);  
      ctx.closePath();  
      ctx.clip();  
  
      ctx.drawImage(targetPfp, x, y, pfpSize, pfpSize);  
      ctx.restore();  
  
      ctx.beginPath();  
      ctx.arc(x + pfpSize / 2, y + pfpSize / 2, pfpSize / 2, 0, Math.PI * 2);  
      ctx.lineWidth = 3;  
      ctx.strokeStyle = "#ffffff";  
      ctx.stroke();  
  
      const buffer = canvas.toBuffer("image/png");  
      fs.writeFileSync(filePath, buffer);  
  
      const finalCaption =  
`🚨 রাস্তার চোর ধরা পড়ছে!  
  
নাম: ${userName}  
আজকের চুরি: ০ টাকা 😂  
সবাই সাবধান থাকো ভাই! 🤣`;  
  
      return api.sendMessage({  
        body: finalCaption,  
        mentions: [{ tag: userName, id: targetID }],  
        attachment: fs.createReadStream(filePath)  
      }, threadID, () => {  
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);  
      }, messageID);  
  
    } catch (e) {  
      console.error("CHOR ERROR:", e);  
      return message.reply("চোরটা পালাইছে মামা 😭 আবার ট্রাই কর ❌");  
    }  
  }  
};
