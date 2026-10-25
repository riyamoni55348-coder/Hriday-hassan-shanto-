const axios = require("axios");

module.exports = {
	config: {
		name: "funny",
		aliases: ["funvideo","funnyvideo"],
		version: "2.0",
		author: "MR_FARHAN",
		countDown: 5,
		role: 0,
		shortDescription: "Random captions with video and owner link",
		longDescription: "Bangla + English captions with direct video and owner contact link",
		category: "𝗙𝗨𝗡",
		guide: "{pn}"
	},

	onStart: async function ({ message, api }) {
		const { messageID } = message;

		// 🔒 AUTHOR LOCK
		if (this.config.author !== "MR_FARHAN") {
			return message.reply("⚠️ Author change detected! Command disabled.");
		}

		try {
			api.setMessageReaction("⏳", messageID, () => {}, true);
		} catch {}

		let loadingMsg;
		try {
			loadingMsg = await message.reply("⚡ ᴠɪᴅᴇᴏ ʟᴏᴀᴅɪɴɢ...⚡");
		} catch {}

		// 🔥 Drive Links (Converted)
		const links = [
	"1Zg6YCrfLNFVPuIarV3ZBvyg9NW9vKf-i",
	"1Tu7vjhlkUls3SKSTl-pGK3y69NYgeGMe",
	"1vHhwiHHDRJpflMGCU0Alg7A5ARkugLya",
	"1KrHanrUqkqr0kFjFh1abl72xlmZ0_18a",
	"1rs6cbx8oOYg2Zgi_0UZHfbDhEz8LjFlU",
	"1thJh4_fG8DYdgKiOhsy8Jkp98O0m-23b",
	"1T5x_hAEu5yozou0HeNrCHC6GS3XbgTSx",
	"1CRvedhuz9z2JWLY6LH2dNgtt7cwuBBsG",
	"1RbPFrHj4y7eno8OsAuYElOfdOsJ75eZp",
	"1mY0B0yGi90h0K1GvxVdZ7eLkj-Q-W2Eq",
	"1xgh5EePrQq62zeDRu2YAkJTrAXSCXpOp",
	"1-aZjX6vnC1HDn25jBoexmyLBlm6bLwli",
	"1znMcAJbcDnS0oDG6LCUH8PN0gZOJxhRC",
	"1teEOVYZwvGuz75_Is_ZEEvZwroB1IZW8",
	"10gQjKcAL8MkXOqi8vLYqPYiFg0_Qh-rR",
	"1b0xOpxhPq0xZO7QDpU4BZ-OnRKYPMdLD",
	"1-KLse2-7YKacnPGL7zHH5_KOHQUbVUt0"
		];

		// 🎲 Random ID
		const randomID = links[Math.floor(Math.random() * links.length)];

		// ✅ Proper Direct Download Link
		const videoURL = `https://drive.google.com/uc?export=download&id=${randomID}`;

		const caption = `✢━━━━━━━━━━━━━━━✢\n✨ 𝐑𝐚𝐧𝐝𝐨𝐦 𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 🎬\n𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐦𝐨𝐦𝐞𝐧𝐭 💫`;

		const footer = `\n✢━━━━━━━━━━━━━━━✢\n--❖(✷‿Riya 𝐁𝐎𝐓‿✷)❖--\n✢━━━━━━━━━━━━━━━✢\n(✷‿𝐎𝐖𝐍𝐄𝐑:- Šħẫňto Hřiȡẫy Ħẫššẫň ✷)`;

		try {
			const stream = await global.utils.getStreamFromURL(videoURL);

			await message.reply({
				body: caption + footer,
				attachment: stream
			});

			if (loadingMsg) api.unsendMessage(loadingMsg.messageID);
			api.setMessageReaction("✅", messageID, () => {}, true);

		} catch (err) {
			console.error(err);
			api.setMessageReaction("❌", messageID, () => {}, true);
			message.reply("❌ Video load failed!");
		}
	}
};
