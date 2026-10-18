function multiply(a: number, b: number): number {
  return a * b;
}

// console.log(multiply(12, 23));

// Copy this broken code and fix every error without removing type annotations:

// let username: string = 42; // assigning a number to a string
let username: string = "Jeremy";
// let isReady: boolean = "yes"; // assigning a string to a boolean
let isReady: boolean = true;
function double(n: number) {
  return n * 2;
}
//double("5"); // giving a string parameter to where a number is expected
// double(3);
let choice: string = "yes"; //type annotation
let age: number = 32; //type annotation
let device = "laptop"; // TS infer
let usernames = "Administrator"; // TS infer

// ARRAYS AND TUPLES
// Write a function sum(nums: number[]): number that adds all numbers.

function addAll(numbers: number[]): number {
  let sum = 0;
  numbers.forEach((num) => {
    sum += num;
  });
  return sum;
}

// Write a function splitName(full: string): [string, string] that returns [firstName, lastName].

function splitName(full: string): [string, string] {
  const parts = full.trim().split(" ");
  const first = parts[0];
  const last = parts.slice(1).join(" ");
  return [first, last];
}

function describe(value: unknown): string {
  if (typeof value === "string") {
    return "a string";
  }
  if (typeof value === "number") {
    return "a number";
  } else {
    return "something else";
  }
}

function assertNever(value: never): never {
  throw new Error("unexpected value");
}
