"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ChartProps {
  data: { name: string; funding: number }[];
}

export function Chart({ data }: ChartProps) {
  const chartData = data.length > 0 ? data : [{ name: "No Data", funding: 0 }];

  return (
    <ChartContainer
      config={{
        funding: {
          label: "Funding Received",
          color: "hsl(38 92% 50%)", // Amber
        },
      }}
      className="h-64 text-black font-semibold bg-white rounded-lg shadow-md p-4"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value / 1000000}M`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `$${Number(value).toLocaleString()}`}
                labelFormatter={(label) => String(label)}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="funding"
            stroke="var(--color-funding)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}