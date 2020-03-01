/**
 * Author : Loris Levêque
 * Date : 17.02.2020
 * Description : Root all input
 */

const CONSTANT = require(`${__dirname}/../../constants.js`);
const executioner = require(`${__dirname}/executioner.js`);
require(`${CONSTANT.src}/prototypes/Array.js`)
require(`${CONSTANT.src}/prototypes/String.js`)

class Root {
	constructor() {

	}
	prepare(e) {
		const content_splitted = e.content.split('>');
		let params = {};
		for (var index = 1; index < content_splitted.length; index++) {
			const param = content_splitted[index].split(' ')
			//console.log("[[]]" + param.collapseWith(' '));
			const paramName = param[0]
			param.shift();
			const paramValue = param.collapseWith(' ');
			params[paramName] = paramValue;
		}
		return {
			type: e.content == "!config" ? "config" : "command",
			fullcontent: e.content,
			title: content_splitted[0].removeChars(['_', ' ']).toLowerCase(),
			timestamp: Date.now(),
			params: params,
			channel: e.channel,
			author: e.author,
			member: e.member,
			guild: e.guild,
		};
	}
	execute(e) {
		try {
			console.log(`|${e.title}|`);
			return executioner[e.title](e);
		} catch (err) {
			return console.log(`err:${err}`);
		}
	}
	get(e) {

	}
	post(e) {

	}
	put(e) {

	}
}

module.exports = new Root();