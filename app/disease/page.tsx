"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const sampleImages = [
  { label: "Corn Leaf", src: "/samples/corn.jpg" },
  { label: "Rust Spot", src: "/samples/grot.jpg" },
  { label: "Potato Early Blight", src: "/samples/Potato___Early_blight.jpg" },
  { label: "Tomato Target Spot", src: "/samples/Tomato___Target_Spot.jpg" },
];

const modelOptions = [
  { label: "ViT (Corn, Potato, Rice, Wheat)", value: "vit" },
  { label: "Keras (Apple, Blueberry, Cherry, etc.)", value: "keras" },
];

export default function DiseasePage() {
  const [modelChoice, setModelChoice] = useState(modelOptions[1].value);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{
    label: string;
    confidence?: number;
    treatment?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => previewUrl ?? sampleImages[0].src, [previewUrl]);

  const handleFileChange = (file: File | null) => {
    setSelectedImage(file);
    setResult(null);
    setError(null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSampleSelect = async (src: string) => {
    const response = await fetch(src);
    const blob = await response.blob();
    const file = new File([blob], src.split("/").pop() ?? "sample.jpg", {
      type: blob.type,
    });
    handleFileChange(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError("Please upload or select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("model", modelChoice);

      const response = await fetch("/api/disease", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image.");
      }

      const data = await response.json();
      setResult(data);
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
            Plant Disease Detector
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 md:text-4xl">
            Identify crop diseases from leaf images.
          </h1>
          <p className="max-w-2xl text-base text-emerald-900/70">
            Choose an AI model, upload a leaf image, and receive an instant
            diagnosis with a recommended treatment plan.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <label className="text-sm font-semibold text-emerald-900">
              Select Model
            </label>
            <div className="mt-3 flex flex-col gap-3">
              {modelOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                    modelChoice === option.value
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                      : "border-emerald-100 text-emerald-700 hover:border-emerald-200"
                  }`}
                >
                  <span>{option.label}</span>
                  <input
                    type="radio"
                    name="model"
                    value={option.value}
                    checked={modelChoice === option.value}
                    onChange={() => setModelChoice(option.value)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-emerald-900">
                Upload Leaf Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                className="mt-3 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-700 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
              />
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-emerald-900">Try samples</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {sampleImages.map((sample) => (
                  <button
                    key={sample.src}
                    type="button"
                    onClick={() => handleSampleSelect(sample.src)}
                    className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-left text-xs font-semibold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-950">Results</h2>
            <div className="mt-4 space-y-4">
              <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50">
                <Image
                  src={preview}
                  alt="Selected leaf preview"
                  fill
                  className="object-cover"
                />
              </div>

              {!result && !error && (
                <p className="text-sm text-emerald-900/70">
                  Upload an image to get the diagnosis and treatment.
                </p>
              )}
              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              {result && (
                <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                  <div>
                    <p className="text-xs uppercase text-emerald-600">Prediction</p>
                    <p className="text-base font-semibold text-emerald-950">
                      {result.label}
                    </p>
                  </div>
                  {typeof result.confidence === "number" && (
                    <div>
                      <p className="text-xs uppercase text-emerald-600">Confidence</p>
                      <p className="font-semibold text-emerald-950">
                        {(result.confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                  )}
                  {result.treatment && (
                    <div>
                      <p className="text-xs uppercase text-emerald-600">Treatment</p>
                      <p className="text-emerald-900/80">{result.treatment}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
