/**
 * Author : Loris Levêque
 * Date : 16.02.2020
 * Description : ml file for the brain.js library
 * Doc : https://github.com/BrainJS/brain.js
 */

const default_configs {
	brain_type: "NeuralNetwork",
	network_config = {
		binaryTresh: 0.5,
		hiddenLayers: [1],
		activation: 'sigmoid', // from ['sigmoid', 'relu', 'leaky-relu', 'tanh']
		leakyReluAlpha: 0.01,
		outputSize: 20,
		learningRate: 0.01,
		decayRate: 0.999,
	},
}

const brain = require('brain.js');

class Brain {
	constructor() {
		this.network = null;
		this.configs = new default_configs;
	}
	init() {
		this.network = brain[this.configs.brain_type]();
	}
	reconfig(e) {
		// e must be a json
		newConfigs = new default_configs;
		Object.keys(e).forEach(keys => {
			newConfigs[key] = e[key];
		});
		this.configs = newConfigs;
	}
	compile() {
		if (this.configs !== null)
			this.network = brain[this.configs.brain_type]();
	}
	train(e) {
		try {
			this.network.train(e.trains);
			return true;
		} catch(exception) {
			console.log({exception: exception});
			return false;
		}
	}
	predict(e) {
		return this.run(e.value);
	}
}

module.exports = new Brain();