'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  TrendingUp, 
  MousePointerClick, 
  DollarSign, 
  Target,
  Calendar,
  Play,
  Pause,
  Plus,
  RefreshCw,
  Eye,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format, subDays } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  status: string;
  type: string;
  budget: number;
  metrics: {
    impressions: number;
    clicks: number;
    cost: number;
    conversions: number;
    ctr: number;
    avgCpc: number;
    conversionRate: number;
  };
}

interface OverviewStats {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  avgCpc: number;
  conversionRate: number;
}

interface PerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
}

export default function GoogleAdsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [dateRange, setDateRange] = useState(30);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
      fetchAllData();
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCampaigns(),
        fetchOverview(),
        fetchPerformanceData(),
      ]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/google-ads?action=campaigns', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/google-ads?action=overview', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setOverview(data);
      }
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(subDays(new Date(), dateRange), 'yyyy-MM-dd');
      
      const response = await fetch(
        `/api/google-ads?action=performance&startDate=${startDate}&endDate=${endDate}`,
        { headers: getAuthHeaders() }
      );
      const data = await response.json();
      if (response.ok) {
        setPerformanceData(data);
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const toggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ENABLED' ? 'PAUSED' : 'ENABLED';
    try {
      const response = await fetch('/api/google-ads', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'update-status',
          campaignId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        await fetchCampaigns();
      }
    } catch (error) {
      console.error('Failed to update campaign status:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Admin</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Google Ads Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Impressions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last 30 Days</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatNumber(overview.impressions)}
                </h3>
                <p className="text-sm font-medium text-gray-600">Impressions</p>
              </div>
            </div>

            {/* Clicks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <MousePointerClick className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {overview.ctr.toFixed(2)}% CTR
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatNumber(overview.clicks)}
                </h3>
                <p className="text-sm font-medium text-gray-600">Clicks</p>
              </div>
            </div>

            {/* Cost */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {formatCurrency(overview.avgCpc)} Avg CPC
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(overview.cost)}
                </h3>
                <p className="text-sm font-medium text-gray-600">Total Spend</p>
              </div>
            </div>

            {/* Conversions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  {overview.conversionRate.toFixed(2)}% Rate
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatNumber(overview.conversions)}
                </h3>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
              </div>
            </div>
          </div>
        )}

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Impressions & Clicks Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Performance Trend</h2>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stroke="#3B82F6"
                  fill="url(#colorImpressions)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#10B981"
                  fill="url(#colorClicks)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cost & Conversions Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Cost & Conversions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="cost" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="conversions" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Campaigns</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    CTR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <TrendingUp className="w-12 h-12 mb-3 text-gray-400" />
                        <p className="text-lg font-medium">No campaigns yet</p>
                        <p className="text-sm mt-1">Create your first campaign to start tracking performance</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-xs text-gray-500">{campaign.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === 'ENABLED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(campaign.budget)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatNumber(campaign.metrics.impressions)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatNumber(campaign.metrics.clicks)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {campaign.metrics.ctr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(campaign.metrics.cost)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {campaign.metrics.conversions}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title={campaign.status === 'ENABLED' ? 'Pause campaign' : 'Resume campaign'}
                        >
                          {campaign.status === 'ENABLED' ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Campaign</h3>
            <p className="text-gray-600 mb-4">
              Campaign creation wizard will be available soon. For now, please create campaigns directly in your Google Ads account.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href="https://ads.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Open Google Ads
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

