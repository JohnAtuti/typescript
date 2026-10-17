interface User {
  name?: string;
  email?: string;
  readonly password?: string;
  age?: number;
}

function printUser(user: User): string {
  return `${user.name}\n${user.email}`;
}

function signup(user: User): string {
  return `username: ${user.name}\nEmail: ${user.email}\nPassword: ${user.password}`;
}

// console.log(signup({ email: "jerry@gmail.com", password: "Jeremy Rider" }));

// console.log("\n", printUser({ name: "Janet", email: "janet@gmail.com" }));

const alice: User = {
  name: "Alice",
  email: "alice@gmail.com",
  age: 32,
};

interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  readonly employeeID: number;
  role: string;
}

const employee: Employee = {
  name: "Alice",
  age: 30,
  employeeID: 2349304,
  role: "Accountant",
};

// console.log("Age: ", employee.age);
// console.log(`Name: ${employee.name}`);
// console.log("Role: ", employee.role);

// Index signatures — for dynamic keys
// Sometimes you don't know the property names in advance:
interface StringMap {
  [key: string]: string;
}

const env: StringMap = {
  NODE_ENV: "production",
  API_URL: "https://username.me.com",
};

type UserId = number;
type Status = "active" | "Inactive" | "banned"; //literal union
type Point = { x: number; y: number }; //composed object shapes
type Callback = (err: Error | null, data: string) => void;
type Users = User[];

type Timestamp = {
  createdAt: Date;
  updatedAt: Date;
};

type Userrs = { name: string; email: string } & Timestamp;

const u: Userrs = {
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// console.log("createdAt: ", u.createdAt);
// console.log("updatedAt: ", u.updatedAt);

// Putting It Together — A Realistic API Response

interface APISucess<T> {
  status: "OK";
  data: T;
}

interface APIError {
  status: "Error";
  code: number;
  message: string;
}

type APIResponse<T> = APISucess<T> | APIError;

interface User1 {
  readonly id: number;
  name: string;
  email: string;
}

function handleResponse(res: APIResponse<User1>): string {
  if (res.status === "OK") {
    return `Hello, ${res.data.name}`;
  }

  return `Error ${res.code}:${res.message}`;
}
