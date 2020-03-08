/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Execute commands from root.js
 */

const ytdl = require('ytdl-core');
const tenorjs = require('tenorjs').client({
	"Key": "AP6FGDBWE5CC",
	"Filter": "off", 
	"Locale": "en_US", 
	"MediaFilter": "minimal", 
	"DateFormat": "D/MM/YYYY - H:mm:ss A"
});
const cron = require('node-cron');

const CONSTANTS = require(`${__dirname}/../../constants.js`);
const api = require(`${CONSTANTS.src}/api/api.js`);
const fileSystem = require(`${CONSTANTS.src}/fileSystem/fileSystem.js`);
const queue = require(`${CONSTANTS.src}/music/musicQueue.js`);

let BANNEDFUNCTIONS;
let bufferConnection = null;
let bufferVoiceChannel = null;
let bufferChannel = null;

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
		try {
			api.getGithubFile({
				author: e.params.author,
				repo: e.params.repo,
				filename: e.params.filename,
				branch: e.params.branch
			}, (data) => {
				e.channel.send("```" + data + "```");
			});
		} catch (exception) {
			e.channel.send("Error, check if the file exists and if the file is 2000 chars or lower");
		}
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
		const voiceChannel = e.member.voiceChannel;
		if (!voiceChannel) {
			return e.channel.send("You must be in a channel");
		} else {
			bufferVoiceChannel = voiceChannel;
			ytdl.getInfo(music).then((songInfo) => {
				//console.log({songInfo: songInfo});
				e.channel.send(`\`\`\`added to queue:\n'${songInfo.title}'\nsong in queue: ${queue.length() + 1}\`\`\``)
				if (queue.isEmpty()) {
					try {
						voiceChannel.join().then((connection) => {
							bufferConnection = connection;
							queue.add({
								title: songInfo.title,
								url: songInfo.video_url,
								connection: connection,
								voiceChannel: voiceChannel
							});
							playMusic(queue.first())
						}).catch(err => {
							console.log(err);
						});
					} catch (err) {
						console.log("err " + err);
						return;
					}
				} else {
					queue.add({
						title: songInfo.title,
						url: songInfo.video_url,
						connection: bufferConnection,
						voiceChannel: voiceChannel
					});
				}
			}).catch(() => {
				e.channel.send("Error in music input");
			});
		}
	}
	skip(e) {
		try {
			queue.first().dispatcher.end();
		} catch(exception) {
			console.log({exception: exception});
			e.channel.send("> error on skip method");
		}
	}
	loop(e) {
		queue.toggleLoop();
		e.channel.send(queue.isLooped() === true ? "> Loop enabled" : "> Loop disabled")
	}
	pause(e) {
		queue.first().dispatcher.pause();
	}
	resume(e) {
		queue.first().dispatcher.resume();
	}
	disconnect(e) {
		queue.clear();
		bufferVoiceChannel.leave();
		return;
	}
	dc(e) {
		queue.clear();
		bufferVoiceChannel.leave();
		return;
	}
	np(e) {
		e.channel.send(`> Now Playing: ${queue.first().title}`)
	}
	queue(e) {
		const copyQueue = queue.getAll();
		const LENGTH = copyQueue.length;
		let toPrint = `loop activated: ${queue.isLooped()}\n`;
		for (let i = 0; i < LENGTH; i++) {
			toPrint += `> ${i}: ${copyQueue[i].title}\n`;
		}
		e.channel.send(toPrint);
	}
	gif(e) {
		if (String(e.params.keys) === "undefined") {
			e.channel.send("Param unknown");
			return;
		}
		try {
			tenorjs.Search.Random(e.params.keys, "1").then(results => {
				results.forEach(cell => {
					e.channel.send(cell.url);
				});
			});
		} catch (exception) {
			console.log(exception);
			e.channel.send("Error handling gif");
		}
	}
	startcron(e) {
		bufferChannel = e.channel;
		cron.schedule('* * 20 * Fri', () => {
			bufferChannel.send("https://tenor.com/FR5a.gif");
		}, {
			scheduled: true,
			timezone: "Europe/Berlin"
		});
		e.channel.send(`Started cron on channel '${e.channel.name}'`);
	}
	pee(e) {
		e.channel.send("https://tenor.com/view/pee-gif-5212091");
	}
}

function getRandom(min,max) {
	return Math.round((Math.random(min, max) * max));
}
function playMusic(e) {
	//console.log(`now playing ${e.title}`);
	queue.first().dispatcher = e.connection.playStream(ytdl(e.url)).on('end', () => {
		if (queue.isLooped()) {
			replay(queue.first())
		} else {
			queue.shift();
			if (!queue.isEmpty()) {
				playMusic(queue.first());
			} else {
				e.voiceChannel.leave();
			}
		}
	}).on('error', (err) => {
		console.log(err);
		e.voiceChannel.leave();
	});
}
function replay(e) {
	playMusic(e)
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