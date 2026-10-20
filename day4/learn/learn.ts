// Part 1: Union Types — Already Familiar, Now Deeper

//1.1 Unions distribute over members
// Status is exactly one of those four strings, nothing else. Not "idle " (trailing space), not "", not "IDLE". The type is precise; a typo is a compile error.

type status = "idle" | "loading" | "success" | "error";

/*

1.2 Literal widening — a subtle behavior

const preserves the literal type, let widens to the base type. this matters when you are defining discriminated unions - you often want the literal type
*/
const s = "hello";
let s2 = "hello";

/*

force preservation as const
you'll use 'as const' constantly in real code - for enum-like constants, action types in Redux, and literal lookup tables.

*/
const config = { mode: "dark" } as const;

/*
1.3 Never forget: types are erased at runtime
type status = "idle" | "loading" -- 

this does NOT work - Status doesn't exist at runtime: 
if(x === Status.idle) {...}

this DOES work:
if(x === "idle"){...}

Mental rule: anything that's a type (not a value) is erased when compiled. If you need a runtime entity, use a const object or an enum. This is why Redux uses const ACTION_TYPES = { ADD: "ADD", ... } as const — the strings exist at runtime, and the union type is derived from them.


*/

/*

Part 2: Narrowing  - The Heart of Safe  Typescript

*/

// 2.1 typeof narrowing
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

console.log(format("Jerry"), "\n");
console.log(format(2300), "\n");

// in narrowing - property presence
type Bird = { fly: () => void; name: string };
type Fish = { swim: () => void; name: string };

function move(animal: Bird | Fish): void {
  if ("fly" in animal) {
    animal.fly();
  } else {
    animal.swim();
  }
}

// instanceof narrowing
function formating(err: string | Error): string {
  if (err instanceof Error) {
    return err.message;
  }
  return err;
}

// 2.4 Discriminating narrowing (the "tag" pattern)
// kind is the discriminant field. Checking it narrows the whole object. This is the pattern for typed state machines, reducers, and API response handling.

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  if (s.kind === "circle") {
    return Math.PI * s.radius * s.radius;
  }
  return s.side ** 2;
}

/* user-defined type guards

kind is the discriminant field. Checking it narrows the whole object. This is the pattern for typed state machines, reducers, and API response handling.


*/
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(x: unknown): string {
  if (isString(x)) {
    return x.toUpperCase();
  }
  return "not a string";
}

function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

function num(n: unknown): number {
  if (isNumber(n)) {
    return n;
  }
  return 0;
}

// 2.6 Assertion functions
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected a string");
  }
}

function processs(x: unknown): string {
  assertIsString(x);
  return x.toUpperCase();
}

// Part 3 keyof - Extracting the keys

interface User {
  id: number;
  name: string;
  email: string;
}

type UserKey = keyof User;

/*
keyof T gives you a union of the keys of T. Uses:

*/
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// const user = { id: 1, name: "Alice", email: "a@twitter.com" };

// const emails = getProperty(user, "email");
// const names = getProperty(user, "name");

// console.log("email: ", emails, "\nname: ", names, "\n");

// Part 4: Utility types -
// 4.1 Partial<T> - all properties optional
interface User {
  id: number;
  name: string;
  email: string;
}

function updateUser(user: User, patch: Partial<User>): User {
  return { ...user, ...patch };
}

// 4.2 Required<T> - all properties required

function makeRequired<T>(input: Partial<T>): Required<T> {
  return input as Required<T>;
}

// 4.3 Readonly<T> - all properties are read-only
interface Config {
  url: string;
  timeout: number;
}

function freeze(cfg: Config): Readonly<Config> {
  return cfg;
}

const frozen = freeze({ url: "x", timeout: 100 });

// 4.4 Pick<T, K> - select a subset of properties

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

type PublicUser = Pick<User, "id" | "name" | "email">;

function toPublicUser(user: User): Pick<User, "id" | "name" | "email"> {
  return { id: user.id, name: user.name, email: user.email };
}

// 4.5 Omit<T, K> - excludes a subset of properties

type PublicUsers = Omit<User, "Password">;

/**
Omit vs Pick rule of thumb
you want to remove a few fields -> Omit
you want to keep a few fields -> Pick
*/

// 4.6 Record<K, V> - object with specified key value types

type Category = "electronics" | "clothing" | "books";

const counts: Record<Category, number> = {
  electronics: 5,
  clothing: 12,
  books: 3,
};

//Important: this is safe — every key in Category must be present. Contrast with Record<string, V> (which is the unsafe case you hit yesterday — any string is allowed).

// 4.7 Excludes<T,U> and Extract<T,U> - filter unions

type Status = "idle" | "loading" | "success" | "error";
type NonError = Exclude<status, "error">;
type OnlyRead = Extract<Status, "success" | "error">;

// Exclude removes; Extract keeps. Both operate on unions — this is where they shine.

// Real use case - filtering a discriminated union

type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keydown"; key: string }
  | { type: "scroll"; delta: number };

type clickEvent = Extract<Event, { type: "click" }>;

// Extract<Event, { type: "click" }> picks out the union member whose type matches. This is the canonical way to write "I want this specific variant."

// 4.8 NonNullable<T>
// Removes null and undefined from a type. Use it when you've already checked for nulls but TS still thinks the type might be nullable.

type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;

// 4.9 ReturnType<T> and Parameter<T> - function introspection
function makeUser(id: number, name: string) {
  return { id, name, createdAt: new Date() };
}

type NewUser = ReturnType<typeof makeUser>;
type MakeArgs = Parameters<typeof makeUser>;
