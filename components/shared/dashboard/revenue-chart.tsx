'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'


interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#ccc',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <p>
          <strong>{label}</strong>
        </p>
        <p>Revenue: {payload[0].value} SAR</p>
      </div>
    );
  }
  return null;
};





export default function RevenueChart({
  revenue,
}: {
  revenue: { month: string; revenue: number }[]
}) {
  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <ResponsiveContainer width="100%" height={450} className="p-2">
      <BarChart
        data={revenue}
       
      >
        <XAxis
          dataKey="month"
          scale="point"
          padding={{ left: 20, right: 20 }}
          tick={{ fontSize: 14, fill: '#888' }}
        />
        <YAxis tick={{ fontSize: 14 , fill: '#888'}} />
        <Tooltip content={<CustomTooltip />} />
        <Legend aria-label="latest 12 months" />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="revenue" fill="currentColor"  radius={[4, 4, 0, 0]} minPointSize={4} className="fill-primary"/>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
    <p style={{ marginTop: '10px', color: '#888', fontSize: '14px' }}>
      This chart represents the revenue data for the last 12 months.
    </p>
  </div>
  )
}

