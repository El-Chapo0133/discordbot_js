/**
 * Author : Loris Levêque
 * Date : 17.02.2020
 * Description : Root all input
 */

//const CONSTANT = require(`${__dirname}/../../constants.js`);
const executioner = require(`${__dirname}/executioner.js`);

class Root {
	constructor() {

	}
	prepare(e) {
		const content_splitted = e.content.split(' ');
		let params = {};
		for (var index = 1; index < content_splitted.length; index += 2) {
			const name = content_splitted[index];
			const value = content_splitted[index + 1];
			if (name.startsWith('-') && !value.startsWith('-'))
				params[name.removeFirstChar()] = value;
		}
		return {
			type: e.content == "!config" ? "config" : "command",
			fullcontent: e.content,
			title: content_splitted[0].removeFirstChar().toLowerCase(),
			timestamp: Date.now(),
			params: params,
			channel: e.channel,
			author: e.author,
			member: e.member,
			guild: e.guild,
		};
	}
	execute(e) {
		//try {
		console.log(e.title);
			return executioner[e.title](e);
		/*} catch {
			return console.log(`Unreconised command:${e.fullcontent}`);
		}*/
	}
	get(e) {

	}
	post(e) {

	}
	put(e) {

	}
}

module.exports = new Root();