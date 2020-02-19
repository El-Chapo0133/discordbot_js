String.prototype.toJson = function() {
	return JSON.parse(this.valueOf());
}
String.prototype.removeFirstChar = function() {
	const _$ = this.valueOf();
	return _$.substring(1, _$.length - 1);
}
String.prototype.toInt = function() {
	return parseInt(this.valueOf());
}
String.prototype.getChars = function() {
	return this.valueOf().split('');
}
String.prototype.getASCIIChars = function() {
	let toReturn = [];
	for (char of this.valueOf()) {
		toReturn.push(parseInt(char));
	}
	return toReturn;
}
String.prototype.removeLastChar = function() {
	const _$ = this.valueOf();
	return _$.substring(0, _$.length - 2);
}
String.prototype.addBackSlash = function() {
	let toReturn = "";
	for (char of this.valueOf()) {
		toReturn += `\\${char}`;
	}
	return toReturn;
}
String.prototype.each = function(task) {
	const _$ = this.valueOf();
	for (index in _$) {
		task(index, _$[index], _$[index - 1], _$);
	}
	return buffer;
}
String.prototype.print = function() {
	console.log(`|Time:${Date.now()}`);
	console.log(`|-${this.valueOf()}`);
}
String.prototype.has = function(input) {
	for (char of this.valueOf()) {
		if (char === input)
			return true;
	}
	return false;
}
String.prototype.parse = function(_index) {
	const _$ = this.valueOf();
	let first = "";
	let second = "";
	for (index in _$) {
		if (index <= _index)
			first += _$[index];
		else
			second += _$[index];
	}
	return [first, second];
}