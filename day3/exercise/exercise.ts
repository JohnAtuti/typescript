/*
□ What is a generic function? What problem does it solve? it is a function that allows you to write functions that work with any data type while remembering the specific type that was passed in. it solves the problem of overloaded functions and use of any  type. it allows you to write reusable code without sacrificing type safety

□ What does <T> mean in function first<T>(arr: T[]): T | undefined? T is the data type that will be passed when the function is called. in this case, it will be an array, of any data type, either an array of strings, numbers

□ When you call first(["a"]), what type is T inferred as? Can you override it? it is inferred as an array of strings/string. yes, it can be overriden by providing an array of any other data type.

□ What does <T extends { length: number }> mean, and why is the constraint necessary?
It means the type T mist must have a length property. the constraint ensures that the length property must be a number.

□ What does Box<T> look like as a concrete type when T = number?
Box<T> transforms from an abstract blueprint into  a highly specific contract that demands everything in it to be a number.

□ What is the role of <U> in map<U>(fn: (value: T) => U): Box<U>? Why can't you reuse T? T is the input data you currently have, U is the type of data you want to transform T into. you cannot reuse T because their will be no data transformation, you will be telling typescript to take T and return the exact value of T

□ In Result<T>, why does if (r.ok) let you access r.value in the true branch? because ok property acts as a tag that let's you narrow down the type

□ When would you use a generic type alias vs. a plain generic interface?
use interface when defining shapes of an object.
use types when you need to combine types, use primitives or do complex type math

*/

/*
 Exercise 1 — first<T>

// Write a generic function first<T>(arr: T[]): T | undefined that returns the first element or undefined if the array is empty.
*/

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
console.log("\n", first([1, 2, 3]), "");
console.log(first(["a", "b"]), "");
console.log(first([]), "\n");

/*
Exercise 2 — last<T> and pairs<A, B>

Write two generic functions:

last<T>(arr: T[]): T | undefined — returns the last element.

pairs<A, B>(a: A, b: B): [A, B] — returns a tuple of the two arguments.

Test both. For pairs, verify that pairs("hello", 42) is typed as [string, number].

*/
function last<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

console.log("\n", last(["hello", 42, 94, 39, "jerry", 4500]), "\n");

function pairs<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

console.log(pairs("Michelle", 323));

/*
Exercise 3 — Constrained generic 
longest<T extends { length: number }>
Write longest<T extends { length: number }>(a: T, b: T): T — returns whichever has a longer length.
*/

function longest<T extends { length: number }>(a: T, b: T) {
  return a.length >= b.length ? a : b;
}

console.log("\n", longest("Knight Jerald", "Jeremy"), "\n");
console.log(
  longest([12, 34, 54, 6], ["Alice", "Peter", "Ann", "Michelle", "Miriam"]),
);

//console.log(longest(123, 434)); //argument of type 'number' is not assignable to parameter of type '{length: number}'

/*

Exercise 4 — groupBy<T, K> (the real one)
ts
function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]>
Implement it. Test with:

ts
interface Product { name: string; category: string; price: number; }
const products: Product[] = [
  { name: "Laptop", category: "electronics", price: 1299 },
  { name: "Shirt", category: "clothing", price: 29 },
  { name: "Phone", category: "electronics", price: 899 },
];

const byCategory = groupBy(products, p => p.category);
// expected: { electronics: [Laptop, Phone], clothing: [Shirt] }
console.log(byCategory);
Then verify:

byCategory.electronics is typed as Product[]

byCategory.clothing is typed as Product[]

Try byCategory.furniture — is it an error, or does it come back undefined? Explain in a comment. (Hint: Record<K, T[]> doesn't say "only K" — K is the inferred key type. Since keyFn returns string, K = string, so any string key is allowed and typed as Product[] even if the runtime value is undefined. This is the same index-signature hazard from Day 2. Note it — we'll address it more thoroughly in Day 4 with keyof and mapped types.)
*/

function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;

  for (const item of items) {
    const key = keyFn(item);
    (result[key] ??= []).push(item);
  }

  return result;
}

interface Product {
  name: string;
  category: string;
  price: number;
}

const products: Product[] = [
  { name: "Laptop", category: "electronics", price: 1299 },
  { name: "Shirt", category: "clothing", price: 29 },
  { name: "Phone", category: "electronics", price: 899 },
];

const groupByCategory = groupBy(products, (pairs) => pairs.category);

console.log("\n", groupByCategory, "\n");
const groupByPrice = groupBy(products, (p) => p.price);

console.log("\n", groupByPrice, "\n");

//
console.log("\n", groupByCategory.furniture, "\n"); // undefined. K is defined as a string not as a union

// Why `byCategory.furniture` compiles but is `undefined` at runtime:
// K is inferred as `string` (because p.category is a string), not as
// the union "electronics" | "clothing". So `Record<string, Product[]>`
// says "any string key → Product[]". The compiler cannot know which
// keys actually exist at runtime, so any string access is permitted.
// TypeScript sees `byCategory.furniture: Product[]`, but at runtime
// it's undefined. Accessing `.length` on it would crash.
// Fix options:
//   (a) Narrow K at the call site: groupBy(products, p => p.category as "electronics" | "clothing")
//   (b) Use a `Map<K, T[]>` instead of `Record` (Map has .get with undefined).
//   (c) In Day 4, we'll see `noUncheckedIndexedAccess` and see why Record is dangerous.

/*

Exercise 5 — Generic Box<T>
Define:


interface Box<T> {
  value: T;
  map<U>(fn: (value: T) => U): Box<U>;
}

function makeBox<T>(value: T): Box<T> {
  return {
    value,
    map(fn) {
      return makeBox(fn(value));
    },
  };
}

const doubleBox = makeBox(21).map(x => x * 2);      // Box<number> with value 42
const stringBox = makeBox(21).map(x => `n=${x}`);   // Box<string> with value "n=21"

console.log(doubleBox.value);  // 42
console.log(stringBox.value);  // "n=21"

*/

interface Box<T> {
  value: T;
  map<U>(fn: (value: T) => U): Box<U>;
}

function makeBox<T>(value: T): Box<T> {
  return {
    value,
    map(fn) {
      return makeBox(fn(value));
    },
  };
}

const doubleBox = makeBox(21).map((x) => x * 2);
const stringBox = makeBox(21).map((x) => `n = ${x}`);

console.log("\n", doubleBox.value, "\n");
console.log("\n", stringBox.value, "\n");

/*

type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parseJson<T>(json: string): Result<T> {
  try {
    return { ok: true, value: JSON.parse(json) as T };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
*/

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parseJson<T>(json: string): Result<T> {
  try {
    return { ok: true, value: JSON.parse(json) as T };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

const valid = parseJson<{ name: string }>('{"name":"Alice"}');
const invalid = parseJson<{ name: string }>("not json");

if (valid.ok) {
  console.log(valid.value.name);
} else {
  console.log(valid.error);
}

if (invalid.ok) {
  console.log(invalid.value.name);
} else console.log(invalid.error);
