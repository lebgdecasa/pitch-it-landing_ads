import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AnalyticsData {
  totalVisits: number;
  conversions: { waitlist: number; demo: number };
  topSources: { source: string; visits: number }[];
  averageTimeOnPage: number;
  bounceRate: number;
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    // Protect dashboard route
    const isAuthorized = checkAuthorization();
    if (!isAuthorized) {
      router.push('/');
      return;
    }

    fetchAnalyticsData(dateRange);
  }, [dateRange]);

  const checkAuthorization = () => {
    // Implement your auth logic
    return process.env.NODE_ENV === 'development';
  };

  const fetchAnalyticsData = async (range: string) => {
    // Fetch from GA4 API or your backend
    // This is a placeholder
    setData({
      totalVisits: 1250,
      conversions: { waitlist: 87, demo: 23 },
      topSources: [
        { source: 'linkedin', visits: 450 },
        { source: 'facebook', visits: 320 },
        { source: 'instagram', visits: 280 }
      ],
      averageTimeOnPage: 125,
      bounceRate: 42.5
    });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Campaign Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Visits"
          value={data.totalVisits}
          change="+12%"
        />
        <MetricCard
          title="Waitlist Signups"
          value={data.conversions.waitlist}
          change="+8%"
        />
        <MetricCard
          title="Demo Requests"
          value={data.conversions.demo}
          change="+15%"
        />
        <MetricCard
          title="Avg. Time on Page"
          value={`${Math.floor(data.averageTimeOnPage / 60)}:${data.averageTimeOnPage % 60}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Traffic Sources</h2>
          {data.topSources.map(source => (
            <div key={source.source} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="capitalize">{source.source}</span>
                <span>{source.visits}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(source.visits / data.totalVisits) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Conversion Funnel</h2>
          <div className="space-y-4">
            <FunnelStep label="Page Visits" value={data.totalVisits} percentage={100} />
            <FunnelStep label="Form Views" value={320} percentage={25.6} />
            <FunnelStep label="Form Starts" value={180} percentage={14.4} />
            <FunnelStep label="Completions" value={110} percentage={8.8} />
          </div>
        </div>
      </div>
    </div>
  );
}

const MetricCard = ({ title, value, change }: any) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline mt-2">
      <p className="text-2xl font-bold">{value}</p>
      {change && (
        <span className={`ml-2 text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      )}
    </div>
  </div>
);

const FunnelStep = ({ label, value, percentage }: any) => (
  <div>
    <div className="flex justify-between mb-1">
      <span>{label}</span>
      <span>{value} ({percentage}%)</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-blue-600 h-3 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);
