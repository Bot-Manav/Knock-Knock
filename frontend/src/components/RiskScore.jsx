import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = {
  low: "#ff7b2e",
  mid: "#c24e2a",
  high: "#3a1f12",
  track: "#f4e7e1",
};

export default function RiskScore({ score, title, description, type }) {
  let color = PALETTE.mid;
  let label = "Moderate";

  if (type === "risk") {
    if (score < 30) {
      color = PALETTE.low;
      label = "Lower concern";
    } else if (score < 70) {
      color = PALETTE.mid;
      label = "Review";
    } else {
      color = PALETTE.high;
      label = "Higher concern";
    }
  } else {
    if (score > 70) {
      color = PALETTE.low;
      label = "Strong";
    } else if (score > 40) {
      color = PALETTE.mid;
      label = "Partial";
    } else {
      color = PALETTE.high;
      label = "Needs work";
    }
  }

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [color, PALETTE.track],
        borderWidth: 0,
        circumference: 220,
        rotation: 250,
        cutout: "78%",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="palette-card p-6 flex flex-col items-center surface-cream">
      <div className="w-full flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-brown">{title}</h3>
          <p className="text-xs text-muted mt-0.5">{description}</p>
        </div>
        <span
          className="text-xs font-bold px-2 py-1 rounded-lg border-2 border-palette-dark text-brown"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      </div>
      <div className="relative w-44 h-28">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { tooltip: { enabled: false }, legend: { display: false } },
          }}
        />
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-5xl font-extrabold text-brown">{score}</span>
        </div>
      </div>
    </div>
  );
}
