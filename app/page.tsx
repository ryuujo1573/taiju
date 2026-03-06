import { WeightPlot } from "~/components/WeightPlot";
import { api } from "~/lib/eden";

export default async function Home() {
  const { data } = await api.history.get();
  const history = data ?? [];
  const latest = [...history]
    .reverse()
    .find((entry) => Number.isFinite(entry.weight) && entry.weight > 0);

  const latestWeight =
    typeof latest?.weight === "number" ? latest.weight : undefined;
  const latestDate =
    typeof latest?.timestamp === "number"
      ? new Date(latest.timestamp)
      : undefined;
  const latestDateText = latestDate
    ? latestDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start gap-8 bg-white px-4 py-10 dark:bg-black sm:items-start sm:px-8 sm:py-16 md:px-16 md:py-24 lg:py-32">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Taiju
        </h1>
        <section className="w-full">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Latest weight
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
                  {typeof latestWeight === "number"
                    ? latestWeight.toFixed(1)
                    : "—"}
                </span>
                <span className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 sm:text-2xl">
                  kg
                </span>
              </div>
            </div>

            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {latestDateText ? latestDateText : "No entries yet"}
            </div>
          </div>
        </section>

        <div className="w-full">
          <WeightPlot initialData={history} />
        </div>
      </main>
    </div>
  );
}
