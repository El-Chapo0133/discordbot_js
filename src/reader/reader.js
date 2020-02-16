/**
 * Author : Loris Levêque
 * Date : 16.02.2020
 * Description : class to read files
 */

const fs = require('fs');
const CONSTANTS = require(`${__dirname}/../../constants.js`);
const logger = require(`${CONSTANTS.entry_point}/src/logger/logger.js`);

class Reader {
	constructor() {

	}
	readFile(filename, callback) {
		return fs.readFile(filename, (err, data) => {
			if (err) {
				logger.write(`ERR! ${err}`);
				return null;
			}
			callback(data.toString());
		});
	}
}

module.exports = new Reader();