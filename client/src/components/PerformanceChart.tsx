import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generatePerformanceData, type PerformanceDataPoint } from '@/lib/mockData';
import { useData } from '@/contexts/DataContext';
import { Button } from './ui/button';

export default function PerformanceChart() {
  const { modelStates } = useData();
  const [data, setData] = useState<PerformanceDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'ALL' | '72H'>('ALL');
  const [valueMode, setValueMode] = useState<'$' | '%'>('$');

  useEffect(() => {
    setData(generatePerformanceData());
  }, []);

  const filteredData = timeRange === '72H' ? data.slice(-24) : data;
  const totalAccountValue = modelStates.reduce((sum, model) => sum + model.accountValue, 0);
  const totalPnL = totalAccountValue - (modelStates.length * 10000);
  const totalPnLPercent = (totalPnL / (modelStates.length * 10000)) * 100;

  // Custom dot component for logo trails at the end of lines
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const model = modelStates.find(m => m.id === dataKey);
    
    // Only show logo on the last data point
    const isLastPoint = payload.timestamp === filteredData[filteredData.length - 1]?.timestamp;
    
    if (!isLastPoint || !model) return null;

    return (
      <g>
        {/* Outer circle with border */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={20} 
          fill="hsl(var(--background))" 
          stroke={model.color} 
          strokeWidth={2.5}
        />
        {/* Logo */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
        >
          {model.logo}
        </text>
        {/* Value tooltip */}
        <rect
          x={cx + 25}
          y={cy - 12}
          width={80}
          height={24}
          rx={4}
          fill={model.color}
        />
        <text
          x={cx + 65}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="600"
          fill="white"
        >
          ${(model.accountValue / 1000).toFixed(1)}k
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-4">
      {/* Total Account Value - nof1.ai style */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Total Account Value</div>
          <div className="flex items-baseline gap-3">
            <div className="text-4xl font-bold">
              ${totalAccountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xl font-semibold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} ({totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
        
        {/* Controls - nof1.ai style */}
        <div className="flex gap-2">
          {/* Time Range */}
          <Button
            variant={timeRange === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('ALL')}
            className="text-sm font-bold px-4"
          >
            ALL
          </Button>
          <Button
            variant={timeRange === '72H' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('72H')}
            className="text-sm font-bold px-4"
          >
            72H
          </Button>
          
          {/* Value Mode */}
          <div className="w-px bg-border mx-1" />
          <Button
            variant={valueMode === '$' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setValueMode('$')}
            className="text-sm font-bold px-4"
          >
            $
          </Button>
          <Button
            variant={valueMode === '%' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setValueMode('%')}
            className="text-sm font-bold px-4"
          >
            %
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 20, right: 100, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '13px' }}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '13px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              formatter={(value: any) => [`$${value.toFixed(2)}`, '']}
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            
            {/* Starting capital reference line */}
            <ReferenceLine y={10000} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" opacity={0.5} />

            {/* Lines for each AI model */}
            {modelStates.map((model) => (
              <Line
                key={model.id}
                type="monotone"
                dataKey={model.id}
                stroke={model.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            ))}

            {/* Logo trails at the end of each line */}
            {modelStates.map((model) => (
              <Line
                key={`${model.id}-dot`}
                type="monotone"
                dataKey={model.id}
                stroke="transparent"
                strokeWidth={0}
                dot={<CustomDot />}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Cards Below Chart - nof1.ai style (simplified) */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {modelStates.map((model) => {
          return (
            <div
              key={model.id}
              className="flex-shrink-0 p-5 rounded-lg border bg-card min-w-[200px] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl">
                  {model.logo}
                </div>
                <div className="text-base font-semibold">{model.name}</div>
              </div>
              <div className="text-2xl font-bold">
                ${(model.accountValue / 1000).toFixed(1)}k
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

