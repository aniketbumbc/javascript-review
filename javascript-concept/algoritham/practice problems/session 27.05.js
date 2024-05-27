/**
 *  Link list
 * Add element at beginning of list is good scenario to use link-list
 */

class Linklist {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  prepend(value) {
    const newNode = { value: value, next: this.head };
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }
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

  find(value) {
    if (!this.head) {
      return null;
    }

    let currentNode = this.head;

    while (currentNode) {
      if (currentNode.value === value) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }

    return null;
  }

  delete(value) {
    if (!this.head) {
      return null;
    }

    while (this.head && this.head.value === value) {
      this.head = this.head.next;
    }

    let currentNode = this.head;

    while (currentNode.next) {
      if (currentNode.next.value === value) {
        currentNode.next = currentNode.next.next;
      } else {
        currentNode = currentNode.next;
      }
    }

    if (this.tail.value === value) {
      this.tail = currentNode;
    }
  }

  insertAfterValue(value, afterValue) {
    const exitingNode = this.find(afterValue);

    if (exitingNode) {
      const newNode = { value: value, next: exitingNode.next };
      exitingNode.next = newNode;
    }
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
linkList.append('Test-1');
linkList.append('Test-2');
linkList.append('Links List');
linkList.append('End');
linkList.prepend('First value');
linkList.delete('Test-2');
console.log(linkList.find('Test'));
console.log(linkList.find('sds'));
linkList.insertAfterValue('bunny', 'Test');

console.log(linkList.toDisplayList());
