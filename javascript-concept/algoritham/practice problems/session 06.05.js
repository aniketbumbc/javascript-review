/**
 *  priority queue items in process in based on priority rather than one by one
 */

class Node {
  constructor(value, priority) {
    this.value = value;
    this.next = null;
    this.priority = priority;
  }
}

class PriorityQueue {
  constructor() {
    this.first = null;
  }

  insert(value, priority) {
    const newNode = new Node(value, priority);

    if (!this.first || priority > this.first.priority) {
      newNode.next = this.first;
      this.first = newNode;
    } else {
      let currentNode = this.first;
      while (currentNode.next && priority < currentNode.next.priority) {
        currentNode = currentNode.next;
      }
      newNode.next = currentNode.next;
      currentNode.next = newNode;
    }
  }

  process() {
    // Keep first item as previous next item
    const firstItem = this.first;
    this.first = this.first.next;
    return firstItem;
  }
}

const queue = new PriorityQueue();
queue.insert('hello', 100);
queue.insert('aniket', 10);
queue.insert('test', 3);
queue.insert('mike', 300);
console.log(queue);

console.log(queue.process());
console.log(queue.process());
console.log(queue.process());
