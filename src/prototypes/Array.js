Array.prototype.removeIndex = function(_index) {
	const _$ = this.valueOf();
	var toReturn = [];
	for (var index = 0; index < _$.length; index++) {
		if (index != _index)
			toReturn.push(_$[index]);
	}
	return [...toReturn];
}
Array.prototype.removeValue = function(_value) {
	const _$ = this.valueOf();
	var toReturn = [];
	for (var index = 0; index < _$.length; index++) {
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
	var toReturn = "";
	this.valueOf().map(cell => {
		toReturn += String(cell);
	})
	return toReturn;
}
Array.prototype.clone = function() {
	return [...this.valueOf()];
}
Array.prototype.sumAll = function(index_start, index_end) {
	const _$ = this.valueOf();
	const start = index_start === "undefined" ? 0 : index_start;
	const end = index_end === "undefined" ? _$.length : index_end;
	var toReturn = 0;
	for (var index = 0; index < _$.length; index++) {
		if (index > start && index < end)
			toReturn += _$[index];
	}
	return toReturn;
}
Array.prototype.multiplyAll = function(index_start, index_end) {
	const _$ = this.valueOf();
	const start = index_start === "undefined" ? 0 : index_start;
	const end = index_end === "undefined" ? _$.length : index_end;
	var toReturn = 0;
	for (var index = 0; index < _$.length; index++) {
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
	var toReturn = [];
	for (var index = 0; index < _$.length; index++) {
		if (index > start && index < end)
			toReturn.push(_$[index]);
	}
	return [...toReturn];
}
Array.prototype.has = function(_value) {
	this.valueOf().forEach((cell) => {
		if (cell == _value)
			return true;
	});
	return false;
}
Array.prototype.isInRange = function(_index) {
	return this.valueOf().length > _index;
}
Array.prototype.insert = function(_value, index) {
	const _$ = this.valueOf();
	var toReturn = [];
	for (var index = 0; index < _$.length; index++) {
		toReturn.push(_$[index]);
		if (index == _index)
			toReturn.push(_value);
	}
	return [...toReturn];
}
Array.prototype.cut = function(_index) {
	const _$ = this.valueOf();
	var toReturn1 = [];
	var toReturn2 = [];
	for (var index = 0; index < _$.length; index++) {
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
	var buffer;
	for (var index = 0; index < _$.length; index++) {
		task(index, _$[index], buffer, _$);
	}
	return buffer;
}
Array.prototype.iterableInt = function(arg) {
	var type = typeof(arg) === "number";
	
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