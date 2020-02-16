/**
 * Author : Loris Levêque
 * Date : 16.02.2020
 * Description : 
 */

let iterator = 0;

class Logger {
	write(message) {
		console.log(`|Time:${Date.now()}`);
		console.log(`${iterator}-${message}`);
		return;
	}
}

module.exports = new Logger();