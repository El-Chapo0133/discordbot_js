/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Api for literally anythings C:
 */

const GithubContent = require('github-content');

class Api {
	constructor() {

	}
	async getGithubFile(e) {
		if (e.author === "undefined" || e.repo === "undefined")
			return "ERR! missing params"
		new GithubContent({
			owner: e.author,
			repo: e.repo,
			branch: e.branch === "undefiend" ? 'master' : e.branch
		}).file(e.filename, (err, data) => {
			if (err) {
				logger.write(`ERR! ${err}`);
				return null;
			}
			else {
				return file.content.toString();
			}
		});
	}
}