// Exercise 1 — Define User

interface User {
  readonly id: number;
  name: string;
  email: string;
  age?: number;
}

const user1: User = {
  id: 32094, // not optional and is readonly, cannot be changed once written
  name: "Jeremy", // not optional
  email: "jeremy@fakes.com", // not optional
  age: 43, //optional
};

const user2: User = {
  id: 9045734, // not optional, readonly
  name: "Fredrick", // not optional
  email: "fred@busyboy.com", //not optional
};

// Exercise 2 — Extend User

interface Admin extends User {
  permissions: string[];
  lastLoginAt: Date;
}

const administrator1: Admin = {
  id: 90439865, //not optional in the parent interface and also readonly
  name: "Fredrick Wang", // not optional in the parent interface
  email: "wang@gmail.com", //not optional in the parent interface
  age: 23, //optional, can be left out
  permissions: [
    "Access student performance records",
    "Access staff salary",
    "revoke staff access to sensitive data",
  ],
  lastLoginAt: new Date(),
};

// Exercise 3 — Literal union with type

type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled"; // this is a type alias.  A literal union

// then
interface Order {
  readonly id: string;
  status: OrderStatus;
  total: number;
}

const order1: Order = {
  id: "first order of the day",
  status: "pending",
  total: 4,
};

const order2: Order = {
  id: "second order of the day",
  status: "delivered",
  total: 3,
};

const order3: Order = {
  id: "third order of the day",
  status: "shipped",
  total: 5,
};

const returned: Order = {
  id: "returned order",
  // status:"returned", // the type 'returned' is not assignable to type 'Orderstatus'
  status: "cancelled",
  total: 20,
};

//Exercise 4 — Function shape
type Logger = (message: string, level: "info" | "warn" | "error") => void;

function runTask(task: () => void, log: Logger): void {
  log("starting", "info");
  task();
  log("done", "info");
}

runTask(
  () => console.log("Doing the work"),
  (msg, level) => console.log(`[${level}] ${msg}`),
);

// index-signature-danger
interface Env {
  [keys: string]: string;
}

const urls: Env = {
  supabase_public_url: "https://supabase.co",
  supabase_anon_key: "458763gfbvhgrvfebehtgu",
  supabase_publishable_key: "https://supabasepublishables65848.supabase",
};

console.log(urls);
console.log("\nsupabase Public url: ", urls.supabase_public_url);
console.log("\nsupabase anon key: ", urls.supabase_anon_key);
console.log("\nsupabase publishable key: ", urls.supabase_publishable_key);

// Exercise 6 — interface vs type decision

// For each of these, choose interface or type and write one sentence explaining your choice. Don't write code — just answer in comments:

// 1. A Book object with title, author, pages.
// interface: objects represent entities

// 2. A Result that is either { ok: true; value: number } or { ok: false; error: string }.
// types, the results can be joined through unions depending on how the user decides to show them.

// 3. A UserId that's just a number. // type, primitive alias

// 4. A User object that will be extended into Admin, Moderator, and Customer.
// interface: only interfaces implement inheritance

// A function type for a middleware (req, res, next) => void.
// type , function type

// Exercise 7 — Small real example
// Write an interface ApiSuccess<T> and ApiError and a type ApiResponse<T> exactly like Part 5, but for a Product with id, name, price. Then write a function formatResponse(res: ApiResponse<Product>): string that:

// If status === "ok", returns `Product: ${res.data.name} — $${res.data.price}`

// Otherwise, returns `Error ${res.code}: ${res.message}`

// Call it with both kinds of response. Paste the output of node exercises.js — I want to see both branches firing.

interface ApiSuccess<T> {
  status: "ok";
  data: T;
}

interface ApiError {
  status: "error";
  code: number;
  message: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

interface Product {
  readonly id: number;
  name: string;
  price: number;
}

function formatResponse(res: ApiResponse<Product>): string {
  if (res.status === "ok") {
    return `Product: ${res.data.name}  $${res.data.price}`;
  }

  return `Error ${res.code} : ${res.message}`;
}

const ok: ApiResponse<Product> = {
  status: "ok",
  data: { id: 1, name: "laptop", price: 1299 },
};

const err: ApiResponse<Product> = {
  status: "error",
  code: 404,
  message: "product not found",
};
console.log("\n");

console.log(formatResponse(ok));
console.log(formatResponse(err), "\n");

/*

□ What does "excess property checking" mean, and when does it apply? when using an interface as a type, properties that are not part of the interface are called excess property, excess property checking applies when an object has extra properties and the excess are rejected
□ When is a property readonly — and what does it prevent? a property is readonly when it is declared as read only in the interface, it prevents the property from being changes after creation

□ What's the difference between an optional property (age?: number) and a union with undefined (age: number | undefined)? (Hint: almost nothing in behavior, but there's one key difference in how object literals are checked.) optional property can be assigned or not, is undefined  if not assigned, a union with undefined (age: number | undefined) is basically the same

□ Why can't you put a union ("a" | "b") as the body of an interface directly? interface does not support union


□ What's the general rule for interface vs. type?
use interfaces for objects that represent entities, use types for aliases, unions, compositions, function types

□ What does extends do on interfaces, and what's the type equivalent? 
extend inherits the features of the parent interface, in types the equivalent is intersection


□ What's an index signature used for? index is used in interfaces when the property names are not used in advance.


□ Why does checking res.status === "ok" let you access res.data?
because only ApiSuccess has has status === "ok"
*/
