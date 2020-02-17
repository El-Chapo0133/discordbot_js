String.prototype.toJson = function() {
	return JSON.parse(this.valueOf());
}
String.prototype.removeFirstChar = function() {
	const _$ = this.valueOf();
	return _$.substring(1, _$.length - 1);
}