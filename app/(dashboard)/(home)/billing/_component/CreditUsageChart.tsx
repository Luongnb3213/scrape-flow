'use client';

import { GetCreditUsageInPeriod } from '@/actions/analytics/GetCreditUsageInPeriod';
import { GetWorkflowExecutionStats } from '@/actions/analytics/GetWorkflowExecutionStats';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  ChartColumnStackedIcon,
} from 'lucide-react';
import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>;
const CreditUsageChart = ({
  data,
  title,
  description,
}: {
  data: ChartData;
  title: string;
  description: string;
}) => {
  const chartConfig = {
    success: {
      label: 'Successfull Phases credits',
      color: 'hsl(var(--chart-2))',
    },
    failed: {
      label: 'Failed Phases credits',
      color: 'hsl(var(--chart-1))',
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={'date'}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              fillOpacity={0.6}
              dataKey={'success'}
              stroke="var(--color-success)"
              fill="var(--color-success)"
              stackId={'a'}
            />
            <Bar
              fillOpacity={0.6}
              stroke="#9F4141"
              fill="#9F4141"
              stackId={'a'}
              dataKey={'failed'}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CreditUsageChart;
