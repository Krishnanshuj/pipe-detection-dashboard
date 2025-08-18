import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ColorPieChart({ data }) {
  const colors = {
    red: "#FF0000",
    yellow: "#FFD700",
    green: "#008000",
    blue: "#0000FF",
    black: "#000000",
    white: "#FFFFFF",
    unknown: "#808080",
  };

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Pipe Colors",
        data: Object.values(data),
        backgroundColor: Object.keys(data).map((c) => colors[c] || "#808080"),
      },
    ],
  };

  return <Pie data={chartData} />;
}

export default ColorPieChart;
