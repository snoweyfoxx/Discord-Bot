import * as Discord from "discord.js";
import { client } from "../../..";
import { blacklistedWords } from "..";
import roles from "../../../roles";

module.exports = async (message: Discord.Message) => {
	//* Ignore bots
	if (message.author.bot) return;

	if (client.elevation(message.author.id) === 0 && blacklistedWords.find(w => message.content.includes(` ${w} `))) message.delete();

	if (await checkInvite(message.content) && !(message.member as any)._roles.includes(roles.administrator)) {
		message
			.reply("**Invite links are not allowed**")
			.then(msg => msg.delete({ timeout: 10 * 1000 }));
		message.delete();
	}
};

module.exports.config = {};

export async function checkInvite(string: string) {
	let invites = (await client.guilds.cache.first().fetchInvites()).map(
			invite => invite.url
		),
		disallowedPatterns = [
			/(discord.gg\/[\s\S]+)/g,
			/(discord.me\/[\s\S]+)/g,
			/(discord.com\/invite\/[\s\S]+)/g,
			/(discordapp.com\/invite\/[\s\S]+)/g,
			/(top.gg\/servers\/[\s\S]+)/g,
			/(disboard.org\/server\/join\/[\s\S]+)/g,
			/(discordservers.com\/join\/[\s\S]+)/g,
			/(discordbee.com\/invite\?server=[\s\S]+)/g,
			/(invite.gg\/[\s\S]+)/g,
			/(dyno.gg\/servers\/[\s\S]+)/g
		];

	invites.push("discord.gg/premid");

	let ownInvite = invites.filter(iURL =>
		string.toLowerCase().includes(iURL.toLowerCase())
	);

	if (ownInvite.length > 0) invites.map(i => (string = string.replace(i, "")));

	return disallowedPatterns.some(pattern => string.match(pattern));
}
