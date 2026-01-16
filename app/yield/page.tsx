"use client";

import { useState } from "react";

const soilTypes = ["Sandy", "Clay", "Loam", "Silt", "Peaty", "Chalky"];
const crops = ["Cotton", "Rice", "Barley", "Soybean", "Wheat", "Maize"];

export default function YieldPage() {
  const [soilType, setSoilType] = useState(soilTypes[0]);
  const [crop, setCrop] = useState(crops[0]);
  const [rainfall, setRainfall] = useState("897.077239");
  const [temperature, setTemperature] = useState("27.676966");
  const [fertilizerUsed, setFertilizerUsed] = useState("false");
  const [irrigationUsed, setIrrigationUsed] = useState("true");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        Soil_Type: soilType,
        Crop: crop,
        Rainfall_mm: Number(rainfall),
        Temperature_Celsius: Number(temperature),
        Fertilizer_Used: fertilizerUsed === "true",
        Irrigation_Used: irrigationUsed === "true",
      };

      const response = await fetch("/api/yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate yield prediction.");
      }

      const data = await response.json();
      setResult(data.prediction);
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
            Yield Prediction System
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 md:text-4xl">
            Forecast crop yield with data-driven intelligence.
          </h1>
          <p className="max-w-2xl text-base text-emerald-900/70">
            Fill in the agronomic conditions below to estimate predicted yield
            (tons per hectare).
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-emerald-900">Soil Type</span>
                <select
                  value={soilType}
                  onChange={(event) => setSoilType(event.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  {soilTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-emerald-900">Type of Crop</span>
                <select
                  value={crop}
                  onChange={(event) => setCrop(event.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  {crops.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-emerald-900">
                  Average Rainfall (mm)
                </span>
                <input
                  type="number"
                  step="any"
                  value={rainfall}
                  onChange={(event) => setRainfall(event.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-emerald-900">
                  Average Temperature (°C)
                </span>
                <input
                  type="number"
                  step="any"
                  value={temperature}
                  onChange={(event) => setTemperature(event.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-emerald-900">
                  Fertilizer Used
                </span>
                <select
                  value={fertilizerUsed}
                  onChange={(event) => setFertilizerUsed(event.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-emerald-900">
                  Irrigation Used
                </span>
                <select
                  value={irrigationUsed}
                  onChange={(event) => setIrrigationUsed(event.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict Yield"}
            </button>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-950">Prediction</h2>
            <div className="mt-4 space-y-4 text-sm text-emerald-900/80">
              {!result && !error && (
                <p>Prediction will appear here once completed.</p>
              )}
              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {error}
                </p>
              )}
              {result && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                  <p className="text-xs uppercase text-emerald-600">Result</p>
                  <p className="text-2xl font-semibold text-emerald-950">
                    {result}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
