import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DiameterBarChart({ data }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Pipe Count",
        data: Object.values(data),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Pipe Diameter Counts" },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default DiameterBarChart;
