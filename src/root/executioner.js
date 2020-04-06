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
const YtApi = require('youtube-node');
const ytapi = new YtApi();

const CONSTANTS = require(`${__dirname}/../../constants.js`);
const api = require(`${CONSTANTS.src}/api/api.js`);
const fileSystem = require(`${CONSTANTS.src}/fileSystem/fileSystem.js`);
const queue = require(`${CONSTANTS.src}/music/musicQueue.js`);
const brainjs = require(`${CONSTANTS.src}/deepl/brain.js`);
const DEEPL_DEFAULT_LOOPS = 5000;

const urlApiCovid = "https://coronavirus-19-api.herokuapp.com/countries";
let YTAPIKEY = "";
fileSystem.readFile(`${CONSTANTS.resources}/data_bot.json`, (bot_data) => {
	ytapi.setKey(bot_data.toJson().google_api_key);
});

let BANNEDFUNCTIONS;
let bufferConnection = null;
let bufferVoiceChannel = null;
let bufferChannels = null;

fileSystem.readFile(`${CONSTANTS.resources}/static.json`, (data) => {
	BANNEDFUNCTIONS = (data.toJson().banned_functions);
});

// all function in this class is a function of the bot
// Ex: a function is named "ping", then you can type "!ping" to the bot
// if you want to have a function that couldn't called with bot, create a new class or a new function beside the class Executionner
class Executioner {
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
		if (!e.member.roles.has(role)) {
			return e.channel.send(`You haven't the ${e.params.role} role !`);
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
	async play(e) {
		setMusicUrl(e).then(music => {
			const voiceChannel = e.member.voiceChannel;
			if (!voiceChannel) {
				return e.channel.send("You must be in a channel");
			} else {
				bufferVoiceChannel = voiceChannel;
				ytdl.getInfo(music).then((songInfo) => {
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
		});
	}
	skip(e) {
		try {
			queue.first().dispatcher.end();
			e.channel.send("> Skiped successfully");
		} catch(exception) {
			console.log({exception: exception});
			e.channel.send("> error on skip method");
		}
	}
	loop(e) {
		queue.toggleLoop();
		e.channel.send(queue.isLooped() === true ? "> Loop enabled" : "> Loop disabled")
	}
	loopqueue(e) {
		queue.toggleLoopQueue();
		e.channel.send(queue.isQueueLooped() === true ? "> Loop queue enabled" : "> Loop queue disabled")
	}
	pause(e) {
		queue.first().dispatcher.pause();
	}
	resume(e) {
		queue.first().dispatcher.resume();
	}
	remove(e) {
		try {
			queue.remove({id:e.params.id});
			e.channel.send(`removed the item ${e.params.id} '${queue.select({id:e.params.id})}'`);
		} catch(exception) {
			console.log({exception: exception});
			e.channel.send(`Error on removing the item ${e.params.id}`);
		}
	}
	move(e) {
		try {
			let item = queue.select({id:e.params.source});
			let toReturn = [];
			console.log({index_source: parseInt(e.params.dest)});
			for (let index = 0; index < queue.length(); index++) {
				if (index == parseInt(e.params.dest)) {
					toReturn.push(queue.select({id:index}));
				}
				if (index != e.params.source) {
					toReturn.push(queue.select({id:index}));
				}
			}
			console.log({returned_queue: toReturn});
			queue.set(toReturn);
		} catch(exception) {
			console.log({exception: exception});
			e.channel.send(`> Error on moving item ${e.params.source} to ${e.params.dest}`);
		}
	}
	disconnect(e) {
		bufferVoiceChannel.leave();
		queue.clear();
		return;
	}
	dc(e) {
		bufferVoiceChannel.leave();
		queue.clear();
		return;
	}
	np(e) {
		e.channel.send(`> Now Playing: ${queue.first().title}`)
	}
	queue(e) {
		const init = e.params.tab === "undefined" ?  e.params.tab : 0;
		const copyQueue = queue.getAll();
		const LENGTH = copyQueue.length;
		let toPrint = `loop activated: ${queue.isLooped()}\nloopqueue activated: ${queue.isQueueLooped()}\n`;
		for (let i = init; i < init + 20; i++) {
			if (i >= queue.length())
				break;
			if (copyQueue[i] !== "undefined")
				toPrint += `> ${i}: ${copyQueue[i].title}\n`;
			else
				toPrint += `> ${i}: Error here C:\n`;
		}
		e.channel.send(toPrint);
	}
	shuffle(e) {
		try {
			queue.shuffle();
			e.channel.send("> Queue shuffled successfully");
		} catch(exception) {
			console.log({Exception: exception});
			e.channel.send("> Error on shuffle command");
		}
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
		bufferChannels.push(e.channel);
		cron.schedule('* * 20 * Fri', () => {
			bufferChannels.forEach(cell => {
				cell.send("https://tenor.com/FR5a.gif");
			});
		}, {
			scheduled: true,
			timezone: "Europe/Berlin"
		});
		e.channel.send(`Started cron on channel '${e.channel.name}'`);
	}
	stopcron(e) {
		e.channel.send('Actually not working');
	}
	pee(e) {
		e.channel.send("https://tenor.com/view/pee-gif-5212091");
	}
	initdeeplwords(e) {
		//const loops = isUndefined(e.params.loops) ? DEEPL_DEFAULT_LOOPS : e.params.loops;
		fileSystem.readFile(`${CONSTANTS.resources}/brain.json`, (data) => {
			/*const DATAS = data.split('\n').parse(0, 5000);
			initBrain({
				trains: DATAS,
				channel: e.channel,
				loops: loops,
			});*/
			loadBrain(JSON.parse(data.toString()));
		})
	}
	getword(e) {
		brainjs.predict({value: e.params.input}).then((result) => {
			e.channel.send(`> output for ${e.params.input}: '${result}'`);
		});
	}
	covid19(e) {
		try {
			api.getFromUrl({url: urlApiCovid}).then(result => {
				const json = JSON.parse(result);
				if (isStringEqualTrue(e.params.getCountries)) {
					let bufferSend = [];
					const LENGTH = json.length;
					for (let index = 0; index < LENGTH; index++) {
						if (bufferSend.has(json[index].country))
							continue;
						bufferSend.push(json[index].country);
					}
					let buffer = "";
					bufferSend.sort().forEach(cell => {
						buffer += `${cell}-`;
					});
					e.channel.send(`\`\`\`${buffer.substring(0, buffer.length - 1)}\`\`\``);
				} else if (isStringEqualTrue(e.params.all)) {
					e.channel.send(`\`\`\`Total values:\nconfirmed: ${json[0].cases}\ndeaths: ${json[0].deaths}\nrecovered: ${json[0].recovered}\`\`\``);
				} else if (!isUndefined(e.params.countries)) {
					let buffer = [];
					const LENGTH = json.length;
					const countries = e.params.countries.split(' ');
					for (let i = 0; i < LENGTH; i++) {
						if (countries.has(json[i].country)) {
							buffer.push(json[i]);
							continue;
						}
					};
					let bufferSend = "";
					buffer.forEach(cell => {
						bufferSend += `> ${cell.country}\n      confirmed: ${cell.cases}\n      deaths: ${cell.deaths}\n      recovered: ${cell.recovered}\n`;
					});
					e.channel.send(bufferSend);
				} else if (!isUndefined(e.params.country)) {
					const LENGTH = json.length;
					let buffer = {
						confirmed: 0,
						deaths: 0,
						recovered: 0,
					};
					for (let index = 0; index < LENGTH; index++) {
						if (json[index].country === e.params.country) {
							buffer.confirmed = json[index].cases;
							buffer.deaths = json[index].deaths;
							buffer.recovered = json[index].recovered;
							break;
						}
					};
					e.channel.send(`> ${e.params.country}\n      confirmed: ${buffer.confirmed}\n      deaths: ${buffer.deaths}\n      recovered: ${buffer.recovered}`);
				} else {
					e.channel.send("Please choose one of those : [all,getCountries,countries,country]");
				}
			});
		} catch(exception) {
			console.log({
				title: 'Error on covid19 function',
				exception: exception,
			});
		}
	}
	wiki(e) {
		const language = e.params.lang === undefined ? 'fr' : e.params.lang;
		try {
			const URL = `https://${language}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${e.params.page}`;
			api.getFromUrl({url: URL}).then(result => {
				let toPrint;
				const json = result.toJson();
				const output = json.query.pages[Object.keys(json.query.pages)[0]].extract;
				if (output === undefined || output === '') {
					e.channel.send("Wiki page not fount [404]");
					return;
				}
				if (output.length > 1999)
					toPrint = output.substring(0,1996) + "...";
				else
					toPrint = output;
				e.channel.send(toPrint);
			}).catch(ex => {
				console.log({
					title: 'Error On wiki api function',
					exception: ex,
				});
				e.channel.send("Input not valid");
			});
		} catch(exception) {
			console.log({
				title: 'Error on wiki function',
				exception: exception,
			});
		}
	}
}

async function setMusicUrl(e) {
	if (!isUndefined(e.params.url)) {
		return e.params.url;
	} else if (!isUndefined(e.params.query)) {
		return new Promise((resolve, reject) => {
			ytapi.search(e.params.query, 2, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(`https://www.youtube.com/watch?v=${result.items[1].id.videoId}`);
				}
			});
		});
	}
}
function countryHas(array, input) {
	let buffer = false;
	array.forEach(cell => {
		if (cell.country === input)
			buffer =  true;
	});
	return buffer;
}
function isUndefined(input) {
	try {
		const temp = input.toString();
		return false;
	} catch {
		return true;
	}
}
function isStringEqualTrue(input) {
	try {
		return input.toUpperCase() === "TRUE";
	} catch {
		return false;
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
		} else if (queue.isQueueLooped()) {
			queue.add(queue.first());
			queue.shift();
			if (!queue.isEmpty()) {
				playMusic(queue.first());
			} else {
				e.voiceChannel.leave();
			}
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

async function initBrain(e) {
	brainjs.init();
	//brainjs.compile();
	brainjs.train({trains: e.trains, loops: e.loops, channel: e.channel}).then((result) => {
		if (result.error)
			e.channel.send("Error on training [brain.js]");
		else
			e.channel.send("```Model trainied [brain.js] in " + `${result.loops} loops\ninit loss: ${result.init}\nfinal loss: ${result.final}` + "```");
		return;
	});
}
function loadBrain(json) {
	brainjs.init();
	brainjs.fromJson({json: json});
}

module.exports = new Executioner();