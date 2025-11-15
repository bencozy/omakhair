'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MousePointerClick, 
  DollarSign, 
  Target,
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

export function GoogleAdsSection() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [dateRange, setDateRange] = useState(30);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchPerformanceData();
    }
  }, [dateRange]);

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
    try {
      const newStatus = currentStatus === 'ENABLED' ? 'PAUSED' : 'ENABLED';
      const response = await fetch('/api/google-ads', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'updateCampaignStatus',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading Google Ads data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Google Ads Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage your advertising campaigns</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Impressions</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{overview.impressions.toLocaleString()}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Clicks</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{overview.clicks.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">CTR: {overview.ctr.toFixed(2)}%</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                <MousePointerClick className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Cost</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">${overview.cost.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Avg CPC: ${overview.avgCpc.toFixed(2)}</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Conversions</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{overview.conversions}</p>
                <p className="text-xs text-gray-500 mt-1">Rate: {overview.conversionRate.toFixed(2)}%</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Charts */}
      {performanceData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Performance Trend</h3>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[300px] px-4 sm:px-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="impressions" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Cost & Conversions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Cost & Conversions</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[300px] px-4 sm:px-0">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="cost" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="conversions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Active Campaigns ({campaigns.length})</h3>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No campaigns found</p>
            <p className="text-sm text-gray-500 mb-4">Create your first campaign to start advertising</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv.</th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-xs text-gray-500">{campaign.type}</div>
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          campaign.status === 'ENABLED' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${campaign.budget.toFixed(2)}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.metrics.impressions.toLocaleString()}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.metrics.clicks.toLocaleString()}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${campaign.metrics.cost.toFixed(2)}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.metrics.conversions}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                          className="text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title={campaign.status === 'ENABLED' ? 'Pause campaign' : 'Resume campaign'}
                        >
                          {campaign.status === 'ENABLED' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{campaign.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{campaign.type}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'ENABLED' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                      <button 
                        onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                        className="text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={campaign.status === 'ENABLED' ? 'Pause campaign' : 'Resume campaign'}
                      >
                        {campaign.status === 'ENABLED' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-medium text-gray-900">${campaign.budget.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cost</p>
                      <p className="font-medium text-gray-900">${campaign.metrics.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Impressions</p>
                      <p className="font-medium text-gray-900">{campaign.metrics.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clicks</p>
                      <p className="font-medium text-gray-900">{campaign.metrics.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CTR</p>
                      <p className="font-medium text-gray-900">{campaign.metrics.ctr.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversions</p>
                      <p className="font-medium text-gray-900">{campaign.metrics.conversions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

