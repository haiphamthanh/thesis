import { Item, ItemWeight, User } from "./define";

// https://chat.openai.com/share/9be52647-715b-471d-a447-fa7f41d6da07
export class FindingDominatedItems {
  // Find dominant items
  public findDominantItems(items: Item[]) {
    const dominantItems = [];

    for (let i = 0; i < items.length; i++) {
      let isDominant = true;

      for (let j = 0; j < items.length; j++) {
        if (i !== j) {
          if (
            this.isDominated(items[j], items[i]) ||
            this.isLPDominated(items[j], items[i], items[j])
          ) {
            isDominant = false;
            break;
          }
        }
      }

      if (isDominant) {
        dominantItems.push(items[i]);
      }
    }

    return dominantItems;
  }

  // Function to check dominance
  private isDominated(a: Item, b: Item) {
    return a.weight <= b.weight && a.value > b.value;
  }

  // Function to check LP-dominance
  private isLPDominated(a: Item, b: Item, c: Item) {
    return (
      a.weight <= b.weight &&
      b.weight <= c.weight &&
      a.value > b.value &&
      b.value > c.value
    );
  }
}
