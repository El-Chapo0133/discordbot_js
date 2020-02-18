/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Execute commands from root.js
 */

// all function in this class is a function of the bot
// Ex: a function is named "ping", then you can type "!ping" to the bot
// if you want to have a function that couldn't called with bot, create a new class or a new function beside the class Executionner
class Executionner {
	constructor() {

	}
	ping(e) {
		e.channel.send("Pong!");
	}
}

module.exports = new Executionner();