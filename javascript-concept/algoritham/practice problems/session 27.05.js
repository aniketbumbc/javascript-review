/**
 *  Link list
 *
 */

class Linklist {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(value) {
    const newNode = { value: value, next: null };

    if (!this.head) {
      this.head = newNode;
    }

    if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
  }

  toDisplayList() {
    const element = [];
    let currentNode = this.head;

    while (currentNode) {
      element.push(currentNode);
      currentNode = currentNode.next;
    }

    return element;
  }
}

const linkList = new Linklist();

linkList.append(1);
linkList.append('Test');
linkList.append('Links List');
linkList.append('End');

console.log(linkList.toDisplayList());
