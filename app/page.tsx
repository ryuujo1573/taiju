import { WeightPlot } from "~/components/WeightPlot";
import { api } from "~/lib/eden";

export default async function Home() {
  const { data } = await api.history.get();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Taiju
        </h1>
        <p className="mt-8 text-center text-lg text-zinc-600 dark:text-zinc-400">
          
        </p>

        <div className="w-full mt-8">
          <WeightPlot initialData={data || []} />
        </div>
      </main>
    </div>
  );
}
