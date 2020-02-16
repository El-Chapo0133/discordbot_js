String.prototype.toJson = function() {
	return JSON.parse(this.valueOf());
}