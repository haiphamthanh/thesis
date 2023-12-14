import _ from "lodash";

type PStruct = {
  readonly θ: number; // θ
  readonly w: number;
  readonly i: number;
  readonly d: number;
};

export class Optimization {
  constructor(message: string) {}

  /**
   *  Input:
   * • Customer set 𝑈
   * • Item sets 𝐾𝑖
   * • Knapsack capacity C
   */
  public onlineMCKP() {
    // TODO: Confirm U K w v C P
    const U = [];
    const K: { w: number }[] = [];
    const w: number[][] = [];
    const v: number[][] = [];
    let C = 1000;

    // Definations
    const P: PStruct[] = []; // 𝑃 ← ∅
    const userNumber = U.length; // |𝑈|
    const picked_d: { d: number; i: number }[] = [];

    // Process
    for (let i = 0; i < userNumber; i++) {
      // TODO
      // 𝐷𝑖 ← dominant items of 𝐾𝑖 sorted by increasing weight
      const Di: number[] = [];

      for (let d = 0; d < Di.length; d++) {
        // Compute incremental values and weights (𝑣𝑖𝑑,𝑤𝑖𝑑 )
        let v_id = v[i][d];
        let w_id = w[i][d];

        if (d === 0) {
          v_id = v[i][0];
          w_id = w[i][0];
        } else {
          v_id = v[i][d] - v[i][d - 1];
          w_id = w[i][d] - w[i][d - 1];
        }

        // Compute efficiency angle 𝜃𝑖𝑑 :
        let θ_id = -1;

        if (v_id === 0 && w_id === 0) {
          θ_id = (3 * Math.PI) / 2;
        } else if (v_id < 0 && w_id <= 0) {
          θ_id = 2 * Math.PI + Math.atan2(v_id, w_id);
        } else {
          θ_id = Math.atan2(v_id, w_id);
        }

        P.push({ θ: θ_id, w: w_id, i, d });
      }

      // Get updated efficiency threshold 𝜃∗:
      // 𝜃∗ ← A𝑙𝑔𝑜𝑟𝑖𝑡ℎ𝑚1 (𝑃,𝐶,𝑖, |𝑈 |)
      const a_ = this.algorithrm1(P, C, i, nU);

      // Find dominant item 𝑑∗:
      // 𝑑∗ ← argmin𝑑 ∈𝐷𝑖{ 𝜃𝑖𝑑 | 𝜃𝑖𝑑 ≥ 𝜃∗}
      const d_ = this.findArgMinMax(Di, a_).argMin;

      // Update capacity:
      C = C - w[i][d_];

      // Pick item 𝑑∗
      picked_d.push({ d: d_, i });
    }

    return picked_d;
  }

  private algorithrm1(
    past_P: PStruct[],
    C: number,
    i: number,
    nU: number
  ): number {
    const P = past_P.sort((f, s) => f.a - s.a);
    const nP = P.length;

    const listF: number[] = [];
    for (let p = 0; p < nP; p++) {
      listF.push(this.getF(p, P));
    }

    const filterd = listF.filter((x) => x <= C / ((nP / i) * (nU - i + 1)));
    return _.min(filterd) ?? -1;
  }

  private getF(i: number, P: PStruct[]): number {
    if (i === 0) {
      return P[0].w / P.length;
    }

    return this.getF(i - 1, P) + P[i].w / P.length;
  }

  private findArgMinMax(
    array: number[],
    threshold: number
  ): { argMin: number; argMax: number } {
    const argFact =
      (compareFn: { (min: any, el: any): any; (max: any, el: any): any }) =>
      (array: any[]) =>
        array.map((el, idx) => [el, idx]).reduce(compareFn);
    const argMax = argFact((min, el) => (el[0] > min[0] ? el : min));
    const argMin = argFact((max, el) => (el[0] < max[0] ? el : max));

    return {
      argMin: argMin(array).filter((x) => x > threshold)[0] ?? -1,
      argMax: argMin(array)[0],
    };
  }
}
