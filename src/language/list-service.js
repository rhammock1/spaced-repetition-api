const List = require('./linked-list');

const merge = function(left, right, arr) {
  let leftIndex = 0;
  let rightIndex = 0;
  let outputIndex = 0;
  while(leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].incorrect_count > right[rightIndex].incorrect_count) {
      arr[outputIndex++] = left[leftIndex++];
    } else {
      arr[outputIndex++] = right[rightIndex++];
    }
  }

  for (let i = leftIndex; i < left.length; i++) {
    arr[outputIndex++] = left[i];
  }
  for (let i = rightIndex; i < right.length; i++) {
    arr[outputIndex++] = right[i];
  }
  return arr
}

const mergeSort = function(arr) {
  // MERGE SORT 
  if (arr.length <= 1) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle, arr.length)

  left = mergeSort(left);
  right = mergeSort(right);
  return merge(left, right, arr);

}

// This function creates a new list and sorts it by incorrect count
// It will be called in the language services file and used to create
//  a new list each time the client makes a request to get all words.
const newList = function(arr) {
  const words = new List();
  const sorted = mergeSort(arr);
  sorted.forEach((word) => words.insertLast(word));
  return words;
}

const addToIncorrect = function(List, value) {
  const node = List.find(value);
  node.value.incorrect_count++;
}

const addToCorrect = function(List, value) {
  const node = List.find(value);
  node.value.correct_count++;
}

const getHead = function(List) {
  return List.head;
}

module.exports = { newList, addToCorrect, addToIncorrect, getHead};

