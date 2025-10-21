import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generatePerformanceData, aiModels, type PerformanceDataPoint } from '@/lib/mockData';
import { Button } from './ui/button';

export default function PerformanceChart() {
  const [data, setData] = useState<PerformanceDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'ALL' | '72H'>('ALL');

  useEffect(() => {
    setData(generatePerformanceData());
  }, []);

  const filteredData = timeRange === '72H' ? data.slice(-24) : data;
  const totalAccountValue = aiModels.reduce((sum, model) => sum + model.accountValue, 0);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Portfolio Performance</h2>
          <p className="text-sm text-muted-foreground">Real-time tracking of AI trading agents</p>
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

      <div className="bg-accent-blue-light/50 rounded-lg p-4 border border-accent-blue/20">
        <div className="text-sm text-muted-foreground mb-1">Total Account Value</div>
        <div className="text-3xl font-bold text-foreground">
          ${totalAccountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="h-[400px]">
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
            {aiModels.map((model) => (
              <Line
                key={model.id}
                type="monotone"
                dataKey={model.id}
                stroke={model.color}
                strokeWidth={2}
                dot={false}
                name={model.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {aiModels.map((model) => (
          <div
            key={model.id}
            className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer bg-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
              <div className="text-xs font-medium text-muted-foreground">{model.name}</div>
            </div>
            <div className="text-lg font-semibold text-foreground">
              ${(model.accountValue / 1000).toFixed(1)}k
            </div>
            <div className={`text-xs ${model.returnPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {model.returnPercent >= 0 ? '+' : ''}
              {model.returnPercent.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

