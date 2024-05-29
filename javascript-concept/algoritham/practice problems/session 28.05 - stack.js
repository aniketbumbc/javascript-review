/**
 *  Stack Implementation
 */

class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    const ele = this.items.pop();
    return ele;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  displayToArray() {
    return this.items.slice();
  }
}

// const s1 = new Stack();

// s1.push('A1');
// s1.push('A2');
// s1.push('A3');
// console.log(s1.displayToArray());
// console.log(s1.pop());
// console.log(s1.isEmpty());
// console.log(s1.displayToArray());

/**
 *  Stack using link-list
 */

class StackLinkList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  push(value) {
    /*
    **
    Add the item first to the list prepend item
    */
    const newNode = { value: value, next: this.head };
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
  }

  pop() {
    if (!this.head) {
      return null;
    }
    /*
    **
    delete the item first to the list
    */

    const deleteItem = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    return deleteItem;
  }

  isEmpty() {
    return !this.head;
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

const stacklist = new StackLinkList();

stacklist.push('Test');
stacklist.push('Test-1');
stacklist.push('Test-2');
stacklist.push('Test-3');

console.log(stacklist.toDisplayList());

console.log(stacklist.pop());
console.log(stacklist.pop());
console.log(stacklist.pop());
console.log(stacklist.pop());
console.log(stacklist.toDisplayList());
console.log(stacklist.isEmpty());
