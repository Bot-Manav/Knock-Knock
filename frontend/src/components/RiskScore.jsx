import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RiskScore({ score, title, description, type }) {
  let color = "#818cf8";
  let glow = "rgba(129, 140, 248, 0.3)";
  let label = "Neutral";

  if (type === "risk") {
    if (score < 30) {
      color = "#34d399";
      glow = "rgba(52, 211, 153, 0.25)";
      label = "Low Risk";
    } else if (score < 70) {
      color = "#fbbf24";
      glow = "rgba(251, 191, 36, 0.25)";
      label = "Moderate";
    } else {
      color = "#f87171";
      glow = "rgba(248, 113, 113, 0.25)";
      label = "High Risk";
    }
  } else if (type === "transparency") {
    if (score > 70) {
      color = "#34d399";
      glow = "rgba(52, 211, 153, 0.25)";
      label = "Transparent";
    } else if (score > 40) {
      color = "#fbbf24";
      glow = "rgba(251, 191, 36, 0.25)";
      label = "Partial";
    } else {
      color = "#f87171";
      glow = "rgba(248, 113, 113, 0.25)";
      label = "Opaque";
    }
  }

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [color, "rgba(15, 23, 42, 0.8)"],
        borderWidth: 0,
        circumference: 220,
        rotation: 250,
        cutout: "78%",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div
      className="glass-card glass-card-interactive p-6 flex flex-col items-center relative overflow-hidden"
      style={{ boxShadow: `0 4px 32px ${glow}` }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ background: color }}
      />

      <div className="w-full flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full border"
          style={{ color, borderColor: `${color}40`, background: `${color}15` }}
        >
          {label}
        </span>
      </div>

      <div className="relative w-44 h-28 mb-2">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-5xl font-extrabold tabular-nums" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
