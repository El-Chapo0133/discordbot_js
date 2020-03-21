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
		iterations: 0,
		errorThresh: 0.005,
		log: true,
		logPeriod: 1,
		callback: onBatchEnd,
		callbackPeriod: 1,
	}
}

let LOOPS = 0;

const brain = require('brain.js');

let bufferInitLoss = 0;
let bufferFinalLoss = 0;
let index = 0;

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
			this.configs.train_config.iterations = e.loops;
			LOOPS = e.loops;
			console.log(this.configs.train_config.iterations);
			console.log(LOOPS);
			await this.network.train(e.trains, this.configs.train_config);
			return {error: false, init: bufferInitLoss, final: bufferFinalLoss, loops: LOOPS};
		} catch(exception) {
			console.log({exception: exception});
			return {error: true};
		}
	}
	async predict(e) {
		return this.network.run(e.value);
	}
}

function onBatchEnd(input) {
	if (index === 0)
		bufferInitLoss = input.error;
	else if (index == LOOPS - 1)
		bufferFinalLoss = input.error;
	index++;
}

module.exports = new Brain();