import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Alert } from "@/domain/types";
import {
  getAlertTypeChartDatas,
  getAlertSeverityChartDatas,
  capitalize,
} from "@/utils";

interface AlertPieChartProps {
  alerts: Alert[];
}

export function AlertTypeBarChart({ alerts }: AlertPieChartProps) {
  const { chartData, chartConfig } = getAlertTypeChartDatas(alerts);

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="type"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => capitalize(value).slice(0, 5)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="quantity" radius={4}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function AlertLineChart({ alerts }: AlertPieChartProps) {
  const { chartData, chartConfig } = getAlertSeverityChartDatas(alerts);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart accessibilityLayer data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie data={chartData} label dataKey="quantity" nameKey="severity" />
      </PieChart>
    </ChartContainer>
  );

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="severity"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => capitalize(value)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="quantity" fill="var(--color-desktop)" radius={4}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
