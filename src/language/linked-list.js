class _Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.length = 0;
    this.head = null;
    this.tail = null;
  }

  insertFirst(value) {
    const node = new _Node(value);
    if (!this.length) {
      this.head = node;
      this.tail = node;
      this.length++;
      return this.head;
    } else {
      this.head.next = node;
      node.prev = this.head;
      this.head = node;
      this.length++;
      return this.head;
    }
  }

  insertLast(value) {
    if (this.head === null) {
      this.insertFirst(value);
    } else {
      const node = new _Node(value);
      this.tail.prev = node;
      node.next = this.tail;
      this.tail = node;
      this.length++;
      return this.tail;
    }
  }

  find(value) {
    if (!this.head) {
      return null;
    }
    // This method searches from both ends at the same time
    let headNode = this.head;
    let tailNode = this.tail;
    let foundNode;
    while (headNode !== tailNode.next) {
      if(headNode.value === value) {
        foundNode = headNode;
      } else if (tailNode.value === value) {
        foundNode = tailNode;
      }
      headNode = headNode.prev;
      tailNode = tailNode.next;
    }
    return foundNode;
  }

  remove(value) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === value) {
      this.head = this.head.prev;
      this.length--
      return;
    }
    const nodeToRemove = this.find(value);
    let prevNode = nodeToRemove.prev;
    let nextNode = nodeToRemove.next;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
    this.length--;
  }

  display() {
    const values = [];
    let length = this.length;
    let tempNode = this.head;
    while (length) {
      values.push(tempNode.value)
      tempNode = tempNode.prev;
      length--;
    }
    return values;
  }
}

// const q = new DoublyLinkedList();
// const l = [1,2,3,4,5,6,7];
// l.forEach((num) => q.insertLast(num));
// console.log(q);

module.exports = DoublyLinkedList;