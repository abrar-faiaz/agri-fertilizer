import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Agri udyod • Smart Agriculture Suite
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-emerald-950 md:text-5xl">
              Make agronomy decisions faster with AI-powered insights.
            </h1>
            <p className="text-lg text-emerald-900/80">
              Diagnose plant diseases, estimate crop yield, and generate fertilizer
              recommendations—all in one professional dashboard built for modern
              agricultural teams.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/fertilizer"
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Fertilizer Recommendation
              </Link>
              <Link
                href="/disease"
                className="rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Plant Disease Detector
              </Link>
              <Link
                href="/yield"
                className="rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Yield Prediction
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-emerald-900">Feature Overview</h2>
            <div className="mt-6 space-y-5 text-sm text-emerald-900/80">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="font-semibold text-emerald-900">Fertilizer System</p>
                <p>
                  Convert soil test results into nutrient dosage and product
                  requirements tailored to rice varieties.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="font-semibold text-emerald-900">Disease Detection</p>
                <p>
                  Upload a leaf image and receive a diagnosis with a treatment
                  recommendation.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="font-semibold text-emerald-900">Yield Prediction</p>
                <p>
                  Estimate crop yield using soil, weather, and management
                  inputs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Fertilizer Recommendation System",
              description:
                "Calculate nutrient requirements, STVI class, and fertilizer product quantities.",
              href: "/fertilizer",
            },
            {
              title: "Plant Disease Detector",
              description:
                "Use image-based AI models to identify crop diseases and get treatments.",
              href: "/disease",
            },
            {
              title: "Yield Prediction System",
              description:
                "Predict yield per hectare with key agronomic parameters.",
              href: "/yield",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-emerald-950">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-emerald-900/70">
                {card.description}
              </p>
              <span className="mt-4 inline-flex text-sm font-semibold text-emerald-700 group-hover:text-emerald-900">
                Open →
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
