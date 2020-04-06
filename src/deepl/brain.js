/**
 * Author : Loris Levêque
 * Date : 16.02.2020
 * Description : ml file for the brain.js library
 * Doc : https://github.com/BrainJS/brain.js
 */

const CONSTANTS = require(`${__dirname}/../../constants.js`);
const fs = require('fs');
const LOGPERIOD = 1;

const default_configs = {
	brain_type: "recurrent.LSTM",
	network_config: {
		binaryTresh: 0.5,
		//hiddenLayers: [154, 100, 50, 20],
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
		logPeriod: LOGPERIOD,
		callback: onBatchEnd,
		callbackPeriod: LOGPERIOD,
	}
}

let LOOPS = 1000;

const brain = require('brain.js');

let bufferInitLoss = 0;
let bufferFinalLoss = 0;
let index = 0;

let network;

let channel;

class Brain {
	constructor() {
		this.network = null;
		this.configs = default_configs;
	}
	init() {
		network = new brain.recurrent.LSTM(this.configs.network_config);
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
		channel = e.channel;
		try {
			this.configs.train_config.iterations = e.loops;
			LOOPS = e.loops;
			await network.train(e.trains, this.configs.train_config);
			const json = (JSON.stringify(network.toJSON()));
			write(`${CONSTANTS.resources}/brain.json`, json.toString())
			channel = null;
			return {error: false, init: bufferInitLoss, final: bufferFinalLoss, loops: LOOPS};
		} catch(exception) {
			channel = null;
			console.log({exception: exception});
			return {error: true};
		}
	}
	async predict(e) {
		return network.run(e.value);
	}
	toJson(e) {
		network.toJSON(e.filename);
	}
	fromJson(e) {
		network.fromJSON(e.json);
	}
}

function onBatchEnd(input) {
	if (index === 0)
		bufferInitLoss = input.error;
	else if (index == LOOPS - 1)
		bufferFinalLoss = input.error;
	index += LOGPERIOD;
}
function write(filename, input) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, input, (err) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				console.log("file Writed");
				resolve();
			}
		})
	})
}

module.exports = new Brain();