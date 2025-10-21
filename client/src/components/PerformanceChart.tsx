import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generatePerformanceData, aiModels, type PerformanceDataPoint } from '@/lib/mockData';
import { Button } from './ui/button';

export default function PerformanceChart() {
  const [data, setData] = useState<PerformanceDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'ALL' | '72H'>('ALL');
  const [valueType, setValueType] = useState<'$' | '%'>('$');

  useEffect(() => {
    setData(generatePerformanceData());
  }, []);

  const filteredData = timeRange === '72H' ? data.slice(-24) : data;

  const totalAccountValue = aiModels.reduce((sum, model) => sum + model.accountValue, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">TOTAL ACCOUNT VALUE</div>
          <div className="text-3xl font-bold text-foreground">
            ${totalAccountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('ALL')}
            className={timeRange === 'ALL' ? 'bg-neon-green text-black' : ''}
          >
            ALL
          </Button>
          <Button
            variant={timeRange === '72H' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('72H')}
            className={timeRange === '72H' ? 'bg-neon-green text-black' : ''}
          >
            72H
          </Button>
          <Button
            variant={valueType === '$' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setValueType('$')}
            className={valueType === '$' ? 'bg-neon-green text-black' : ''}
          >
            $
          </Button>
          <Button
            variant={valueType === '%' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setValueType('%')}
            className={valueType === '%' ? 'bg-neon-green text-black' : ''}
          >
            %
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" />
            <XAxis
              dataKey="timestamp"
              stroke="hsl(0, 0%, 63%)"
              tick={{ fill: 'hsl(0, 0%, 63%)', fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
              }}
            />
            <YAxis
              stroke="hsl(0, 0%, 63%)"
              tick={{ fill: 'hsl(0, 0%, 63%)', fontSize: 10 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 13%, 11%)',
                border: '1px solid hsl(220, 13%, 20%)',
                borderRadius: '6px',
                color: 'hsl(0, 0%, 98%)',
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
        {aiModels.map((model) => (
          <div
            key={model.id}
            className="border border-border rounded p-3 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="text-xs text-muted-foreground mb-1">{model.name.toUpperCase()}</div>
            <div className="text-lg font-bold" style={{ color: model.color }}>
              ${model.accountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

