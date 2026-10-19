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
