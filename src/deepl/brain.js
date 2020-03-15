/**
 * Author : Loris Levêque
 * Date : 16.02.2020
 * Description : ml file for the brain.js library
 * Doc : https://github.com/BrainJS/brain.js
 */

const default_configs = {
	brain_type: "recurrent.LSTM",
	network_config: {
		binaryTresh: 0.5,
		hiddenLayers: [100, 50, 20],
		activation: 'relu', // from ['sigmoid', 'relu', 'leaky-relu', 'tanh']
		leakyReluAlpha: 0.01,
		outputSize: 1,
		learningRate: 0.01,
		decayRate: 0.999,
	},
	train_config: {
		iterations: 1000,
		errorThresh: 0.005,
		log: true,
		logPeriod: 100,
		//callback: onBatchEnd,
	}
}

const brain = require('brain.js');

class Brain {
	constructor() {
		this.network = null;
		this.configs = default_configs;
	}
	init() {
		this.network = new brain.recurrent.LSTM(this.configs.network_config);
	}
	reconfig(e) {
		// e must be a json
		newConfigs = default_configs;
		Object.keys(e).forEach(keys => {
			newConfigs[key] = e[key];
		});
		this.configs = newConfigs;
	}
	compile() {
		if (this.configs !== null)
			this.network = brain.recurrent.LTSM();
	}
	async train(e) {
		try {
			console.log("[class] started training");
			await this.network.train(e.trains, this.configs.train_config);
			console.log("[class] ended training");
			return true;
		} catch(exception) {
			console.log({exception: exception});
			return false;
		}
	}
	async predict(e) {
		return this.network.run(e.value);
	}
}

function onBatchEnd(input) {
	console.log(input);
}

module.exports = new Brain();