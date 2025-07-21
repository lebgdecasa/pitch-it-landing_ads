// components/project/dashboard/MetricsDisplay.tsx
import React from 'react';
import { ArrowDown, ArrowUp, Minus, HelpCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"
import { useTranslation } from 'next-i18next';

interface MetricValue {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
}

interface MetricsData {
  tam?: MetricValue;
  potentialEarnings?: MetricValue;
  marketGrowthRate?: MetricValue;
  projectedMarketShare?: MetricValue;
  cac?: MetricValue;
  cltv?: MetricValue;
  cacCltvRatio?: MetricValue;
  averageGrossMargin?: MetricValue;
  cacPayback?: MetricValue;
  salesCycle?: MetricValue;
  timeToMvp?: MetricValue;
  seedToLaunch?: MetricValue;
  timeToRevenue?: MetricValue;
}

const formatValue = (value: number, prefix?: string, suffix?: string): string => {
  if (!value) return 'N/A';

  let formattedValue = value;

  if (value >= 1000000000) {
    formattedValue = value / 1000000000;
    return `${prefix || ''}${formattedValue.toFixed(1)}B`;
  } else if (value >= 1000000) {
    formattedValue = value / 1000000;
    return `${prefix || ''}${formattedValue.toFixed(1)}M`;
  } else if (value >= 1000) {
    formattedValue = value / 1000;
    return `${prefix || ''}${formattedValue.toFixed(1)}K`;
  }

  return `${prefix || ''}${formattedValue}${suffix || ''}`;
};

const MetricCard: React.FC<{ metric: MetricValue }> = ({ metric }) => {
  if (!metric) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          {metric.label}
          {metric.tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  {metric.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(metric.value, metric.prefix, metric.suffix)}
        </div>
      </CardContent>
    </Card>
  );
};

export const MetricsDisplay: React.FC<{ metrics: MetricsData }> = ({ metrics }) => {
  const { t } = useTranslation('common');
  return (
    <div className="space-y-6">
      {/* Market Potential */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('metrics_display_market_potential')}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.tam && <MetricCard metric={metrics.tam} />}
          {metrics.potentialEarnings && <MetricCard metric={metrics.potentialEarnings} />}
          {metrics.marketGrowthRate && <MetricCard metric={metrics.marketGrowthRate} />}
          {metrics.projectedMarketShare && <MetricCard metric={metrics.projectedMarketShare} />}
        </div>
      </div>

      {/* Profitability */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('metrics_display_profitability')}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.cac && <MetricCard metric={metrics.cac} />}
          {metrics.cltv && <MetricCard metric={metrics.cltv} />}
          {metrics.cacCltvRatio && <MetricCard metric={metrics.cacCltvRatio} />}
          {metrics.averageGrossMargin && <MetricCard metric={metrics.averageGrossMargin} />}
        </div>
      </div>

      {/* Time to Market */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('metrics_display_time_to_market')}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.timeToMvp && <MetricCard metric={metrics.timeToMvp} />}
          {metrics.timeToRevenue && <MetricCard metric={metrics.timeToRevenue} />}
          {metrics.salesCycle && <MetricCard metric={metrics.salesCycle} />}
          {metrics.seedToLaunch && <MetricCard metric={metrics.seedToLaunch} />}
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
