import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generatePerformanceData, type PerformanceDataPoint } from '@/lib/mockData';
import { useData } from '@/contexts/DataContext';
import { Button } from './ui/button';

export default function PerformanceChart() {
  const { modelStates } = useData();
  const [data, setData] = useState<PerformanceDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'ALL' | '72H'>('ALL');

  useEffect(() => {
    setData(generatePerformanceData());
  }, []);

  const filteredData = timeRange === '72H' ? data.slice(-24) : data;
  const totalAccountValue = modelStates.reduce((sum, model) => sum + model.accountValue, 0);

  // Custom dot component for logo trails
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const model = modelStates.find(m => m.id === dataKey);
    
    // Only show logo on the last data point
    const isLastPoint = payload.timestamp === filteredData[filteredData.length - 1]?.timestamp;
    
    if (!isLastPoint || !model) return null;

    return (
      <g>
        <circle cx={cx} cy={cy} r={16} fill="white" stroke={model.color} strokeWidth={2} />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="16"
        >
          {model.logo}
        </text>
      </g>
    );
  };


  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Portfolio Performance</h2>
          <p className="text-base text-muted-foreground">Real-time tracking of AI trading agents</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('ALL')}
          >
            All Time
          </Button>
          <Button
            variant={timeRange === '72H' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('72H')}
          >
            72 Hours
          </Button>
        </div>
      </div>

      <div className="bg-accent-blue-light/50 rounded-lg p-6 border border-accent-blue/20">
        <div className="text-base text-muted-foreground mb-2">Total Account Value</div>
        <div className="text-4xl font-bold text-foreground">
          ${totalAccountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" vertical={false} />
            <XAxis
              dataKey="timestamp"
              stroke="hsl(0, 0%, 70%)"
              tick={{ fill: 'hsl(0, 0%, 45%)', fontSize: 11 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              stroke="hsl(0, 0%, 70%)"
              tick={{ fill: 'hsl(0, 0%, 45%)', fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid hsl(0, 0%, 90%)',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            />
            {modelStates.map((model) => (
              <Line
                key={model.id}
                type="monotone"
                dataKey={model.id}
                stroke={model.color}
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
                name={model.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue flex items-center justify-center text-xs">
            {modelStates[0]?.logo || '🟣'}
          </div>
          <span className="text-muted-foreground">AI Model Position</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {modelStates.map((model) => (
          <div
            key={model.id}
            className="border border-border rounded-lg p-5 hover:shadow-sm transition-shadow cursor-pointer bg-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xl">{model.logo}</div>
              <div className="text-sm font-medium text-muted-foreground">{model.name}</div>
            </div>
            <div className="text-xl font-semibold text-foreground">
              ${(model.accountValue / 1000).toFixed(1)}k
            </div>
            <div className={`text-sm ${model.returnPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {model.returnPercent >= 0 ? '+' : ''}
              {model.returnPercent.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

