import { FindingDominatedItems } from "../src/experiments/findingDominatedItems";
// import { User } from "../src/experiments/define";

describe("experiments", () => {
  // Define the items as an array of objects with weights and values
  const items = [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 1, value: 1 },
    { weight: 4, value: 5 },
    { weight: 2, value: 2 },
  ];

  test("Optimization", () => {
    let findDominantItem = new FindingDominatedItems();
    const sample = findDominantItem.findDominantItems(items);
    console.log(sample);

    // expect(greeter.greeting).toBe("world");
  });
});
