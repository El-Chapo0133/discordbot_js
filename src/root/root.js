/**
 * Author : Loris Levêque
 * Date : 17.02.2020
 * Description : Root all input
 */

//const CONSTANT = require(`${__dirname}/../../constants.js`);
const executioner = require(`${__dirname}/execitioner.js`);

class Root {
	constructor() {

	}
	prepare(e) {
		const content_splitted = e.content.split(' ');
		let params = {};
		const name = content_splitted[index];
		const value = content_splitted[index + 1];
		for (var index = 1; index < content_splitted; index += 2) {
			if (name.startsWith('-') && !value.startsWith('-'))
				params[name.removeFirstChar()] = value;
		}
		return {
			type: e.content == "!config" ? "config" : "command",
			title: content_splitted[0].removeFirstChar(),
			timestamp: Date.now(),
			params: [...params],
			channel: e.channel,
			author: e.message.author,
		};
	}
	execute(e) {
		return executioner[e.title](e);
	}
	get(e) {

	}
	post(e) {

	}
	put(e) {

	}
}

module.exports = new Root();