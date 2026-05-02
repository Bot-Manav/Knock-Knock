import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RiskScore({ score, title, description, type }) {
  // Determine color based on score and type
  let color = '#3b82f6'; // default blue
  
  if (type === 'risk') {
    if (score < 30) color = '#10b981'; // green
    else if (score < 70) color = '#f59e0b'; // yellow
    else color = '#ef4444'; // red
  } else if (type === 'transparency') {
    if (score > 70) color = '#10b981'; // green
    else if (score > 40) color = '#f59e0b'; // yellow
    else color = '#ef4444'; // red
  }

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [color, '#1e293b'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: '75%',
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center shadow-sm relative">
      <h3 className="text-lg font-semibold text-slate-200 w-full text-left mb-2">{title}</h3>
      <p className="text-sm text-slate-500 w-full text-left mb-6">{description}</p>
      
      <div className="relative w-48 h-24 mb-4">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
    </div>
  );
}
