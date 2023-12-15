import _ from "lodash";

type ItemWeight = {
  readonly θ: number;
  readonly w: number;
  readonly i: number;
  readonly d: number;
};

type User = {
  readonly name: string;
};

export class Optimization {
  // constructor() {}

  /**
   *  Input:
   * • Customer set 𝑈
   * • Item sets 𝐾𝑖
   * • Knapsack capacity C
   */
  public onlineMCKP(U: User[], K: { v: number; w: number }[][], C: number) {
    // const U = [];
    // const K: { v: number; w: number }[][] = [];
    // let C = 1000;

    // Definations
    const P: ItemWeight[] = []; // 𝑃 ← ∅
    const _U_ = U.length; // |𝑈| number of user
    const picked_d: { d: number; i: number }[] = [];

    // Process
    for (let i = 0; i < _U_; i++) {
      // 𝐷𝑖 ← dominant items of 𝐾𝑖 sorted by increasing weight
      const Di: { v: number; w: number }[] = K[i].sort((a, b) => a.w - b.w);
      const v: number[] = Di.map((x) => x.v);
      const w: number[] = Di.map((x) => x.w);

      for (let d = 0; d < Di.length; d++) {
        // Compute incremental values and weights (𝑣𝑖𝑑,𝑤𝑖𝑑 )
        const incremental = this.computeIncremental(v, w, d);
        let v_id = incremental.v_id;
        let w_id = incremental.w_id;

        // Compute efficiency angle 𝜃𝑖𝑑 :
        const θ_id = this.computeEfficiencyAngle(v_id, w_id);

        // 𝑃 ← 𝑃 ∪ (𝜃𝑖𝑑,𝑤𝑖𝑑 )
        P.push({ θ: θ_id, w: w_id, i, d });
      }

      // Get updated efficiency threshold 𝜃∗:
      const θ_ = this.algorithrm1(P, C, i, _U_);

      // Find dominant item 𝑑∗:
      const d_ = this.findDominantItem(i, P, θ_);

      // Update capacity:
      C = C - w[d_];

      // Pick item 𝑑∗
      picked_d.push({ d: d_, i });
    }

    return picked_d;
  }

  // =======================> <All sub functions> <=======================

  // Get updated efficiency threshold 𝜃∗:
  // 𝜃∗ ← A𝑙𝑔𝑜𝑟𝑖𝑡ℎ𝑚1 (𝑃,𝐶,𝑖, |𝑈 |)
  private algorithrm1(
    _P: ItemWeight[],
    C: number,
    i: number,
    _U_: number
  ): number {
    const P = _P.sort((f, s) => f.θ - s.θ);
    const _P_ = P.length;

    const fθ_list: { θ: number; fθp: number }[] = [];
    for (let p = 0; p < _P_; p++) {
      const θ = P[p].θ;
      fθ_list.push({
        θ,
        fθp: this.computeEfficiencyAngleThreshold(P, p, _P_),
      });
    }

    return this.findEfficiencyAngleThreshold(i, fθ_list, _P_, _U_, C);
  }

  // Compute incremental values and weights (𝑣𝑖𝑑,𝑤𝑖𝑑 )
  private computeIncremental(
    v: number[],
    w: number[],
    d: number
  ): { w_id: number; v_id: number } {
    if (d === 0) {
      return {
        w_id: w[0],
        v_id: v[0],
      };
    }

    return {
      w_id: w[d] - w[d - 1],
      v_id: v[d] - v[d - 1],
    };
  }

  // Compute efficiency angle 𝜃𝑖𝑑 :
  private computeEfficiencyAngle(v_id: number, w_id: number): number {
    if (v_id === 0 && w_id === 0) {
      return (3 * Math.PI) / 2;
    } else if (v_id < 0 && w_id <= 0) {
      return 2 * Math.PI + Math.atan2(v_id, w_id);
    }

    return Math.atan2(v_id, w_id);
  }

  // Find dominant item 𝑑∗:
  private findDominantItem(i: number, P: ItemWeight[], θ_: number): number {
    // 𝑑∗ ← argmin𝑑 ∈𝐷𝑖{ 𝜃𝑖𝑑 | 𝜃𝑖𝑑 ≥ 𝜃∗}
    const _P = P.filter((x) => x.i === i && x.θ >= θ_);
    if (_P.length === 0) {
      return -1;
    }

    let min = _P[0];

    _P.forEach((p) => {
      if (p.θ < min.θ) {
        min = p;
      }
    });

    return min.d;
  }

  // Compute Efficiency Threshold
  private computeEfficiencyAngleThreshold(
    P: ItemWeight[],
    p: number,
    _P_: number
  ): number {
    if (p === 0) {
      return P[p].w / _P_;
    }

    return P[p - 1].w + P[p - 1].w / _P_;
    // const fθp = p === 0 ? P[p].w / _P_ : P[p - 1].w + P[p - 1].w / _P_;
  }

  // Find Efficiency Threshold
  private findEfficiencyAngleThreshold(
    i: number,
    fθ_list: { θ: number; fθp: number }[],
    _P_: number,
    _U_: number,
    C: number
  ): number {
    const _fθ_list = fθ_list.filter(
      (item) => item.fθp <= C / ((_P_ / i) * (_U_ - i + 1))
    );
    if (_fθ_list.length === 0) {
      return -1;
    }

    let min = _fθ_list[0];

    _fθ_list.forEach((fθp) => {
      if (fθp < min) {
        min = fθp;
      }
    });

    return min.θ;
  }
}
