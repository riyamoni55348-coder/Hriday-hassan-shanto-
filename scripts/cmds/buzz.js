/**
 * ╔════════════════════════════════════════════╗
 * ║             💠 GOD BOT BUZZ V4             ║
 * ║          💠 HRIDOY HASAN SHANTO 💠          ║
 * ╚════════════════════════════════════════════╝
 */

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  config: {
    name: "buzz",
    version: "4.0.0",
    author: "💠 HRIDOY HASAN SHANTO 💠",
    role: 2,
    countDown: 10,
    shortDescription: "Random Buzz Captions",
    longDescription: "মেনশন করা ব্যক্তির জন্য র‍্যান্ডম মজার ক্যাপশন পাঠায়।",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event }) {
    const adminName = "হৃদয় হাসান শান্ত";
    const prefix = "💠 GOD BOT 💠";

    try {
      const mentions = event.mentions || {};
      const mentionIDs = Object.keys(mentions);

      if (mentionIDs.length === 0) {
        return message.reply(
          "😅 ভাই, আগে একজনকে @mention করো!\n\n" +
          "উদাহরণ: buzz @নাম"
        );
      }

      // প্রথম মেনশন নির্বাচন
      const targetID = mentionIDs[0];
      const targetName = mentions[targetID];
      const mentionTag = [{ id: targetID, tag: targetName }];

      const captions = [
        `😎 ${adminName} বলছে, হাসিখুশি থাকো ${targetName} 🌸`,
        `💖 ${targetName}, তোমার দিনটা সুন্দর কাটুক!`,
        `😂 ${targetName}, এত চুপচাপ কেন? একটু হাসো!`,
        `🫶 ${targetName}, নিজের যত্ন নিতে ভুলবে না।`,
        `🌹 ${targetName}, তোমার জন্য একগুচ্ছ শুভকামনা!`,
        `👑 ${targetName}, নিজের মতো করে সেরা থাকো!`,
        `😜 ${targetName}, আজকে মুড কেমন?`,
        `✨ ${targetName}, তোমার প্রতিটি দিন আনন্দে কাটুক।`,
        `💌 ${targetName}, তোমার জন্য রইল অনেক শুভেচ্ছা।`,
        `🐸 ${targetName}, অনলাইনে আছো, কথা বলো না কেন?`,
        `🌙 ${targetName}, সুন্দর হোক তোমার প্রতিটি রাত।`,
        `💫 ${targetName}, নিজের স্বপ্নের পেছনে ছুটে চলো।`,
        `😇 ${targetName}, সবসময় ভালো থেকো।`,
        `🎉 ${targetName}, তোমার জন্য রইল অনেক ভালোবাসা ও শুভকামনা।`,
        `🤣 ${targetName}, হাসতে কোনো টাকা লাগে না!`,
        `💐 ${targetName}, তোমার মুখে হাসি থাকুক সবসময়।`,
        `😎 ${targetName}, আজকে তোমার অ্যাটিটিউড কেমন?`,
        `💝 ${targetName}, তুমি নিজের মতো করেই স্পেশাল।`,
        `🌈 ${targetName}, খারাপ সময় পেরিয়ে ভালো সময় আসবেই।`,
        `🤗 ${targetName}, নিজের ওপর বিশ্বাস রাখো।`,
        `🔥 ${targetName}, নিজের স্টাইলে রাজত্ব করো!`,
        `🎶 ${targetName}, একটা গান শোনাও তো!`,
        `☕ ${targetName}, চা খেতে খেতে আড্ডা হবে?`,
        `📸 ${targetName}, নতুন প্রোফাইল পিক কবে আসবে?`,
        `💬 ${targetName}, একটা রিপ্লাই দিলে কী হয়?`,
        `🥳 ${targetName}, আজকে আনন্দের দিন হোক!`,
        `🦋 ${targetName}, জীবনটাকে সুন্দরভাবে উপভোগ করো।`,
        `🌻 ${targetName}, মন ভালো রাখো, হাসতে থাকো।`,
        `💎 ${targetName}, নিজের মূল্য নিজেই বুঝতে শেখো।`,
        `🚀 ${targetName}, তোমার লক্ষ্য পূরণ হোক!`,
        `😴 ${targetName}, ঘুম পাচ্ছে নাকি?`,
        `🍫 ${targetName}, চকলেট পছন্দ নাকি আইসক্রিম?`,
        `🎧 ${targetName}, প্রিয় গানটার নাম বলো।`,
        `🤭 ${targetName}, এত লাজুক হলে চলবে?`,
        `🌺 ${targetName}, তোমার জন্য রইল একরাশ শুভকামনা।`,
        `😆 ${targetName}, হাসো ভাই, জীবন সুন্দর!`,
        `🫰 ${targetName}, ভালো মানুষের সঙ্গে থেকো।`,
        `🌟 ${targetName}, নিজের আলোয় আলোকিত হও।`,
        `🎯 ${targetName}, লক্ষ্য ঠিক রাখো!`,
        `💙 ${targetName}, মন ভালো রাখাই আসল কথা।`,
        `🧸 ${targetName}, আজকের দিনটা কেমন গেল?`,
        `📱 ${targetName}, ফোনের ওপাশে কে আছে? 😂`,
        `🕊️ ${targetName}, জীবনে শান্তি আর সুখ আসুক।`,
        `🍀 ${targetName}, তোমার জন্য শুভকামনা রইল।`,
        `😏 ${targetName}, এত ভাব কিসের?`,
        `🎁 ${targetName}, তোমার জন্য ছোট্ট একটা শুভেচ্ছা!`,
        `🤝 ${targetName}, বন্ধুত্বটা সুন্দর থাকুক।`,
        `💫 ${targetName}, নতুন কিছু শেখা বন্ধ করো না।`,
        `🌼 ${targetName}, আজ নিজেকে একটু সময় দাও।`,
        `😄 ${targetName}, হাসিটা কিন্তু দারুণ!`,
        `👀 ${targetName}, কী দেখছো? মেসেজের উত্তর দাও!`,
        `🧋 ${targetName}, একদিন আড্ডা জমবে!`,
        `📚 ${targetName}, নতুন কিছু শেখার সময় হয়েছে।`,
        `🏆 ${targetName}, চেষ্টা চালিয়ে যাও, সফলতা আসবে।`,
        `💚 ${targetName}, সবার সঙ্গে ভালো ব্যবহার করো।`,
        `🌍 ${targetName}, পৃথিবীটা ঘুরে দেখার মতো সুন্দর।`,
        `🎨 ${targetName}, নিজের জীবন নিজের মতো সাজাও।`,
        `💐 ${targetName}, তোমার জন্য রইল একগুচ্ছ ফুল।`,
        `😜 ${targetName}, আজকে কে তোমাকে হাসিয়েছে?`,
        `🌞 ${targetName}, নতুন দিন মানেই নতুন সুযোগ।`,
        `🪄 ${targetName}, ছোট ছোট আনন্দ উপভোগ করো।`,
        `💌 ${targetName}, একটা সুন্দর মেসেজ তোমার জন্য।`,
        `🐼 ${targetName}, কেমন আছো বন্ধু?`,
        `🎵 ${targetName}, মিউজিক ছাড়া দিন চলে?`,
        `🌷 ${targetName}, ভালো থাকো, সুন্দর থাকো।`,
        `🧡 ${targetName}, মন থেকে সবার জন্য ভালো চাও।`,
        `✨ ${targetName}, তোমার স্বপ্নগুলো সত্যি হোক।`,
        `😂 ${targetName}, গ্রুপে এত নীরবতা কেন?`,
        `👑 ${targetName}, নিজের সম্মান নিজে বজায় রাখো।`,
        `💫 ${targetName}, প্রতিদিন একটু একটু করে এগিয়ে যাও।`,
        `🌸 ${targetName}, ফুলের মতো সুন্দর হোক তোমার দিন।`,
        `🤗 ${targetName}, বন্ধুদের সময় দিতে ভুলো না।`,
        `🎉 ${targetName}, হাসি-আনন্দে কাটুক আজকের দিন।`,
        `😎 ${targetName}, স্টাইল থাকবে, ব্যবহারও সুন্দর হবে!`,
        `💝 ${targetName}, তোমার জন্য রইল আন্তরিক শুভেচ্ছা।`,
        `🌙 ${targetName}, আজকের রাতটা শান্তিতে কাটুক।`,
        `🥰 ${targetName}, প্রিয় মানুষদের যত্ন নিও।`,
        `📢 ${targetName}, সবাইকে সালাম দিয়ে আড্ডা শুরু করো!`,
        `🫶 ${targetName}, বন্ধুত্বে বিশ্বাস আর সম্মান জরুরি।`,
        `🌈 ${targetName}, প্রতিটি সমস্যার পর নতুন সম্ভাবনা থাকে।`,
        `🎯 ${targetName}, নিজের লক্ষ্য থেকে সরে যেও না।`,
        `😇 ${targetName}, মনটা সবসময় সুন্দর রেখো।`,
        `🐸 ${targetName}, একটা হাসি দিয়ে যাও!`,
        `💙 ${targetName}, সুস্থ থেকো, ভালো থেকো।`,
        `🔥 ${targetName}, নিজের আত্মবিশ্বাস ধরে রাখো।`,
        `🌻 ${targetName}, আজকের দিনটা তোমার হোক।`,
        `🎧 ${targetName}, গান শোনো আর মন ভালো রাখো।`,
        `💬 ${targetName}, তোমার প্রিয় ইমোজি কোনটা?`,
        `☀️ ${targetName}, প্রতিদিন নতুন করে শুরু করো।`,
        `🎁 ${targetName}, তোমাকে অনেক শুভকামনা জানাই।`,
        `💎 ${targetName}, সৎ থাকো, নিজের পথে চলো।`,
        `😄 ${targetName}, একটু হাসি, অনেক আনন্দ!`,
        `🌹 ${targetName}, সুন্দর মুহূর্তগুলো মনে রেখো।`,
        `🦋 ${targetName}, নিজের পরিবর্তনকে স্বাগত জানাও।`,
        `🤝 ${targetName}, বন্ধুত্ব অটুট থাকুক।`,
        `🎊 ${targetName}, আজকের আড্ডা জমে উঠুক!`,
        `💚 ${targetName}, ভালো চিন্তা করো, ভালো কাজ করো।`,
        `🚀 ${targetName}, সামনে এগিয়ে যাও!`,
        `🌺 ${targetName}, তোমার জন্য অনেক শুভকামনা।`,
        `😜 ${targetName}, এবার তোমার পালা—কিছু বলো!`,
        `💠 ${adminName} ও ${prefix} থেকে রইল শুভেচ্ছা, ${targetName}!`
      ];

      // সর্বোচ্চ ১০টি ক্যাপশন পাঠানো হবে
      const total = Math.min(captions.length, 10);

      await message.reply(
        `💠 GOD BOT BUZZ V4 💠\n` +
        `🎯 মেনশন: ${targetName}\n` +
        `📨 মোট ক্যাপশন: ${total}\n` +
        `⏳ প্রতি মেসেজে বিরতি: ৩ সেকেন্ড`,
        { mentions: mentionTag }
      );

      for (let i = 0; i < total; i++) {
        await delay(3000);

        await message.reply({
          body: `💠 ${i + 1}/${total} 💠\n${captions[i]}`,
          mentions: mentionTag
        });
      }

      return message.reply(
        `✅ BUZZ সম্পন্ন!\n` +
        `💠 ক্রেডিট: HRIDOY HASAN SHANTO 💠`
      );

    } catch (error) {
      console.error("[BUZZ ERROR]", error);

      return message.reply(
        "❌ BUZZ কমান্ডে সমস্যা হয়েছে।\n" +
        "কনসোল লগ পরীক্ষা করে আবার চেষ্টা করো।"
      );
    }
  }
};
