/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Execute commands from root.js
 */

const ytdl = require('ytdl-core')

const CONSTANTS = require(`${__dirname}/../../constants.js`);
const api = require(`${CONSTANTS.src}/api/api.js`);
const fileSystem = require(`${CONSTANTS.src}/fileSystem/fileSystem.js`);

let BANNEDFUNCTIONS;

fileSystem.readFile(`${CONSTANTS.resources}/static.json`, (data) => {
	BANNEDFUNCTIONS = (data.toJson().banned_functions);
});

// all function in this class is a function of the bot
// Ex: a function is named "ping", then you can type "!ping" to the bot
// if you want to have a function that couldn't called with bot, create a new class or a new function beside the class Executionner
class Executioner {
	constructor() {

	}
	ping(e) {
		e.channel.send('Pong!');
		return;
	}
	githubfile(e) {
		api.getGithubFile({
			author: e.params.author,
			repo: e.params.repo,
			filename: e.params.filename,
			branch: e.params.branch
		}, (data) => {
			e.channel.send("```" + data + "```");
		});
		return;
	}
	assign(e) {
		const role = e.guild.roles.find(role => role.name === e.params.role);
		if (e.member.roles.has(role)) {
			return e.channel.send(`You already have the ${e.params.role} role !`);
		} else {
			e.member.addRole(role).catch(console.error);
		}
	}
	unassign(e) {
		const role = e.guild.roles.find(role => role.name === e.params.role);
		if (e.member.roles.has(role)) {
			return e.channel.send(`You already have the ${e.params.role} role !`);
		} else {
			e.member.removeRole(role).catch(console.error);
		}
	}
	rename(e) {
		//console.log(e.guild.members);
		console.log(e.guild.members.has(e.params.username));
		e.guild.member(e.author).setNickname('test');
	}
	getcommands(e) {
		let toshow = "";
		getAllProperties(this).map(item => {
			if (!BANNEDFUNCTIONS.has(item)) {
				toshow += `${item.toLowerCase()}\n`;
			}
		});
		return e.channel.send("```" + toshow + "```");
	}
	play(e) {
		const music = e.params.music;
		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) {
			return e.channel.send("You must be in a channel");
		} else {
			const songInfo = ytdl.getInfo(music).then(() => {
				try {
					voiceChannel.join().then((connection) => {
						connection.playStream(ytdl(songInfo.url)).on('end', () => {
							connection.leave();
						}).on('error', (err) => {
							console.log(err);
							connexion.leave();
						});
					});
				} catch (err) {
					console.log(err);
					return;
				}
			});
		}
	}
	skip(e) {

	}
	pause(e) {

	}
	resume(e) {
		
	}
	disconnect(e) {
		const voiceChannel = message.member.voiceChannel;
		voiceChannel.leave();
	}
}

function getAllProperties(obj) {
	let properties = new Set();
  	let currentObj = obj;
  	do {
    	Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
  	} while ((currentObj = Object.getPrototypeOf(currentObj)))
	return [...properties.keys()].filter(item => typeof obj[item] === 'function');
}

module.exports = new Executioner();