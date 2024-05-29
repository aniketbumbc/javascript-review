/**
 *  Queue data structure
 *  First in First out
 */

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    return this.items.unshift(value);
  }

  dequeue() {
    return this.items.pop();
  }

  isEmpty() {
    return this.items === 0;
  }

  toArray() {
    return this.items.slice();
  }
}

// const queue = new Queue();

// queue.enqueue('Item-1');
// queue.enqueue('Item-2');
// queue.enqueue('Item-3');
// queue.enqueue('Item-4');

// console.log(queue.toArray());

// queue.dequeue();
// console.log(queue.toArray());

/**
 *  Queue linklist
 */

class QueueList {
  constructor() {
    this.head = null;
    this.tail == null;
  }

  /**
   *  Prepend list
   * @param { } value
   */
  enqueueList(value) {
    const newNode = { value: value, next: null };

    if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    if (!this.head) {
      this.head = newNode;
    }
  }

  dequeueList() {
    if (!this.tail) {
      return null;
    }
    const currentHead = this.head;

    if (currentHead) {
      this.head = currentHead.next;
    }
    return currentHead;
  }

  isEmpty() {
    return !this.head;
  }

  displayList() {
    let currentNode = this.head;
    const element = [];
    while (currentNode) {
      element.push(currentNode);
      currentNode = currentNode.next;
    }
    return element;
  }
}

const q1 = new QueueList();

q1.enqueueList('Buuny-1');
q1.enqueueList('Buuny-2');
q1.enqueueList('Buuny-3');
q1.enqueueList('Buuny-4');

console.log(q1.displayList());

console.log(q1.dequeueList());

console.log(q1.dequeueList());
console.log(q1.displayList());
