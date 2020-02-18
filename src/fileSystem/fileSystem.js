/**
 * Author : Loris Levêque
 * Date : 16.02.2020
 * Description : class to read files
 */

const fs = require('fs');
const CONSTANTS = require(`${__dirname}/../../constants.js`);
const logger = require(`${CONSTANTS.src}/logger/logger.js`);

class FileSystem {
	constructor() {

	}
	readFile(filename, callback) {
		fs.readFile(filename, (err, data) => {
			if (err) {
				logger.write(`ERR! ${err}`);
				return null;
			}
			callback(data.toString());
		});
	}
	save(_path) {
		if (_path !== "undefined") {
			const DEST = `${CONSTANTS.saves}/${_path.split('/')[_path.split('/').length - 1]}`
			fs.copyFile(_path, DEST, (err) => {
				if (err) {
					logger.write(`ERR! ${err}`);
					return null;
				}
			});
		} else {
			fs.readDir(CONSTANTS.resources, (err, files) => {
				if (err) {
					logger.write(`ERR! ${err}`);
					return null;
				}
				else {
					for (file in files) {
						const DEST = `${CONSTANTS.saves}/${file.split('/')[file.split('/').length - 1]}`;
						fs.copyFile(file, DEST, (err) => {
							if (err) {
								logger.write(`ERR! ${err}`);
								return null;
							}
						})
					}
				}
			});
		}
	}
}

module.exports = new FileSystem();