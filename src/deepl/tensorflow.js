/**
 * Author : Loris Levêque
 * Date : 16.02.2020
 * Description : ml file for the tensorflow-tfjs library
 */

const tensorflow = require('@tensorflow-tfjs');

const default_init_options = {
	layers: [
		tensorflow.layers.dense({units: 1, inputShape: [1]})
	],
	name: "my_model",
}
const default_compile_options = {
	optimizer: 'sgd',
	loss: 'meanSquaredError',
	metrics: ['accuracy'],
}
const default_evaluate_options = {
	batchSize: 1,
}
const default_layer_options = {
	units: 1,
	inputShape: [1]
}
const default_fit_options = {
	batchSize: 1,
	epochs: 1,
}
const default_predict_options = {
	batchSize: 1,
}
const default_data = {
	save_file: '/tmp/saved-model'
}

class Brain {
	constructor() {
		this.model = null;
		this.isCompiled = false;
		this.fits = [];
		//require('@tensorflow-tfjs-node');
		//require('@tensorflow-tfjs-node-gpu');
	}
	init(options) {
		let treated_options = default_init_options;
		Object.keys(options).forEach(key => {
			treated_options[key] = options[key];
		});
		try {
			if (options === "undefined")
				this.model = tensorflow.sequential();
			else
				this.model = tensorflow.sequential(treated_options);
		} catch(exception) {
			console.log({
				title: 'error on init function',
				exception: exception,
			});
			throw(exception);
		}
	}
	addLayer(layer_config) {
		let treated_layer = default_layer_options;
		Object.keys(layer_config).forEach(key => {
			treated_layer[key] = layer_config[key];
		});
		try {
			this.model.add(tensorflow.layers.dense(treated_layer));
		} catch(exception) {
			console.log({
				title: 'Error on addLayer function',
				exception: exception,
			});
			throw(exception);
		}
	}
	compile(options) {
		let treated_options = default_compile_options;
		Object.keys(options).forEach(key => {
			treated_options[key] = options[key];
		});
		try {
			this.model.compile(options);
		} catch(exception) {
			console.log({
				title: 'error on compile function',
				exception: exception,
			})
			throw(exception);
		}
	}
	fit(x, y, options, loops) {
		let treated_options = default_fit_options;
		Object.keys(options).forEach(key => {
			treated_options[key] = options[key];
		});
		for (let index = 0; index < loops; index++) {
			try {
				this.fits.push(this.model.fit(x, y, treated_options));
			} catch(exception) {
				console.log({
					title: 'error on fit function',
					loop: index,
					exception: exception,
				});
				throw(exception);
			}
		}
	}
	evaluate(x,y,options) {
		if (!this.isCompiled) {
			console.log("This model hasn't compiled yet");
			return 0;
		}
		try {
			this.model.evaluate(x,y,options).print();
		} catch(exception) {
			console.log({
				title: 'error on evaluate fonction',
				exception: exception,
			});
			throw(exception);
		}
	}
	predict(input, options) {
		let treated_options = default_predict_options;
		Object.keys(options).forEach(key => {
			treated_options[key] = options[key];
		});
		try {
			return this.model.predict(input);
		} catch(exception) {
			console.log({
				title: 'error on predict function',
				exception: exception
			});
			throw(exception);
		}
	}

	getModel() {
		return this.model;
	}
	getLayerInput() {
		return JSON.stringify(this.model.outputs[0].shape);
	}
	async save(file) {
		const outputFile = file === "undefined" ? default_data.save_file : file;
		try {
			await this.model.save(outputFile);
			return
		} catch(exception) {
			console.log({
				title: 'error on save function',
				exception: exception,
			});
			throw(exception);
		}
	}
}

module.exports = new Brain();