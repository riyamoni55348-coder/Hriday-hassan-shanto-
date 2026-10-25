const axios = require("axios");      
const { createCanvas, loadImage } = require("canvas");      
const fs = require("fs");      
const path = require("path");      
      
module.exports = {      
config: {      
name: "pair2",      
aliases: ["peyar","crush"],      
author: "MR_FARHAN",      
version: "1.0.0",      
role: 0,      
category: "pair",      
shortDescription: "🎀 Find your perfect gf/bf!",      
longDescription: "Premium soulmate match card",      
guide: "{p}{n} @mention or reply"
},      
      
onStart: async function ({ api, event, usersData }) {      
try {      

const senderData = await usersData.get(event.senderID);      
let senderName = senderData.name || "You";      

const threadData = await api.getThreadInfo(event.threadID);      
const users = threadData.userInfo;      

let mentionID = null;

// ✅ 1. mention check
let mentionedIDs = Object.keys(event.mentions || {});
if (mentionedIDs.length > 0) {
  mentionID = mentionedIDs[0];
}

// ✅ 2. reply check (NEW)
if (!mentionID && event.messageReply) {
  mentionID = event.messageReply.senderID;
}

if (!mentionID) {
  return api.sendMessage("⚠️ একজনকে mention অথবা reply করুন!", event.threadID, event.messageID);
}

const selectedMatch = users.find(u => u.id == mentionID);

if (!selectedMatch) {
  return api.sendMessage("❌ user পাওয়া যায়নি!", event.threadID, event.messageID);
}

let matchName = selectedMatch.name;

const width = 1200;
const height = 750;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// 💖 background
const bg = ctx.createLinearGradient(0, 0, width, height);      
bg.addColorStop(0, "#ff4d6d");      
bg.addColorStop(0.5, "#ff758f");      
bg.addColorStop(1, "#ffb3c1");      
ctx.fillStyle = bg;      
ctx.fillRect(0, 0, width, height);      

// hearts
for (let i = 0; i < 20; i++) {      
  ctx.font = `${Math.random()*40 + 20}px Arial`;      
  ctx.fillStyle = "rgba(255,255,255,0.15)";      
  ctx.fillText("❤", Math.random()*width, Math.random()*height);      
}      

// title
ctx.font = "bold 60px Arial";      
ctx.fillStyle = "#ffffff";      
ctx.shadowColor = "#ff4d6d";      
ctx.shadowBlur = 25;      
ctx.fillText("✦ SOULMATES ✦", width/2 - 280, 70);      
ctx.shadowBlur = 0;      

const senderAvatar = await loadImage(      
  `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`      
);      

const partnerAvatar = await loadImage(      
  `https://graph.facebook.com/${selectedMatch.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`      
);      

function drawLuxuryCircle(img, x, y, size) {      
  ctx.save();      
  ctx.shadowColor = "#ffffff";      
  ctx.shadowBlur = 20;      
      
  ctx.beginPath();      
  ctx.arc(x + size/2, y + size/2, size/2 + 6, 0, Math.PI*2);      
  ctx.strokeStyle = "#fff";      
  ctx.lineWidth = 4;      
  ctx.stroke();      
      
  ctx.beginPath();      
  ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI*2);      
  ctx.clip();      
  ctx.drawImage(img, x, y, size, size);      
  ctx.restore();      
}      

drawLuxuryCircle(senderAvatar, 150, 180, 240);      
drawLuxuryCircle(partnerAvatar, width - 390, 180, 240);      

// names
ctx.font = "bold 26px Arial";      
ctx.fillStyle = "#fff";      
ctx.fillText(senderName, 150, 470);      
ctx.fillText(matchName, width - 390, 470);      

// heart
ctx.font = "bold 110px Arial";      
ctx.fillStyle = "#ff1e56";      
ctx.shadowBlur = 30;      
ctx.fillText("❤", width/2 - 50, 330);      
ctx.shadowBlur = 0;      

const lovePercent = Math.floor(Math.random() * 31) + 70;      

ctx.font = "bold 40px Arial";      
ctx.fillStyle = "#ffffff";      
ctx.shadowBlur = 20;      
ctx.fillText(`♡ ${lovePercent}% MATCH ♡`, width/2 - 180, 580);      
ctx.shadowBlur = 0;      

const outputPath = path.join(__dirname, "gf_card.png");      
const out = fs.createWriteStream(outputPath);      
const stream = canvas.createPNGStream();      
stream.pipe(out);      

out.on("finish", () => {      
  api.sendMessage(      
    { attachment: fs.createReadStream(outputPath) },      
    event.threadID,      
    () => fs.unlinkSync(outputPath),      
    event.messageID      
  );      
});      

} catch (error) {      
  api.sendMessage("❌ Error:\n" + error.message, event.threadID, event.messageID);      
}      
}      
};
