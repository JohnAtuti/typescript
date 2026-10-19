// 1.1 Callback parameter typing
function runTwice(fn: () => void): void {
  fn();
  fn();
}

runTwice(() => console.log("HI"));
/*
The type () => void means "a function that takes no args and returns nothing."

Passing (x: number) => void to it would be an error (wrong shape).
*/

// 1.2 void in callbacks is special
function runTwicee(fn: () => void): void {
  fn();
}

// this is allowed even though console.log returns undefined and the arrow returns a number:
runTwicee(() => console.log("\nBuild AI in mobile apps that work offline\n"));

/*
Why? TypeScript treats () => void as "I don't care what you return."

A function returning a value can be assigned to a void-returning type.

This is deliberate — it's what makes
arr.forEach(x => doSomething(x)) work even though doSomething returns something.

Contrast with other return types: () => number does not accept () => string. Only void is lenient this way.


*/

// 1.3 Optional, default, and rest parameters
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}

console.log("name: ", greet("Alice"));
console.log(greet("Alice", "Dr."));

function greetWithDefault(name: string, title = "Mr. "): string {
  return `${title} ${name}`;
}

console.log("\n");

console.log(greetWithDefault("Jeremy"));
console.log("\n");

function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

console.log("Sum: ", sum(12, 23, 43, 42, 34), "\n");

// RULE: optional parameters must come after required ones

// 1.4 Function overloads — you'll see these but rarely write them

// function parseInput(input: string): number;
// function parseInput(input: number): string;

// function parseInput(input: string | number): string {
//   if (typeof input === "string") return `${(parseInput(input), 10)}`;

//   return input.toString();
// }

//2.1 The problem generics solve
function firstNumber(arr: number[]): number | undefined {
  return arr[0];
}

function firstString(arr: string[]): string | undefined {
  return arr[10];
}

// function firstUser(arr:User[]): User | undefined{
//     return arr[10]
// }

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const n = first([1, 2, 3, 4]);
const s = first(["a", "b"]);
// const u = first<User>(users);
// console.log(n);

// console.log(s);

// 2.3 Two type parameters
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const p = pair("Hello", 42);

console.log(p);

console.log("\n");

// 2.4 Generic with a constraint — extends
// Sometimes you want T to be any type, but only among types that have a certain shape. That's what extends does in a generic:

function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

console.log(longest("Hello", "Jeremy"), "\n");
/*
<T extends { length: number }> means "T can be anything, as long as it has a length: number property." Both string and number[] qualify.

Without the constraint: a.length would error inside the function, because T could be {} with no length. The constraint unlocks the properties you need.


*/

// Part 3: Generic Interfaces and Type Aliases
interface Box<T> {
  value: T;
  getValue(): T;
}

console.log("\n");
const stringBoxes: Box<string> = {
  value: "My name",
  getValue() {
    return this.value;
  },
};

console.log("String boxes\n", stringBoxes.getValue(), "\n");

// const lengthBox = stringBoxes.getValue<string>((str: string) => str.length);

const numberBox: Box<number> = {
  value: 42,
  getValue() {
    return this.value;
  },
};

const stringBox: Box<string> = {
  value: "hello",
  getValue() {
    return this.value;
  },
};

// 3.2 Generic type alias
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parseJson<T>(json: string): Result<T> {
  try {
    return { ok: true, value: JSON.parse(json) as T };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

function parseJJson<T>(jsonString: string): Result<T> {
  try {
    const data = JSON.parse(jsonString);
    return { ok: true, value: data };
  } catch (e) {
    return { ok: false, error: "Invalid JSON" };
  }
}

const result = parseJJson<{ name: string }>('{"name":"Jerry"}');

console.log("\n");

if (result.ok) {
  console.log(result.value.name);
} else {
  console.log(result.error);
}

console.log("\n");

const r = parseJson<{ name: string }>('{"name","Alice"}');

if (r.ok) {
  console.log(r.value.name);
} else {
  console.log(r.error);
}

/*
This pattern — generic + discriminated union — is the workhorse of real TypeScript. Every API client, every reducer, every async wrapper uses something like it. You saw the fixed-shape version yesterday (ApiResponse<Product>); now you see how to build the reusable version.
 */

// 3.3 Multiple type params with defaults

type ApiResult<TData, TError = string> =
  | { ok: true; data: TData }
  | { ok: false; error: TError };

type BasicResult = ApiResult<number>;
type CustomResult = ApiResult<number, { code: number }>;

/*
= string sets a default type parameter. If you don't supply TError, it's string. You'll see this constantly in library types (Promise<T>, Map<K, V>, React.FC<P>).

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

interface User {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
}

const users: User[] = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Robbert", role: "editor" },
  { id: 3, name: "Charles", role: "viewer" },
  { id: 4, name: "Arnold", role: "editor" },
];

const groupedUsers = groupBy(users, (user) => user.role);

console.log("\n", groupedUsers, "\n\n");

groupedUsers["admin"].forEach((admin) => {
  console.log(admin.name);
});

console.log("\n");

// function pipe<A, B>(fn1: (a: A) => B): (a: A) => B;
function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;
function pipe<A, B, C, D>(
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
): (a: A) => D;
function pipe(...fns: Function[]) {
  return (x: any) => fns.reduce((v, f) => f(v), x);
}

/*

This is a beautiful and advanced piece of TypeScript! You have just stepped into the world of **Functional Programming** and **Function Overloading**. 

Here is the plain English translation of what this code does:
> *"I am building a machine that connects functions together like an assembly line. You give me 1, 2, or 3 functions. I will make sure the output of one perfectly fits the input of the next. I will then hand you back a single, brand-new function that runs the whole assembly line at once."*

Let’s break this down into the three major concepts hiding in this code.

---

### 1. The Concept: What is a `pipe`?
In functional programming, `pipe` is used to chain functions together. The output of the first function becomes the input of the second, the output of the second becomes the input of the third, and so on.

Think of it like a plumbing pipe or a factory conveyor belt:
* **Machine 1:** Takes raw wood (`A`), cuts it, and outputs a plank (`B`).
* **Machine 2:** Takes the plank (`B`), paints it, and outputs a painted plank (`C`).
* **Machine 3:** Takes the painted plank (`C`), adds legs, and outputs a table (`D`).

### 2. The Magic: Function Overloading (The Top 3 Lines)
You might be wondering: *"Why are there three separate `function pipe...` lines at the top?"*

This is called **Function Overloading**. It allows a single function to have multiple, highly specific "contracts" depending on how many arguments you pass to it. 

Let's look at how the types chain together perfectly:

**Overload 1 (1 function):**
```typescript
function pipe<A, B>(fn1: (a: A) => B): (a: A) => B;
```
* Takes `fn1` (turns `A` into `B`).
* Returns a function that takes `A` and returns `B`.

**Overload 2 (2 functions):**
```typescript
function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;
```
* Takes `fn1` (turns `A` into `B`) **AND** `fn2` (turns `B` into `C`).
* Notice the magic: `fn1` outputs `B`, and `fn2` requires `B` as input! **TypeScript enforces that the pipes actually connect.**
* Returns a function that takes `A` and returns `C`.

**Overload 3 (3 functions):**
```typescript
function pipe<A, B, C, D>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): (a: A) => D;
```
* Chains `A -> B -> C -> D`.
* Returns a function that takes `A` and returns `D`.

**Why do this?** 
If we didn't use overloads, we would have to use a generic array of functions, and TypeScript would lose track of the middle types (`B` and `C`). Overloads give us **100% perfect type safety** for up to 3 functions.

### 3. The Engine: The Implementation (The Bottom Line)
```typescript
function pipe(...fns: Function[]) {
  return (x: any) => fns.reduce((v, f) => f(v), x);
}
```
This is the **Implementation Signature**. This is the actual JavaScript code that runs when you call the function. 

* **`...fns: Function[]`**: Gathers all the arguments passed in into an array called `fns`.
* **`return (x: any) => ...`**: This is a **Higher-Order Function**. It doesn't run the pipeline immediately; it *returns a new function* that waits for you to pass it the starting value (`x`).
* **`fns.reduce(...)`**: This loops through the array of functions. It takes the current value (`v`), passes it into the current function (`f`), and uses the result as the starting value for the next iteration.

**Crucial TypeScript Rule:** Notice that the implementation uses `any` and `Function[]`. **This loose implementation is hidden from the outside world.** The outside world only sees the strict, beautiful Overloads (the top 3 lines). 

---

### Let's see it in action!

Let's build our wood-to-table factory.

```typescript
// 1. Define our simple machines (functions)
const cutWood = (wood: string): string => wood + " [cut]";       // string -> string
const paintPlank = (plank: string): number => plank.length;      // string -> number
const calculatePrice = (length: number): string => `$${length}`; // number -> string

// 2. Build the pipe!
// We pass 3 functions. TypeScript uses the 3rd Overload.
// A = string, B = string, C = number, D = string
const buildTable = pipe(cutWood, paintPlank, calculatePrice);

// 3. Use the new machine!
// 'buildTable' is now a function that takes a string (A) and returns a string (D).
const finalProduct = buildTable("Oak"); 

console.log(finalProduct); 
// Output: "$11" (Because "Oak [cut]" has 11 characters!)
```

### What happens if the pipes don't connect?
Because of the overloads, TypeScript will catch mismatched pipes instantly!

```typescript
const badPipe = pipe(cutWood, calculatePrice);
// ❌ TYPESCRIPT ERROR!
// cutWood outputs a 'string' (B).
// calculatePrice expects a 'number' (B).
// A string cannot be passed where a number is expected! The pipe is broken.
```

### Summary
* **What it is:** A utility to chain functions together, where the output of one becomes the input of the next.
* **The Overloads (Top 3 lines):** Provide strict, exact type checking to ensure the output type of Function 1 perfectly matches the input type of Function 2.
* **The Implementation (Bottom line):** The actual runtime logic that uses `reduce` to execute the chain. It uses loose types (`any`) because the strict types are already guaranteed by the overloads.
* **Higher-Order Function:** It doesn't execute the chain immediately; it returns a *new* function that represents the completed assembly line.

*/
