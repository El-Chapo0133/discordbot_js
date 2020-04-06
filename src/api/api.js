/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Api for literally anythings C:
 */

const http = require('http');
const https = require('https');
const pageviews = require('pageviews');

const GithubContent = require('github-content');
const CONSTANTS = require(`${__dirname}/../../constants.js`);
const logger = require(`${CONSTANTS.src}/logger/logger.js`);


class Api {
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
	getFromUrl(e) {
		return new Promise((resolve, reject) => {
			const client = e.url.toString().indexOf('https') === 0 ? https : http;
			client.get(e.url, res => {
				let data = '';
				res.on('data', chunk => {
					data += chunk;
				});
				res.on('end', () => {
					resolve(data)
				});
			}).on('error', err => {
				reject(err);
			});
		});
	}
	wikiPage(e) {
		const dateNow = new Date(new Date() - 3 * 24 * 60 * 60 * 1000);
		return new Promise((resulve, reject) => {
			pageviews.getPerArticlePageviews({
				article: e.input,
				project: 'en.wikipedia',
				start: dateNow,
				end: dateNow,
			}).then(result => {
				console.log(result);
			}).catch(ex => {
				console.log(ex);
			});
		});
	}
}

module.exports = new Api();