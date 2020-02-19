/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Api for literally anythings C:
 */

const GithubContent = require('github-content');
const CONSTANTS = require(`${__dirname}/../../constants.js`);
const logger = require(`${CONSTANTS.src}/logger/logger.js`);

class Api {
	constructor() {

	}
	getGithubFile(e, callback) {
		if (e.author === "undefined" || e.repo === "undefined" ||e.filename === "undefined")
			return "ERR! missing params"
		new GithubContent({
			owner: e.author,
			repo: e.repo,
			branch: e.branch === "undefined" ? e.branch : 'master',
		}).file(e.filename, (err, data) => {
			if (err) {
				logger.write(`ERR! ${err}`);
				return null;
			}
			else {
				callback(data.contents.toString());
			}
		});
	}
}

module.exports = new Api();