"use client";

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

export function WeightPlot({ initialData }: { initialData?: any[] }) {
  const { data: history, isLoading } = useQuery({
    queryKey: ["weightHistory"],
    queryFn: async () => {
      const { data, error } = await api.history.get();
      if (error) throw error;
      return data;
    },
    initialData,
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
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Weight History",
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
