const axios = require("axios");                  
const { createCanvas, loadImage } = require("canvas");                  
const fs = require("fs");                  
const path = require("path");                  
                  
module.exports = {                  
config: {                  
name: "pair",                  
aliases: ["pair1","pairv1"],                  
author: "MR_FARHAN",                  
version: "1.0.0",                  
role: 0,                  
category: "pair",                  
shortDescription: "🎀 Find your perfect gf/bf!",                  
longDescription: "Premium soulmate match card",                  
guide: "{p}{n} @mention or reply someone"                  
},                  
                  
onStart: async function ({ api, event, usersData }) {                  
try {                  
                  
const senderData = await usersData.get(event.senderID);                  
let senderName = senderData.name || "You";                  
                  
const threadData = await api.getThreadInfo(event.threadID);                  
const users = threadData.userInfo;                  

// ✅ mention + reply support added
let targetID = null;

// 1️⃣ mention check
let mentionedIDs = Object.keys(event.mentions || {});
if (mentionedIDs.length > 0) {
  targetID = mentionedIDs[0];
}

// 2️⃣ reply check
if (!targetID && event.messageReply) {
  targetID = event.messageReply.senderID;
}

if (!targetID) {                  
  return api.sendMessage("⚠️ একজনকে mention করুন বা message reply করুন!", event.threadID, event.messageID);                  
}                  
                  
const selectedMatch = users.find(u => u.id == targetID);                  
                  
if (!selectedMatch) {                  
  return api.sendMessage("❌ user পাওয়া যায়নি!", event.threadID, event.messageID);                  
}                  
                  
let matchName = selectedMatch.name;                  
                  
const width = 1200;                  
const height = 750;                  
const canvas = createCanvas(width, height);                  
const ctx = canvas.getContext("2d");                  
                  
// 🌌 background                  
const gradient = ctx.createLinearGradient(0, 0, width, height);                  
gradient.addColorStop(0, "#0f172a");                  
gradient.addColorStop(0.5, "#1e293b");                  
gradient.addColorStop(1, "#020617");                  
ctx.fillStyle = gradient;                  
ctx.fillRect(0, 0, width, height);                  
                  
// 🌸 flowers                  
function drawFlower(x, y, r) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#ffd1dc";

  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 / 5) * i;
    const fx = x + Math.cos(angle) * r;
    const fy = y + Math.sin(angle) * r;

    ctx.beginPath();
    ctx.arc(fx, fy, r / 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(x, y, r / 3, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.restore();
}

for (let i = 0; i < 18; i++) {
  drawFlower(Math.random() * width, Math.random() * height, Math.random() * 25 + 15);
}
                  
// title                  
ctx.font = "bold 60px Arial";                  
ctx.fillStyle = "#ffffff";                  
ctx.fillText("✦ SOULMATES ✦", width/2 - 280, 70);                  
                  
const senderAvatar = await loadImage(                  
  `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`                  
);                  
                  
const partnerAvatar = await loadImage(                  
  `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`                  
);                  
                  
function drawLuxuryCircle(img, x, y, size) {                  
  ctx.save();                  
  ctx.shadowColor = "#ffd700";                  
  ctx.shadowBlur = 25;                  
                  
  ctx.beginPath();                  
  ctx.arc(x + size/2, y + size/2, size/2 + 6, 0, Math.PI*2);                  
  ctx.strokeStyle = "#ffd700";                  
  ctx.lineWidth = 4;                  
  ctx.stroke();                  
                  
  ctx.beginPath();                  
  ctx.arc(x + size/2, y + size/2, size/2 + 2, 0, Math.PI*2);                  
  ctx.strokeStyle = "#ffffff";                  
  ctx.lineWidth = 2;                  
  ctx.stroke();                  
                  
  ctx.restore();                  
                  
  ctx.save();                  
  ctx.beginPath();                  
  ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI*2);                  
  ctx.clip();                  
  ctx.drawImage(img, x, y, size, size);                  
  ctx.restore();                  
}                  
                  
drawLuxuryCircle(senderAvatar, 150, 180, 240);                  
drawLuxuryCircle(partnerAvatar, width - 390, 180, 240);                  
                  
function drawNameBox(name, x, y) {                  
  const boxWidth = 280;                  
  const boxHeight = 60;                  
                  
  ctx.fillStyle = "rgba(0,0,0,0.6)";                  
  ctx.beginPath();                  
  ctx.roundRect(x, y, boxWidth, boxHeight, 20);                  
  ctx.fill();                  
                  
  ctx.strokeStyle = "#ffd700";                  
  ctx.lineWidth = 2;                  
  ctx.stroke();                  
                  
  ctx.font = "bold 26px Arial";                  
  ctx.fillStyle = "#ffffff";                  
  let textWidth = ctx.measureText(name).width;                  
  ctx.fillText(name, x + (boxWidth - textWidth)/2, y + 38);                  
}                  
                  
drawNameBox(senderName, 130, 450);                  
drawNameBox(matchName, width - 410, 450);                  
                  
ctx.font = "bold 110px Arial";                  
ctx.fillStyle = "#ff4d6d";                  
ctx.fillText("❤", width/2 - 50, 330);                  
                  
const lovePercent = Math.floor(Math.random() * 31) + 70;                  
                  
ctx.font = "bold 40px Arial";                  
ctx.fillStyle = "#ffd700";                  
ctx.fillText(`♡ ${lovePercent}% MATCH ♡`, width/2 - 180, 580);                  
                  
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
                  
},                  
};
