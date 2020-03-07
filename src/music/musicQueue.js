/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Provide a queue for the music
 */

class Queue {
	constructor() {
		this.queue = [];
		this.loop = false;
	}
	add(e) {
		this.queue.push(e);
		//console.log({queue: this.queue})
	}
	remove(e) {
		let index = 0;
		this.queue = this.queue.map(cell => {
			if (index++ != e.id)
				return cell;
		})
	}
	shift(e) {
		this.queue.shift();
	}
	clear() {
		this.queue = [];
	}
	first() {
		return this.queue[0];
	}
	second() {
		return this.queue[1];
	}
	isEmpty() {
		return this.queue.length === 0;
	}
	toggleLoop() {
		this.loop = this.loop === false ? true : false;
	}
	isLooped() {
		return this.loop;
	}
	length() {
		return this.queue.length;
	}
	getAll() {
		return this.queue;
	}
}

module.exports = new Queue();