// Import required libraries and components
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import axios from 'axios';

const ProtocolDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [selectedProtocol, setSelectedProtocol] = useState('uniswap');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [topGainers, setTopGainers] = useState([]);
  const [protocolMetrics, setProtocolMetrics] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [poolData, setPoolData] = useState([]);

  // API endpoint base URL
  const apiBaseURL = "http://localhost:8000";

  // Fetch real-time data from the backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const poolByProtocolResponse = await axios.get(`${apiBaseURL}/get_pool_by_protocol`, {
        params: { protocol: selectedProtocol }
      });

      const protocolMetadataResponse = await axios.get(`${apiBaseURL}/get_protocol_metadata`, {
        params: { blockchain: selectedBlockchain, protocol: selectedProtocol }
      });

      setPoolData(poolByProtocolResponse.data);
      setProtocolMetrics(protocolMetadataResponse.data);

      // Generate synthetic time series data for charts
      const daysMap = { '24h': 24, '7d': 168, '30d': 720, '90d': 2160 };
      const intervals = daysMap[selectedTimeRange];
      setTimeSeriesData(generateTimeSeriesData(intervals));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate synthetic time series data for placeholder visuals
  const generateTimeSeriesData = (days) => {
    const baseValue = 1000000;
    const volatility = 0.05;
    const trendFactor = 0.002;

    return Array.from({ length: days }, (_, i) => {
      const trend = 1 + (i * trendFactor);
      const noise = 1 + (Math.random() - 0.5) * volatility;
      const tvl = baseValue * trend * noise;
      const volume = tvl * 0.1 * (1 + Math.sin(i / 5) * 0.3);
      const price = 100 * trend * (1 + Math.cos(i / 3) * 0.2);

      return {
        date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        tvl,
        volume,
        price
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, [selectedBlockchain, selectedProtocol, selectedTimeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black p-10 mt-1">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Filters Section */}
        <div className="sticky top-16 z-10 bg-black/80 backdrop-blur-sm py-4 border-b border-violet-500/20">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Select
                value={selectedBlockchain}
                onChange={e => setSelectedBlockchain(e.target.value)}
                options={[
                  { value: 'ethereum', label: 'Ethereum' },
                  { value: 'polygon', label: 'Polygon' },
                  { value: 'avalanche', label: 'Avalanche' },
                  { value: 'linea', label: 'Linea' }
                ]}
              />
              <Select
                value={selectedProtocol}
                onChange={e => setSelectedProtocol(e.target.value)}
                options={[
                  { value: 'uniswap', label: 'Uniswap' },
                  { value: 'sushiswap', label: 'Sushiswap' },
                  { value: 'curve', label: 'Curve' },
                  { value: 'balancer', label: 'Balancer' }
                ]}
              />
            </div>
            <div className="flex gap-2">
              {['24h', '7d', '30d', '90d'].map(range => (
                <Button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`${selectedTimeRange === range ? 'bg-violet-500' : ''} px-4 py-2`}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Protocol Performance Chart */}
            <Card glowing>
              <h3 className="text-lg font-semibold mb-6">Protocol Performance</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                      }}
                      formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`]}
                    />
                    <Line 
                      name="TVL"
                      type="monotone"
                      dataKey="tvl"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      name="Volume"
                      type="monotone"
                      dataKey="volume"
                      stroke="#EC4899"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Pool Data Analysis */}
            <Card glowing>
              <h3 className="text-lg font-semibold mb-6">Pool Data Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={poolData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="pair_address" 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                      }}
                      formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`]}
                    />
                    <Bar 
                      name="Liquidity"
                      dataKey="liquidity"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="space-y-4">
              <Card glowing>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">Total Value Locked</p>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                      {protocolMetrics?.tvl || 'N/A'}
                    </h3>
                  </div>
                  <DollarSign className="w-5 h-5 text-violet-500" />
                </div>
              </Card>

              <Card glowing>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">24h Volume</p>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                      {protocolMetrics?.volume24h || 'N/A'}
                    </h3>
                  </div>
                  <Activity className="w-5 h-5 text-violet-500" />
                </div>
              </Card>
            </div>

            {/* Top Gainers */}
            <Card glowing>
              <h3 className="text-lg font-semibold mb-4">Top Gainers</h3>
              <div className="space-y-4">
                {topGainers.map((gainer, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded bg-gray-900/50 hover:bg-gray-900 transition-colors">
                    <div>
                      <p className="font-medium">{gainer.name}</p>
                      <p className="text-sm text-gray-400">TVL: {gainer.tvl}</p>
                    </div>
                    <div className="text-lg font-bold text-green-500">
                      +{gainer.change}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolDashboard;