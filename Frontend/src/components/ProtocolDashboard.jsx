import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import axios from 'axios';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';

// Mock Data Colors
const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F43F5E', '#6366F1', '#22D3EE', '#FBBF24'];

const ProtocolDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for dropdowns and data
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [selectedProtocol, setSelectedProtocol] = useState('degenswap');
  const [selectedPairAddress, setSelectedPairAddress] = useState('0x00035e291310c156114eb1ad601f442b09080f0a');

  const [blockchains, setBlockchains] = useState(['ethereum', 'polygon', 'linea', 'avalanche']);
  const [protocols, setProtocols] = useState(['degenswap', 'uniswap', 'sushiswap']);
  const [poolMetrics, setPoolMetrics] = useState({});
  const [tvlData, setTvlData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [topProtocolsData, setTopProtocolsData] = useState([]);

  const apiBaseURL = 'http://localhost:8000';

  const protocols_map = {0: "sakeswap", 1: "shibaswap", 2: "uniswap", 3: "9inch", 4: "sync swap", 5: "thunderswap", 6: "unicly", 7: "degenswap"};

  const generateMockData = () => ({
    poolMetrics: {
      total_tvl: '1,500,000',
      volume_24hrs: '500,000',
      transactions_24hrs: '1200',
      gas_fees: '5,000',
      net_slippage: '1.2%',
    },
    tvlData: Array.from({ length: 7 }, (_, i) => ({
      protocol: protocols_map[i],
      tvl: Math.random() * 1000000,
    })),
    volumeData: Array.from({ length: 7 }, (_, i) => ({
      date: `Day ${i + 1}`,
      volume: Math.random() * 500000,
    })),
    topProtocolsData: Array.from({ length: 5 }, (_, i) => ({
      name: protocols_map[i],
      gains: Math.random() * 15 + 5,
    })),
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [poolResponse, tvlResponse, volumeResponse] = await Promise.all([
        axios.get(`${apiBaseURL}/get_dex_pool_metrics`, {
          params: { blockchain: selectedBlockchain, pair_address: selectedPairAddress },
        }),
        axios.get(`${apiBaseURL}/get_pool_by_protocol`, { params: { protocol: selectedProtocol } }),
        axios.get(`${apiBaseURL}/get_pool_metric`, { params: { pair_address: selectedPairAddress } }),
      ]);
      console.log(tvlResponse, poolResponse, volumeResponse);
      setPoolMetrics(poolResponse.data.protocol[0] || {});
      setTvlData(tvlResponse.data.data || []);
      setVolumeData(volumeResponse.data.pool || []);
    } catch {
      const mock = generateMockData();
      setPoolMetrics(mock.poolMetrics);
      setTvlData(mock.tvlData);
      setVolumeData(mock.volumeData);
      setTopProtocolsData(mock.topProtocolsData);
      // setError('Failed to fetch live data. Showing mock data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedBlockchain, selectedProtocol, selectedPairAddress]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black p-20 mt-1">
      {loading && <Loader />}
      {error && <div className="p-4 bg-red-600 text-white mb-4">{error}</div>}
      {!loading && (
        <div>
          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <Select
              value={selectedBlockchain}
              onChange={setSelectedBlockchain}
              options={blockchains.map((b) => ({ value: b, label: b.toUpperCase() }))}
            />
            <Select
              value={selectedProtocol}
              onChange={setSelectedProtocol}
              options={protocols.map((p) => ({ value: p, label: p.toUpperCase() }))}
            />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card title="Total TVL" value="13.2Mn" ><bold>Total TVL</bold>: 13.2Mn$</Card>
            <Card title="24h Volume" value="324349"><bold>24h Volume</bold>: 324349</Card>            
            <Card title="Gas Fees" value="12.2% Increase(15$ Avg)"><bold>Gas fees</bold>: x12.2% Increase(15$ Avg)</Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* TVL Bar Chart */}
            <Card title="TVL for Different Protocols">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tvlData}>
                  <XAxis dataKey="protocol" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: 'black', border: '1px solid #333' }} />
                  <Bar dataKey="tvl" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Volume Line Chart */}
            <Card title="Volume Over Time">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volumeData}>
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: 'black', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="volume" stroke="#3B82F6" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Protocols */}
          <div className="mt-6">
            <Card title="Top Gainers">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProtocolsData}
                    cx="50%"
                    cy="50%"
                    label={(entry) => `${entry.name}: ${entry.gains.toFixed(2)}%`}
                    outerRadius={100}
                    dataKey="gains"
                  >
                    {topProtocolsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolDashboard;
