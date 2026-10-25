const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
    config: {
        name: "love2",
        aliases: ["love 2 love"],
        version: "1.0",
        author: "MOHAMMAD-BADOL",
        countDown: 5,
        role: 0,
        shortDescription: "love dp",
        longDescription: "",
        category: "photo",
        guide: ""
    },

    onStart: async function ({ message, event, args, api }) {

        const mention = Object.keys(event.mentions || {});

        // ❗ REPLY SUPPORT
        let one, two;

        if (mention.length > 0) {
            if (mention.length == 1) {
                one = event.senderID;
                two = mention[0];
            } else {
                one = mention[1];
                two = mention[0];
            }
        } 
        else if (event.messageReply) {
            // reply mode
            one = event.senderID;
            two = event.messageReply.senderID;
        }
        else {
            return message.reply("💚আপনি যাকে ভালোবাসেন তাকে মেনশন করুন বা রিপ্লাই করুন প্লিজ✅");
        }

        bal(one, two).then(ptth => {
            message.reply({
                body: "ইগো আর ভালোবাসা লড়াই হলে ভালোবাসা টাই হেরে যায়.💔🥀",
                attachment: fs.createReadStream(ptth)
            });
        });
    },

    // ✅ REPLY HANDLER (IMPORTANT)
    onReply: async function ({ message, event }) {
        const one = event.senderID;
        const two = event.messageReply.senderID;

        bal(one, two).then(ptth => {
            message.reply({
                body: "ইগো আর ভালোবাসা লড়াই হলে ভালোবাসা টাই হেরে যায়.💔🥀",
                attachment: fs.createReadStream(ptth)
            });
        });
    }
};

async function bal(one, two) {
    let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`);
    avone.circle();

    let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`);
    avtwo.circle();

    let pth = "spiderman.png";

    let img = await jimp.read("https://i.imgur.com/LjpG3CW.jpeg");
    img.resize(1440, 1080)
       .composite(avone.resize(470, 470), 125, 210)
       .composite(avtwo.resize(470, 470), 800, 200);

    await img.writeAsync(pth);
    return pth;
  }
