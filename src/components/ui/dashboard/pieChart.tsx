"use client";

import type React from "react";
import { useState } from "react";
import { PieChart, Pie, Cell, Sector, Label } from "recharts";

interface ChartDataItem {
  name: string;
  fundingReceived?: number;
  peopleReached?: number;
  orgsSupported?: number;
}

interface PieChartComponentProps {
  data: ChartDataItem[];
  activeTab: string;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, activeTab }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ];

  const chartData = data.length > 0 ? data : [{ name: "No Data", [activeTab === "funding" ? "fundingReceived" : activeTab === "people" ? "peopleReached" : "orgsSupported"]: 0 }];

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, percent } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    const metricLabel = activeTab === "funding" ? "Funding Received" : activeTab === "people" ? "People Reached" : "Orgs Supported";
    const valueFormat = activeTab === "funding" ? `$${(value / 1000000).toFixed(1)}M` : activeTab === "people" ? `${(value / 1000000).toFixed(1)}M` : value.toString();

    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#FFF" fontSize={12}>{payload.name}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={10}>{`${metricLabel}: ${valueFormat}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={36} textAnchor={textAnchor} fill="#999" fontSize={10}>{`(${(percent * 100).toFixed(1)}%)`}</text>
      </g>
    );
  };

  const dataKey = activeTab === "funding" ? "fundingReceived" : activeTab === "people" ? "peopleReached" : "orgsSupported";

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <PieChart width={300} height={230}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          onMouseEnter={onPieEnter}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            position="center"
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
              const label = activeTab === "funding" ? "Funding Received" : activeTab === "people" ? "People Reached" : "Orgs Supported";
              return (
                <text x={viewBox.cx} y={viewBox.cy || 0} fill="#333" textAnchor="middle" dominantBaseline="central">
                  <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} fontSize="12" fontWeight="bold">{label}</tspan>
                  <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 10} fontSize="10">By Location</tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </div>
  );
};

export default PieChartComponent;