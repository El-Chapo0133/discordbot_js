/**
 * Author : Loris Levêque
 * Date : 16.02.2020
 * Description : main entry point of the app
 *
 * file to run to lunch the bot
 */

// customs prototypes
require(`${__dirname}/src/prototypes/String.js`);
require(`${__dirname}/src/prototypes/Array.js`);

// discord deps
const Discord = require("discord.js");
const bot = new Discord.Client();

// generics deps

// my files
const CONSTANTS = require(`${__dirname}/constants.js`);
const fileSystem = require(`${CONSTANTS.entry_point}/src/fileSystem/fileSystem.js`);
const logger = require(`${CONSTANTS.entry_point}/src/logger/logger.js`);
const root = require(`${CONSTANTS.src}/root/root.js`);


fileSystem.readFile(`${__dirname}/_resources/data_bot.json`, (bot_data) => {
	bot.login(bot_data.toJson().bot_token);
});

bot.on('ready', () => {
	// Bot online
	logger.write("bot online");
});
bot.on('message', (e) => {
	// message received
	if (e.content.startsWith('_')) {
		let command = root.prepare(e);
		console.log(command);
		//e.channel.send(`> ${command}`);
		root.execute(command);
	} 
});
bot.on('guildMemberAdd', (e) => {
	// new member in the server
	console.log(e);
});