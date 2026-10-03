//QUESTION 1

function deepEqual(objA, objB) {
  // Same value or same reference (also handles equal numbers/strings)
  if (objA === objB) return true;

  // If either one is not an object (or is null), they can't be equal
  if (
    typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // Different number of keys means different objects
  if (keysA.length !== keysB.length) return false;

  // Every key in A must exist in B with an equal value (recursive)
  for (const key of keysA) {
    if (!Object.hasOwn(objB, key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}

console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })); // false
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 }));                     // false

//QUESTION 2

function diffObjects(oldObj, newObj) {
  const result = { added: {}, removed: {}, changed: {} };

  // A Set of keys lets us check "does this key exist?" quickly
  const oldKeys = new Set(Object.keys(oldObj));
  const newKeys = new Set(Object.keys(newObj));

  for (const key of newKeys) {
    if (!oldKeys.has(key)) {
      // In new but not in old: added
      result.added[key] = newObj[key];
    } else if (oldObj[key] !== newObj[key]) {
      // In both, but the value is different: changed
      result.changed[key] = { from: oldObj[key], to: newObj[key] };
    }
  }

  for (const key of oldKeys) {
    if (!newKeys.has(key)) {
      // In old but not in new: removed
      result.removed[key] = oldObj[key];
    }
  }

  return result;
}

const before = { a: 1, b: 2, c: 3 };
const after = { b: 2, c: 99, d: 4 };

console.log(diffObjects(before, after));
// {
//   added: { d: 4 },
//   removed: { a: 1 },
//   changed: { c: { from: 3, to: 99 } }
// }


//QUESTION 3

function deepFreeze(obj) {
  // Freeze the current level first
  Object.freeze(obj);

  // Then go through every value and freeze nested objects too
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return obj;
}

const config = deepFreeze({ api: { baseUrl: 'https://x.com', retries: 3 }, debug: false });

config.api.baseUrl = 'https://changed.com'; // should be ignored
config.debug = true;                        // should be ignored

console.log(config.api.baseUrl, config.debug); // "https://x.com" false
console.log(Object.isFrozen(config.api));      // true

//QUESTION 4

function createCounter() {
  let count = 0; // private: only the functions below can reach it

  return {
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
    get value() {
      return count;
    },
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.value); // 1
console.log(counter.count); // undefined: not directly accessible

//QUESTION 5
function validateSchema(obj, schema) {
  const errors = [];

  for (const [key, expectedType] of Object.entries(schema)) {
    if (!Object.hasOwn(obj, key)) {
      // The key isn't in the object at all
      errors.push(`${key}: missing property`);
    } else if (typeof obj[key] !== expectedType) {
      // The key exists, but the value is the wrong type
      errors.push(`${key}: expected ${expectedType}, got ${typeof obj[key]}`);
    }
  }

  return errors;
}

const schema = { name: 'string', age: 'number', isAdmin: 'boolean' };

console.log(validateSchema({ name: 'Ada', age: 21, isAdmin: false }, schema));
// []

console.log(validateSchema({ name: 'Ada', age: '21' }, schema));
// ['age: expected number, got string', 'isAdmin: missing property']


