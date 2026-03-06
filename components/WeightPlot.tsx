"use client";

import type { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { api } from "~/lib/eden";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export function WeightPlot({
  initialData,
}: {
  initialData?: Treaty.Data<typeof api.history.get>;
}) {
  const { data: history = initialData, isLoading } = useQuery({
    queryKey: ["weightHistory"],
    queryFn: async () => {
      const { data, error } = await api.history.get();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading chart...</div>;
  if (!history || history.length === 0) return <div>No data available</div>;

  const chartData = {
    labels: history.map((entry) =>
      new Date(entry.timestamp).toLocaleDateString(),
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: history.map((entry) => entry.weight),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Weight History",
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: unknown } }) => {
            const label = context.dataset.label ?? "Weight";
            const y = typeof context.parsed.y === "number" ? context.parsed.y : Number(context.parsed.y);
            const valueText = Number.isFinite(y) ? y.toFixed(1) : String(context.parsed.y);
            return `${label}: ${valueText}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) => {
            const n = typeof value === "number" ? value : Number(value);
            return Number.isFinite(n) ? n.toFixed(1) : String(value);
          },
        },
      },
    },
  };

  return (
    <div className="relative h-64 w-full sm:h-80 md:h-96">
      <Line options={options} data={chartData} />
    </div>
  );
}
