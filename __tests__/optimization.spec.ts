import { Optimization } from "../src/experiments/optimization";

describe("experiments", () => {
  test("Optimization", () => {
    let greeter = new Optimization("world");
    expect(greeter.greeting).toBe("world");
  });
});
