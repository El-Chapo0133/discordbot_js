/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Api for literally anythings C:
 */

const GithubContent = require('github-content');

class Api {
	constructor() {

	}
	getGithubFile(e) {
		const OPTIONS = {
			owner: e.author,
			repo: e.repo,
			branch: e.branch
		}
		let githubContent = new GithubContent(OPTIONS);
		githubContent.file(e.filename, (err, data) => {
			if (err)
				throw(err);
			else {
				return file.content.toString();
			}
		});
	}
}