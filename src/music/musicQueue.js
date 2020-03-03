/**
 * Author : Loris Levêque
 * Date : 18.02.2020
 * Description : Provide a queue for the music
 */

let queue = [

]


class Queue {
	add(e) {
		/*let newItem = Struct() {
			e.title,
			e.url,
			e.connection
		};*/
		queue.push("test");
	}
	remove(e) {
		let index = 0;
		queue = queue.map(cell => {
			if (index++ != e.id)
				return cell;
		})
	}
	shift(e) {
		queue.shift();
	}
	clear() {
		queue = [];
	}
	isEmpty() {
		return queue.length === 0;
	}
}

module.exports = new Queue();