Array.prototype.removeIndex = function(_index) {
	const _$ = this.valueOf();
	let toReturn = [];
	for (let index = 0; index < _$.length; index++) {
		if (index != _index)
			toReturn.push(_$[index]);
	}
	return [...toReturn];
}
Array.prototype.removeValue = function(_value) {
	const _$ = this.valueOf();
	let toReturn = [];
	for (let index = 0; index < _$.length; index++) {
		if (_$[index] != _value)
			toReturn.push(_$[index]);
	}
	return [...toReturn];
}
Array.prototype.removeDuplicated = function() {
	return [...new Set(this.valueOf())];
}
Array.prototype.convertToInt = function() {
	return this.valueOf().map(Number);
}
Array.prototype.convertToString = function() {
	return this.valueOf().map(String);
}
Array.prototype.collapse = function() {
	let toReturn = "";
	this.valueOf().map(cell => {
		toReturn += String(cell);
	})
	return toReturn;
}
Array.prototype.collapseWith = function(input) {
	let toReturn = "";
	const _$ = this.valueOf();
	for (let index = 0; index < _$.length; index++) {
		if (index != _$.length - 1) {
			toReturn += _$[index] + input;
		} else {
			toReturn += _$[index]
		}
	}
	return toReturn;
}
Array.prototype.clone = function() {
	return [...this.valueOf()];
}
Array.prototype.sumAll = function(index_start, index_end) {
	const _$ = this.valueOf();
	const start = index_start === "undefined" ? 0 : index_start;
	const end = index_end === "undefined" ? _$.length : index_end;
	let toReturn = 0;
	for (let index = 0; index < _$.length; index++) {
		if (index > start && index < end)
			toReturn += _$[index];
	}
	return toReturn;
}
Array.prototype.multiplyAll = function(index_start, index_end) {
	const _$ = this.valueOf();
	const start = index_start === "undefined" ? 0 : index_start;
	const end = index_end === "undefined" ? _$.length : index_end;
	let toReturn = 0;
	for (let index = 0; index < _$.length; index++) {
		if (index > start && index < end)
			if (toReturn * _$[index] < Math.pow(2, 26))
				toReturn *= _$[index];
			else
				toReturn = -1;
	}
	if (toReturn >= 0)
		return toReturn;
	else
		return -1;
}
Array.prototype.getPows = function(exponant) {
	return this.valueOf().map((cell) => {
		return Math.pow(cell, exponant);
	});
}
Array.prototype.parse = function(index_start, index_end) {
	const _$ = this.valueOf();
	const start = index_start === "undefined" ? 0 : index_start;
	const end = index_end === "undefined" ? _$.length : index_end;
	let toReturn = [];
	for (let index = 0; index < _$.length; index++) {
		if (index > start && index < end)
			toReturn.push(_$[index]);
	}
	return [...toReturn];
}
Array.prototype.has = function(_value) {
	let toReturn = false;
	this.valueOf().forEach((cell) => {
		if (cell == _value)
			toReturn = true;
	});
	return toReturn;
}
Array.prototype.isInRange = function(_index) {
	return this.valueOf().length > _index;
}
Array.prototype.insert = function(_value, index) {
	const _$ = this.valueOf();
	let toReturn = [];
	for (let index = 0; index < _$.length; index++) {
		toReturn.push(_$[index]);
		if (index == _index)
			toReturn.push(_value);
	}
	return [...toReturn];
}
Array.prototype.cut = function(_index) {
	const _$ = this.valueOf();
	let toReturn1 = [];
	let toReturn2 = [];
	for (let index = 0; index < _$.length; index++) {
		if (index <= _index)
			toReturn1.push(_$[index]);
		else
			toReturn2.push(_$[index]);
	}
	return [[...toReturn1], [...toReturn2]];
}
Array.prototype.each = function(task) {
	if (typeof task !== "function")
		Throw(err);
	let buffer;
	for (let index = 0; index < _$.length; index++) {
		task(index, _$[index], buffer, _$);
	}
	return buffer;
}
Array.prototype.iterableInt = function(arg) {
	let type = typeof(arg) === "number";
	
	if (type) {
		return this.valueOf().map(cell => {
			return parseInt(cell) += arg;
		});
	} else {
		return this.valueOf().map(cell => {
			return String(cell) += arg;
		});
	}
}
Array.prototype.iterable = function(arg) {
	return this.valueOf().map((cell) => {
		return parseInt(cell) += arg;
	})
}
Array.prototype.iterableString = function(arg) {
	return this.valueOf().map((cell) => {
		return String(cell) += arg;
	});
}
Array.prototype.last = function() {
	const _$ = this.valueOf();
	return _$[_$.length - 1];
}
Array.prototype.first = function() {
	return this.valueOf()[0];
}
Array.prototype.print = function() {
	console.log(`|Time:${Date.now()}`);
	console.log(`|-${this.valueOf()}`);
}
Array.prototype.getMedian = function() {
	const array = this.valueOf().sort();
	const LENGTH = array.length;
	if (_$.length % 2 == 0) {
		return array[LENGTH / 2] + ((array[LENGTH] + array[LENGTH + 1]) / 2);
	} else {
		return array[(LENGTH + 1) / 2];
	}
}
Array.prototype.repeat = function(loops) {
	const INIT = this.valueOf();
	let toReturn = [];
	for (let index = 0; index < loops; index++) {
		toReturn = [...toReturn, ...INIT];
	}
	return toReturn;
}
Array.prototype.removeLastCell = function() {
	const _$ = this.valueOf();
	const LENGTH = _$.length - 1;
	return _$.map((cell, i) => {
		console.log(i);
		if (i != LENGTH)
			return cell;
	});
}