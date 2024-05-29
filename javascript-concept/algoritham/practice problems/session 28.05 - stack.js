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

const s1 = new Stack();

s1.push('A1');
s1.push('A2');
s1.push('A3');
console.log(s1.displayToArray());
console.log(s1.pop());
console.log(s1.isEmpty());
console.log(s1.displayToArray());
