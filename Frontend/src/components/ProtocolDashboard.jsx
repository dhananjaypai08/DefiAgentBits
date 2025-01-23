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
  Cell 
} from 'recharts';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Layers, 
  Server 
} from 'lucide-react';
import axios from 'axios';

const COLORS = [
  '#8B5CF6', '#EC4899', '#10B981', 
  '#3B82F6', '#F43F5E', '#6366F1', 
  '#8B5CF6', '#F59E0B', '#22D3EE'
];

const ProtocolDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  // State for dynamic data
  const [blockchains, setBlockchains] = useState(['ethereum', 'polygon', 'avalanche', 'linea']);
  const [protocols, setProtocols] = useState([]);
  
  // Metrics and charts data
  const [protocolMetrics, setProtocolMetrics] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [poolData, setPoolData] = useState([]);
  const [protocolTvlData, setProtocolTvlData] = useState([]);
  const [topGainers, setTopGainers] = useState([]);

  const apiBaseURL = "http://localhost:8000";

  // Fetch available blockchains and protocols
  const fetchAvailableData = async () => {
    try {
      const blockchainResponse = await axios.get(`${apiBaseURL}/get_defi_protocols`, {
        params: { blockchain: selectedBlockchain }
      });

      const uniqueBlockchains = [...new Set(blockchainResponse.data.data.map(item => item.blockchain))];
      const uniqueProtocols = blockchainResponse.data.data.map(item => item.protocol);

      setBlockchains(uniqueBlockchains);
      setProtocols(uniqueProtocols);
      
      // Set initial protocol if not set
      if (!selectedProtocol && uniqueProtocols.length > 0) {
        setSelectedProtocol("degenswap");
      }
    } catch (error) {
      console.error('Error fetching available data:', error);
      
      // Fallback mock data
      setBlockchains(['ethereum', 'polygon', 'avalanche', 'linea']);
      setProtocols(['uniswap', 'sushiswap', 'curve', 'balancer', 'aave']);
      setSelectedProtocol('uniswap');
    }
  };

  // Fetch protocol-specific data
  const fetchProtocolData = async () => {
    if (!selectedBlockchain || !selectedProtocol) return;

    setLoading(true);
    try {
      // Fetch protocol metadata
      const protocolMetadataResponse = await axios.get(`${apiBaseURL}/get_protocol_metadata`, {
        params: { 
          blockchain: selectedBlockchain, 
          protocol: selectedProtocol 
        }
      });

      // Fetch pool data
      const poolResponse = await axios.get(`${apiBaseURL}/get_pool_by_protocol`, {
        params: { protocol: selectedProtocol }
      });

      // Set fetched data
      setProtocolMetrics(protocolMetadataResponse.data || mockProtocolMetrics());
      setPoolData(poolResponse.data || mockPoolData());

      // Generate time series and TVL data
      setTimeSeriesData(generateTimeSeriesData());
      setProtocolTvlData(generateProtocolTvlData());
      setTopGainers(generateTopGainers());
    } catch (error) {
      console.error('Error fetching protocol data:', error);
      
      // Fallback to mock data
      setProtocolMetrics(mockProtocolMetrics());
      setPoolData(mockPoolData());
      setTimeSeriesData(generateTimeSeriesData());
      setProtocolTvlData(generateProtocolTvlData());
      setTopGainers(generateTopGainers());
    } finally {
      setLoading(false);
    }
  };

  // Mock data generation functions
  const mockProtocolMetrics = () => ({
    tvl: `$${(Math.random() * 500000000).toFixed(2)}`,
    volume24h: `$${(Math.random() * 50000000).toFixed(2)}`,
    fees24h: `$${(Math.random() * 1000000).toFixed(2)}`
  });

  const generateTimeSeriesData = () => {
    const baseValue = 1000000;
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      tvl: baseValue * (1 + Math.sin(i * 0.2) * 0.3),
      volume: baseValue * 0.1 * (1 + Math.cos(i * 0.3) * 0.2)
    }));
  };

  const generateProtocolTvlData = () => {
    return protocols.map((protocol, index) => ({
      name: protocol,
      value: Math.random() * 500000000,
      color: COLORS[index % COLORS.length]
    }));
  };

  const generateTopGainers = () => {
    return protocols.slice(0, 5).map(protocol => ({
      name: protocol,
      tvl: `$${(Math.random() * 100000000).toFixed(2)}`,
      change: (Math.random() * 20).toFixed(2)
    }));
  };

  const mockPoolData = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      pair_address: `0x${Math.random().toString(16).slice(2, 10)}`,
      liquidity: Math.random() * 10000000
    }));
  };

  // Side effects
  useEffect(() => {
    fetchAvailableData();
  }, []);

  useEffect(() => {
    fetchProtocolData();
  }, [selectedBlockchain, selectedProtocol]);

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
                options={blockchains.map(blockchain => ({
                  value: blockchain,
                  label: blockchain.charAt(0).toUpperCase() + blockchain.slice(1)
                }))}
              />
              <Select
                value={selectedProtocol}
                onChange={e => setSelectedProtocol(e.target.value)}
                options={protocols.map(protocol => ({
                  value: protocol,
                  label: protocol.charAt(0).toUpperCase() + protocol.slice(1)
                }))}
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
            {/* Performance Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card glowing>
                <h3 className="text-lg font-semibold mb-4">Protocol TVL</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#000', border: '1px solid #8B5CF6'}} 
                        formatter={(val) => [`$${(val/1000000).toFixed(2)}M`]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="tvl" 
                        stroke="#8B5CF6" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card glowing>
                <h3 className="text-lg font-semibold mb-4">Protocol Volume</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#000', border: '1px solid #8B5CF6'}} 
                        formatter={(val) => [`$${(val/1000000).toFixed(2)}M`]}
                      />
                      <Bar dataKey="volume" fill="#EC4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Protocol TVL Breakdown */}
            <Card glowing>
              <h3 className="text-lg font-semibold mb-4">Protocol TVL Breakdown</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={protocolTvlData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={120} 
                      label
                    >
                      {protocolTvlData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => [`$${(val/1000000).toFixed(2)}M`]} 
                      contentStyle={{backgroundColor: '#000', border: '1px solid #8B5CF6'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Right Column - Metrics & Top Gainers */}
          <div className="space-y-6">
            {/* Key Metrics */}
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

              <Card glowing>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">24h Fees</p>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                      {protocolMetrics?.fees24h || 'N/A'}
                    </h3>
                  </div>
                  <Layers className="w-5 h-5 text-violet-500" />
                </div>
              </Card>
            </div>

            {/* Top Gainers */}
            <Card glowing>
              <h3 className="text-lg font-semibold mb-4">Top Protocols</h3>
              <div className="space-y-4">
                {topGainers.map((gainer, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 rounded bg-gray-900/50 hover:bg-gray-900 transition-colors"
                  >
                    <div>
                      <p className="font-medium capitalize">{gainer.name}</p>
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