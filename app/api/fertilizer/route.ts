import { NextResponse } from "next/server";

export const runtime = "nodejs";

type STVIClass = "Very Low" | "Low" | "Medium" | "Optimum" | "High" | "Very High";

const STVI_THRESHOLDS: Record<string, Record<STVIClass, number[]>> = {
  N: {
    "Very Low": [0.0, 0.09],
    Low: [0.091, 0.18],
    Medium: [0.181, 0.27],
    Optimum: [0.271, 0.36],
    High: [0.361, 0.45],
    "Very High": [0.451, 999.999],
  },
  P: {
    "Very Low": [0.0, 6.0],
    Low: [6.1, 12.0],
    Medium: [12.1, 18.0],
    Optimum: [18.1, 24.0],
    High: [24.1, 30.0],
    "Very High": [30.1, 999.999],
  },
  K: {
    "Very Low": [0.0, 0.075],
    Low: [0.076, 0.15],
    Medium: [0.151, 0.225],
    Optimum: [0.226, 0.3],
    High: [0.31, 0.375],
    "Very High": [0.376, 999.999],
  },
  S: {
    "Very Low": [0.0, 9.0],
    Low: [9.1, 18.0],
    Medium: [18.1, 27.0],
    Optimum: [27.1, 36.0],
    High: [36.1, 45.0],
    "Very High": [45.1, 999.999],
  },
  Zn: {
    "Very Low": [0.0, 0.45],
    Low: [0.451, 0.9],
    Medium: [0.91, 1.35],
    Optimum: [1.351, 1.8],
    High: [1.81, 2.25],
    "Very High": [2.251, 999.999],
  },
  B: {
    "Very Low": [0.0, 0.15],
    Low: [0.151, 0.3],
    Medium: [0.31, 0.45],
    Optimum: [0.451, 0.6],
    High: [0.61, 0.75],
    "Very High": [0.751, 999.999],
  },
};

const amanRice = {
  N: {
    Optimum: [0, 12],
    Medium: [13, 24],
    Low: [25, 36],
    "Very Low": [37, 48],
    High: [0, 0],
    "Very High": [0, 0],
  },
  P: {
    Optimum: [0, 3],
    Medium: [4, 6],
    Low: [7, 9],
    "Very Low": [10, 12],
    High: [0, 0],
    "Very High": [0, 0],
  },
  K: {
    Optimum: [0, 10],
    Medium: [11, 20],
    Low: [21, 30],
    "Very Low": [31, 40],
    High: [0, 0],
    "Very High": [0, 0],
  },
  S: {
    Optimum: [0, 2],
    Medium: [3, 4],
    Low: [5, 6],
    "Very Low": [7, 8],
    High: [0, 0],
    "Very High": [0, 0],
  },
  Zn: {
    Optimum: [0, 0],
    Medium: [0, 0.5],
    Low: [0.6, 1.0],
    "Very Low": [1.1, 1.5],
    High: [0, 0],
    "Very High": [0, 0],
  },
  B: {
    Optimum: [0, 0],
    Medium: [0, 0.5],
    Low: [0.6, 1.0],
    "Very Low": [1.1, 1.5],
    High: [0, 0],
    "Very High": [0, 0],
  },
};

const bigList5 = {
  N: {
    Optimum: [0, 30],
    Medium: [31, 60],
    Low: [61, 90],
    "Very Low": [91, 120],
    High: [0, 0],
    "Very High": [0, 0],
  },
  P: {
    Optimum: [0, 5],
    Medium: [6, 10],
    Low: [11, 15],
    "Very Low": [16, 20],
    High: [0, 0],
    "Very High": [0, 0],
  },
  K: {
    Optimum: [0, 25],
    Medium: [26, 50],
    Low: [51, 75],
    "Very Low": [76, 100],
    High: [0, 0],
    "Very High": [0, 0],
  },
  S: {
    Optimum: [0, 4],
    Medium: [5, 8],
    Low: [9, 12],
    "Very Low": [13, 16],
    High: [0, 0],
    "Very High": [0, 0],
  },
  Zn: {
    Optimum: [0, 0],
    Medium: [0, 0.8],
    Low: [0.9, 1.6],
    "Very Low": [1.7, 2.4],
    High: [0, 0],
    "Very High": [0, 0],
  },
  B: {
    Optimum: [0, 0],
    Medium: [0, 0.8],
    Low: [0.9, 1.6],
    "Very Low": [1.7, 2.4],
    High: [0, 0],
    "Very High": [0, 0],
  },
};

const bigList4 = {
  N: {
    Optimum: [0, 24],
    Medium: [25, 48],
    Low: [49, 72],
    "Very Low": [73, 96],
    High: [0, 0],
    "Very High": [0, 0],
  },
  P: {
    Optimum: [0, 4],
    Medium: [5, 8],
    Low: [9, 12],
    "Very Low": [13, 16],
    High: [0, 0],
    "Very High": [0, 0],
  },
  K: {
    Optimum: [0, 20],
    Medium: [21, 40],
    Low: [41, 60],
    "Very Low": [61, 80],
    High: [0, 0],
    "Very High": [0, 0],
  },
  S: {
    Optimum: [0, 3],
    Medium: [4, 6],
    Low: [7, 9],
    "Very Low": [10, 12],
    High: [0, 0],
    "Very High": [0, 0],
  },
  Zn: {
    Optimum: [0, 0],
    Medium: [0, 0.7],
    Low: [0.8, 1.4],
    "Very Low": [1.5, 2.1],
    High: [0, 0],
    "Very High": [0, 0],
  },
  B: {
    Optimum: [0, 0],
    Medium: [0, 0.7],
    Low: [0.8, 1.4],
    "Very Low": [1.5, 2.1],
    High: [0, 0],
    "Very High": [0, 0],
  },
};

const bigList3 = {
  N: {
    Optimum: [0, 18],
    Medium: [19, 36],
    Low: [37, 54],
    "Very Low": [55, 72],
    High: [0, 0],
    "Very High": [0, 0],
  },
  P: {
    Optimum: [0, 3],
    Medium: [4, 6],
    Low: [7, 9],
    "Very Low": [10, 12],
    High: [0, 0],
    "Very High": [0, 0],
  },
  K: {
    Optimum: [0, 15],
    Medium: [16, 30],
    Low: [31, 45],
    "Very Low": [46, 60],
    High: [0, 0],
    "Very High": [0, 0],
  },
  S: {
    Optimum: [0, 3],
    Medium: [4, 6],
    Low: [7, 9],
    "Very Low": [10, 12],
    High: [0, 0],
    "Very High": [0, 0],
  },
  Zn: {
    Optimum: [0, 0],
    Medium: [0, 0.6],
    Low: [0.7, 1.2],
    "Very Low": [1.3, 1.8],
    High: [0, 0],
    "Very High": [0, 0],
  },
  B: {
    Optimum: [0, 0],
    Medium: [0, 0.6],
    Low: [0.7, 1.2],
    "Very Low": [1.3, 1.8],
    High: [0, 0],
    "Very High": [0, 0],
  },
};

const VARIETY_OPTIONS: Record<string, Record<string, Record<string, number[]>>> = {
  "Aman Rice": amanRice,
  "BR 11, BR 22, BR 23, BRRI dhan40, BRRI dhan41, BRRI dhan44, BRRI dhan46, BRRI dhan49,\nBRRI dhan51, BRRI dhan52, BRRI dhan53, BRRI dhan54, BRRI dhan56, BRRI dhan62,\nBRRI dhan66, BRRI dhan70, BRRI dhan71, BRRI dhan72, BRRI dhan73, BRRI dhan75\nBRRI dhan76, BRRI dhan78, BRRI dhan79, BRRI dhan80, BRRI hybrid dhan4, BRRI hybrid dhan6\nand Binadhan-4, Binadhan-7, Binadhan-11, Binadhan-12, Binadhan-15, Binadhan-16, Binadhan-17, Binadhan-20":
    bigList5,
  "BR25, BRRI dhan33, BRRI dhan34, BRRI dhan37, BRRI dhan38,\nBRRI dhan39, BRRI dhan56, BRRI dhan57 and Binadhan-12, Binadhan-13": bigList4,
  "BR5, Binadhan-9; LIV: Kataribhog, Kalijira, Chinigura etc": bigList3,
};

const FERTILIZER_CONVERSION: Record<
  string,
  { product: string; ratio: number }
> = {
  N: { product: "Urea", ratio: 2.17 },
  P: { product: "TSP", ratio: 5.0 },
  K: { product: "MoP", ratio: 2.0 },
  S: { product: "Gypsum", ratio: 5.55 },
  Zn: { product: "Zinc sulphate (heptahydrate)", ratio: 4.75 },
  B: { product: "Boric acid", ratio: 5.88 },
};

const classifySoilTest = (nutrient: keyof typeof STVI_THRESHOLDS, value: number): STVIClass | null => {
  const thresholds = STVI_THRESHOLDS[nutrient];
  for (const [stviClass, bounds] of Object.entries(thresholds)) {
    const [lo, hi] = bounds;
    if (value >= lo && value <= hi) {
      return stviClass as STVIClass;
    }
  }
  return null;
};

const calculateFr = (Uf: number, Ci: number, Cs: number, St: number, Ls: number) => {
  if (Cs === 0) {
    return Uf;
  }
  return Uf - (Ci / Cs) * (St - Ls);
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      soilN,
      soilP,
      soilK,
      soilS,
      soilZn,
      soilB,
      variety,
    } = body;

    if (!variety || !(variety in VARIETY_OPTIONS)) {
      return NextResponse.json(
        { error: "Invalid variety selection." },
        { status: 400 }
      );
    }

    const recDict = VARIETY_OPTIONS[variety];
    const results: string[] = [];

    const processNutrient = (nutrient: keyof typeof STVI_THRESHOLDS, value: number | null) => {
      if (value === null || Number.isNaN(value)) {
        return;
      }

      const stviClass = classifySoilTest(nutrient, value);
      if (!stviClass) {
        results.push(
          `${nutrient}: Soil test value ${value} out of range or no data.`
        );
        return;
      }

      if (!recDict[nutrient]) {
        results.push(`${nutrient}: No recommendation data for ${variety}.`);
        return;
      }

      const range = recDict[nutrient][stviClass];
      if (!range) {
        results.push(
          `${nutrient}: No recommended range for STVI class '${stviClass}'.`
        );
        return;
      }

      const [rangeLo, rangeHi] = range;
      const Uf = rangeHi;
      const Ci = rangeHi - rangeLo;
      const [classLo, classHi] = STVI_THRESHOLDS[nutrient][stviClass];
      const Ls = classLo;
      const Cs = classHi - classLo;
      const St = value;

      let Fr = calculateFr(Uf, Ci, Cs, St, Ls);
      Fr = Math.max(0, Fr);

      const fert = FERTILIZER_CONVERSION[nutrient];
      if (fert) {
        const fertAmount = Fr * fert.ratio;
        results.push(
          `${nutrient} - STVI: ${stviClass} | Recommended Nutrient = ${Fr.toFixed(
            2
          )} kg/ha | ${fert.product} needed ≈ ${fertAmount.toFixed(2)} kg/ha`
        );
      } else {
        results.push(
          `${nutrient} - STVI: ${stviClass} | Recommended Nutrient = ${Fr.toFixed(
            2
          )} kg/ha | No fertilizer product data.`
        );
      }
    };

    processNutrient("N", soilN);
    processNutrient("P", soilP);
    processNutrient("K", soilK);
    processNutrient("S", soilS);
    processNutrient("Zn", soilZn);
    processNutrient("B", soilB);

    if (!results.length) {
      return NextResponse.json({ results: "No valid nutrient inputs given." });
    }

    return NextResponse.json({ results: results.join("\n") });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process fertilizer calculation." },
      { status: 500 }
    );
  }
}
