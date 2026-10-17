function greet(name: string): string {
  return `hello , ${name}`;
}

console.log(greet("Jerry"));
console.log("Day 1");
// type annotation syntax
// let age: number = 30;
// let name: string = "Alice";
// let isActive: boolean = true;

// console.log(`Age: ${age}`);
// console.log(`Name: ${name}`);
// console.log(`isActive: ${isActive}`);

// void and never
// void = a function returns nothing
// function log(message: string): void {
//   console.log(message);
// }

// Never = a function never returns, it throws or loops forever

// function fail(message: string): never {
//   throw new Error(message);
// }

// Arrays and tuples
// Array - one type, any length

// let numbers: number[] = [20, 13, 33, 21, 54];
// let names: Array<string> = ["John", "Felix", "Jerry"];
// let score: Array<number> = [94, 45, 65, 84];
// let course: string[] = ["Computer science", "business management"];

// Tuples - fixed length, fixed types, in order

// let point: [number, number, number] = [10, 20, 30];
// let students: [string, string, string] = ["John", "Mark", "Atuti"];

// tuples are useful for returning multiple values with different types

// function minMax(nums: number[]): [number, number] {
//   return [Math.min(...nums), Math.max(...nums)];
// }

// const [min, max] = minMax([210, 30, 34, 342]);

// with strict:true, null and undefined are not assignable to other types
// let student1:string = null // error under strict mode

// let newName: string | null = null;

//  Putting It Together — Small Example

// type userId = number;
// function formatScore(score: number | null): string {
//   if (score === null) {
//     return "no score yet";
//   }

//   return `Score: ${score.toFixed(1)}`;
// }

// console.log(formatScore(9.4));
// console.log(formatScore(null));
