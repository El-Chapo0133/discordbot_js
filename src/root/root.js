/**
 * Author : Loris Levêque
 * Date : 17.02.2020
 * Description : Root all input
 */

//const CONSTANT = require(`${__dirname}/../../constants.js`);
const executionner = require(`${__dirname}/execitionner.js`);

class Root {
	constructor() {

	}
	prepare(e) {
		const content_splitted = e.content.split(' ');
		return {
			type: e.content == "!config" ? "config" : "command",
			title: content_splitted[0].removeFirstChar(),
			timestamp: Date.now(),
			params: [...content_splitted.each((index, value) => { if (index !== 0) { return value }})],
			channel: e.channel,
			author: e.message.author,
		};
	}
	execute(e) {
		return executionner[e.title]();
	}
	get(e) {

	}
	post(e) {

	}
	put(e) {

	}
}

module.exports = new Root();