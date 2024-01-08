import { Optimization } from "../src/experiments/optimization";
// import { User } from "../src/experiments/define";

describe("experiments", () => {
  const users = [
    { name: "Cus A" },
    { name: "Cus B" },
    { name: "Cus C" },
    { name: "Cus D" },
    { name: "Cus E" },
    { name: "Cus F" },
    { name: "Cus G" },
  ];
  const K = [
    [
      { v: 60, w: 10 },
      { v: 100, w: 20 },
      { v: 120, w: 30 },
    ],
    [
      { v: 60, w: 10 },
      { v: 100, w: 20 },
      { v: 120, w: 30 },
    ],
    [
      { v: 60, w: 10 },
      { v: 100, w: 20 },
      { v: 120, w: 30 },
    ],
    [
      { v: 60, w: 10 },
      { v: 100, w: 20 },
      { v: 120, w: 30 },
    ],
    [
      { v: 60, w: 10 },
      { v: 100, w: 20 },
      { v: 120, w: 30 },
    ],
    [
      { v: 60, w: 10 },
      { v: 100, w: 20 },
      { v: 120, w: 30 },
    ],
    [
      { v: 60, w: 10 },
      { v: 100, w: 20 },
      { v: 120, w: 30 },
    ],
  ];

  test("Optimization", () => {
    let optimization = new Optimization();
    const sample = optimization.onlineMCKP(users, K, 80);
    console.log(sample);

    // expect(greeter.greeting).toBe("world");
  });
});
