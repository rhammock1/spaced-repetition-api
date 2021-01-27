
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
const sort = function(arr, List) {
  let length = arr.length;
  let filter = arr.filter((each) => each.incorrect_count === 0)
  if (filter.length === length) {
    arr.forEach((word) => List.insertLast(word));
    return List;
  } else {
    const sorted = mergeSort(arr);
    sorted.forEach((word) => List.insertLast(word));
    return List;
  }
  
}

const addToIncorrect = function(List, value) {
  const node = List.find(value);
  node.value.incorrect_count++;
  List.remove(node.value);
  List.insertMiddle(node.value);
  return node;
}

const addToCorrect = function(List, value) {
  const node = List.find(value);
  node.value.correct_count++;
  List.remove(value);
  List.insertLast(value);
  return node;
}


module.exports = { sort, addToCorrect, addToIncorrect};

