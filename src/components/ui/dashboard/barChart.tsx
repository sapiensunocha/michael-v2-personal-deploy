"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ChartDataItem {
  name: string;
  funding?: number;
  fundingReceived?: number;
  people?: number;
  peopleReached?: number;
  orgs?: number;
  orgsSupported?: number;
}

interface ChartProps {
  data: ChartDataItem[];
  activeTab: string;
  showComparison?: boolean;
}

interface DataConfig {
  key: keyof ChartDataItem;
  comparisonKey: keyof ChartDataItem;
  label: string;
  comparisonLabel: string;
  color: string;
  comparisonColor: string;
  formatter: (value: number) => string;
  yAxisFormatter: (value: number) => string;
}

interface DataConfigMap {
  [key: string]: DataConfig;
}

export function BarChartComponent({ data, activeTab, showComparison = false }: ChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  const dataConfig: DataConfigMap = {
    funding: {
      key: "funding",
      comparisonKey: "fundingReceived",
      label: "Funding Requested",
      comparisonLabel: "Funding Received",
      color: "hsl(221, 83%, 53%)",
      comparisonColor: "hsl(150, 83%, 53%)",
      formatter: (value) => `$${value.toLocaleString()}`,
      yAxisFormatter: (value) => `$${value / 1000000}M`,
    },
    people: {
      key: "people",
      comparisonKey: "peopleReached",
      label: "People Affected",
      comparisonLabel: "People Reached",
      color: "hsl(0, 83%, 53%)",
      comparisonColor: "hsl(120, 83%, 53%)",
      formatter: (value) => `${value.toLocaleString()} people`,
      yAxisFormatter: (value) => `${value / 1000000}M`,
    },
    orgs: {
      key: "orgs",
      comparisonKey: "orgsSupported",
      label: "Organizations Identified",
      comparisonLabel: "Organizations Supported",
      color: "hsl(214, 63%, 42%)",
      comparisonColor: "hsl(145, 63%, 42%)",
      formatter: (value) => `${value} orgs`,
      yAxisFormatter: (value) => String(value),
    },
  };

  useEffect(() => {
    setChartData(data.length > 0 ? data : [{ name: "No Data", [dataConfig[activeTab].key]: 0 }]);
  }, [data, activeTab]);

  const currentConfig = dataConfig[activeTab] || dataConfig.funding;

  return (
    <ChartContainer
      config={{
        [currentConfig.key]: {
          label: currentConfig.label,
          color: currentConfig.color,
        },
        ...(showComparison && {
          [currentConfig.comparisonKey]: {
            label: currentConfig.comparisonLabel,
            color: currentConfig.comparisonColor,
          },
        }),
      }}
      className="h-64 text-black font-semibold bg-white rounded-lg shadow-md p-4"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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
            tickFormatter={currentConfig.yAxisFormatter}
          />
          {showComparison && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />}
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => currentConfig.formatter(Number(value))}
                labelFormatter={(label) => String(label)}
              />
            }
          />
          <Bar dataKey={currentConfig.key} fill={`var(--color-${currentConfig.key})`} radius={[4, 4, 0, 0]} />
          {showComparison && (
            <Bar
              dataKey={currentConfig.comparisonKey}
              fill={`var(--color-${currentConfig.comparisonKey})`}
              radius={[4, 4, 0, 0]}
            />
          )}
          {showComparison && <Legend />}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}