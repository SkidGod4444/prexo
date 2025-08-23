"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, Cell, XAxis, ReferenceLine } from "recharts";
import React from "react";
import { AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { useMotionValueEvent, useSpring } from "framer-motion";
import { UsageLogType } from "@prexo/types";


const CHART_MARGIN = 35;

// Month names for display
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Function to transform usageLogs into chart data
const transformUsageLogsToChartData = (logs: UsageLogType[]) => {
  // Initialize all months with 0 API calls
  const monthlyData = monthNames.map((month, index) => ({
    month,
    apiCalls: 0,
    monthNumber: index + 1
  }));

  // Fill in actual data from usageLogs
  logs.forEach(log => {
    if (log.month && log.api_calls) {
      const monthIndex = log.month - 1; // month is 1-based, array is 0-based
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].apiCalls = log.api_calls;
      }
    }
  });

  return monthlyData;
};

const chartConfig = {
  apiCalls: {
    label: "API Calls",
    color: "var(--secondary-foreground)",
  },
} satisfies ChartConfig;

export function ApiCallsChart({usageLogs}: { usageLogs: UsageLogType[] }) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined,
  );

  // Transform usageLogs to chart data
  const chartData = React.useMemo(() => {
    if (!usageLogs || usageLogs.length === 0) {
      // Return empty data if no logs
      return monthNames.map((month, index) => ({
        month,
        apiCalls: 0,
        monthNumber: index + 1
      }));
    }
    return transformUsageLogsToChartData(usageLogs);
  }, [usageLogs]);

  const maxValueIndex = React.useMemo(() => {
    // if user is moving mouse over bar then set value to the bar value
    if (activeIndex !== undefined) {
      return { index: activeIndex, value: chartData[activeIndex].apiCalls };
    }
    // if no active index then set value to max value
    return chartData.reduce(
      (max: { index: number; value: number }, data: { month: string; apiCalls: number }, index: number) => {
        return data.apiCalls > max.value ? { index, value: data.apiCalls } : max;
      },
      { index: 0, value: 0 },
    );
  }, [activeIndex, chartData]);

  const maxValueIndexSpring = useSpring(maxValueIndex.value, {
    stiffness: 100,
    damping: 20,
  });

  const [springyValue, setSpringyValue] = React.useState(maxValueIndex.value);

  useMotionValueEvent(maxValueIndexSpring, "change", (latest) => {
    setSpringyValue(Number(Number(latest).toFixed(0)));
  });

  React.useEffect(() => {
    maxValueIndexSpring.set(maxValueIndex.value);
  }, [maxValueIndex.value, maxValueIndexSpring]);

  return (
    <Card className="bg-transparent border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">API Calls</span>
          <Badge variant="secondary">
            <TrendingUp className="h-4 w-4" />
            <span>{chartData.reduce((total, month) => total + month.apiCalls, 0)}</span>
          </Badge>
        </CardTitle>
        <CardDescription>Total API calls this year</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <AnimatePresence mode="wait">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              onMouseLeave={() => setActiveIndex(undefined)}
              margin={{
                left: CHART_MARGIN,
              }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Bar dataKey="apiCalls" fill="var(--color-primary)" radius={4} className="cursor-pointer">
                {chartData.map((_, index) => (
                  <Cell
                    className="duration-200"
                    opacity={index === maxValueIndex.index ? 1 : 0.2}
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                  />
                ))}
              </Bar>
              <ReferenceLine
                opacity={0.4}
                y={springyValue}
                stroke="var(--secondary-foreground)"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={<CustomReferenceLabel value={maxValueIndex.value} />}
              />
            </BarChart>
          </ChartContainer>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface CustomReferenceLabelProps {
  viewBox?: {
    x?: number;
    y?: number;
  };
  value: number;
}

const CustomReferenceLabel: React.FC<CustomReferenceLabelProps> = (props) => {
  const { viewBox, value } = props;
  const x = viewBox?.x ?? 0;
  const y = viewBox?.y ?? 0;

  // we need to change width based on value length
  const width = React.useMemo(() => {
    const characterWidth = 8; // Average width of a character in pixels
    const padding = 10;
    return value.toString().length * characterWidth + padding;
  }, [value]);

  return (
    <>
      <rect
        x={x - CHART_MARGIN}
        y={y - 9}
        width={width}
        height={18}
        fill="var(--secondary-foreground)"
        rx={4}
      />
      <text
        fontWeight={600}
        x={x - CHART_MARGIN + 6}
        y={y + 4}
        fill="var(--primary-foreground)"
      >
        {value}
      </text>
    </>
  );
};
