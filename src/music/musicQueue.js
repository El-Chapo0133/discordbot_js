/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Provide a queue for the music
 */

class Queue {
	constructor() {
		this.queue = [];
		this.loop = false;
		this.loopqueue = false;
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
		});
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
	toggleLoopQueue() {
		this.loopqueue = this.loopqueue === false ? true : false;
	}
	isLooped() {
		return this.loop;
	}
	isQueueLooped() {
		return this.loopqueue;
	}
	length() {
		return this.queue.length;
	}
	getAll() {
		return [...this.queue];
	}
	set(e) {
		//if (typeof e === "Array")
		this.queue = e;
	}
	select(e) {
		try {
			return this.queue[e.id];
		} catch(exception) {
			return "undefined"
		}
	}
	shuffle() {
		let index = 0;
		let first = this.first();
		const newArray = shuffleArray(this.queue.map(cell => {
			if (index++ !== 0)
				return cell;
		}));
		this.queue = [first, ...removeUndefineds(newArray)];
	}
}

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
function removeUndefineds(array) {
	var toReturn = [];
	for (let index = 0; index < array.length; index++) {
		if (String(array[index]) != "undefined") {
			toReturn.push(array[index]);
		}
	}
	return toReturn;
}

module.exports = new Queue();