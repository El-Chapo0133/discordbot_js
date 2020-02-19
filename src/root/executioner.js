/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Execute commands from root.js
 */

const CONSTANTS = require(`${__dirname}/../../constants.js`);
const api = require(`${CONSTANTS.src}/api/api.js`);

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
	githubFile(e) {
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
}

module.exports = new Executioner();