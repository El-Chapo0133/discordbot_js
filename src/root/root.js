/**
 * Author : Loris Levêque
 * Date : 17.02.2020
 * Description : Root all input
 */

class Root {
	constructor() {

	}
	prepare(e) {
		const content_splitted = e.content.split(' ');
		return {
			type: e.content == "!config" ? "config" : "command",
			title: content_splitted[0].removeLastChar(),
			timestamp: Date.now(),
			params: [...content_splitted.each((index, value) => { if (index !== 0) { return value }})],
			channel: e.channel,
			author: e.message.author,
		};
	}
	execute(e) {
		return this[e.type]();
	}
	get(e) {

	}
	post(e) {

	}
	put(e) {

	}
	ping(e) {
		e.channel.send("Pong!");
	}
}

module.exports = new Root();