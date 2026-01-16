"use client";

import { useState } from "react";

const varietyOptions = [
  { label: "Aman Rice", value: "Aman Rice" },
  {
    label: "BR 11, BR 22, BR 23, BRRI dhan40-80, Binadhan-4 to 20",
    value:
      "BR 11, BR 22, BR 23, BRRI dhan40, BRRI dhan41, BRRI dhan44, BRRI dhan46, BRRI dhan49,\nBRRI dhan51, BRRI dhan52, BRRI dhan53, BRRI dhan54, BRRI dhan56, BRRI dhan62,\nBRRI dhan66, BRRI dhan70, BRRI dhan71, BRRI dhan72, BRRI dhan73, BRRI dhan75\nBRRI dhan76, BRRI dhan78, BRRI dhan79, BRRI dhan80, BRRI hybrid dhan4, BRRI hybrid dhan6\nand Binadhan-4, Binadhan-7, Binadhan-11, Binadhan-12, Binadhan-15, Binadhan-16, Binadhan-17, Binadhan-20",
  },
  {
    label: "BR25, BRRI dhan33-39, dhan56-57, Binadhan-12/13",
    value:
      "BR25, BRRI dhan33, BRRI dhan34, BRRI dhan37, BRRI dhan38,\nBRRI dhan39, BRRI dhan56, BRRI dhan57 and Binadhan-12, Binadhan-13",
  },
  {
    label: "BR5, Binadhan-9, Kataribhog, Kalijira, Chinigura",
    value: "BR5, Binadhan-9; LIV: Kataribhog, Kalijira, Chinigura etc",
  },
];

export default function FertilizerPage() {
  const [soilValues, setSoilValues] = useState({
    soilN: "",
    soilP: "",
    soilK: "",
    soilS: "",
    soilZn: "",
    soilB: "",
  });
  const [variety, setVariety] = useState(varietyOptions[0].value);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof typeof soilValues, value: string) => {
    setSoilValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        variety,
        soilN: soilValues.soilN === "" ? null : Number(soilValues.soilN),
        soilP: soilValues.soilP === "" ? null : Number(soilValues.soilP),
        soilK: soilValues.soilK === "" ? null : Number(soilValues.soilK),
        soilS: soilValues.soilS === "" ? null : Number(soilValues.soilS),
        soilZn: soilValues.soilZn === "" ? null : Number(soilValues.soilZn),
        soilB: soilValues.soilB === "" ? null : Number(soilValues.soilB),
      };

      const response = await fetch("/api/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate fertilizer recommendations.");
      }

      const data = await response.json();
      setResult(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-emerald-50/50">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-12">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Fertilizer Recommendation System
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 md:text-4xl">
            Calculate nutrient requirements with precision.
          </h1>
          <p className="max-w-2xl text-base text-emerald-900/70">
            Provide soil test values (leave blank if unknown) and select the rice
            variety to get STVI classification, nutrient dosage, and fertilizer
            product equivalents.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                { key: "soilN", label: "Nitrogen (%)" },
                { key: "soilP", label: "Phosphorus (µg/g, Olsen)" },
                { key: "soilK", label: "Potassium (meq/100g)" },
                { key: "soilS", label: "Sulfur (µg/g)" },
                { key: "soilZn", label: "Zinc (µg/g)" },
                { key: "soilB", label: "Boron (µg/g)" },
              ].map((field) => (
                <label key={field.key} className="flex flex-col gap-2 text-sm">
                  <span className="font-semibold text-emerald-900">
                    {field.label}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={soilValues[field.key as keyof typeof soilValues]}
                    onChange={(event) =>
                      handleChange(
                        field.key as keyof typeof soilValues,
                        event.target.value
                      )
                    }
                    className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Leave blank if unknown"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-emerald-900">
                  Select Rice Variety
                </span>
                <select
                  value={variety}
                  onChange={(event) => setVariety(event.target.value)}
                  className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  {varietyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate Fertilizer Requirements"}
            </button>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-950">Results</h2>
            <div className="mt-4 space-y-4 text-sm text-emerald-900/80">
              {!result && !error && (
                <p>
                  Results will appear here once the calculation is complete.
                </p>
              )}
              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {error}
                </p>
              )}
              {result && (
                <pre className="whitespace-pre-wrap rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-900">
{result}
                </pre>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
