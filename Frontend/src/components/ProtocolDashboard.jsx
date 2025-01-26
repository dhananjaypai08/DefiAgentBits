import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  ComposedChart 
} from 'recharts';
import { 
  Database, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  Layers,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';

// Utility Functions
const formatCurrency = (value) => {
  if (value == null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact'
  }).format(value);
};

const formatPercentage = (value) => {
  return value ? `${(value).toFixed(2)}%` : '0%';
};

const ProtocolDashboard = () => {
  // State Management
  const [blockchains, setBlockchains] = useState([
    'ethereum', 'polygon', 'avalanche', 'linea'
  ]);
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [protocolPairs, setProtocolPairs] = useState([]);
  const [selectedPair, setSelectedPair] = useState('');
  // const [selectedToken0, setSelectedToken0] = useState('');
  // const [selectedToken1, setSelectedToken1] = useState('');
  
  // Metrics States
  const [poolMetrics, setPoolMetrics] = useState(null);
  const [tokenPriceHistory, setTokenPriceHistory] = useState([]);
  const [liquidityDistribution, setLiquidityDistribution] = useState([]);
  const [transactionTrends, setTransactionTrends] = useState([]);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Configuration
  const API_BASE_URL = 'http://localhost:8000';

  // Fetch Protocols
  const fetchProtocols = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_defi_protocols`, {
        params: { blockchain: selectedBlockchain }
      });
      const blockchainProtocols = Array.isArray(response.data) ? response.data : [];
      // const sortedProtocols = blockchainProtocols
      //   .sort((a, b) => a.protocol.localeCompare(b.protocol));
      // console.log(blockchainProtocols);
      setProtocols(blockchainProtocols);
      setSelectedProtocol(blockchainProtocols[0] || null);
    } catch (err) {
      // setError('Failed to fetch protocols');
      setProtocols([]);
    }
  }, [selectedBlockchain]);

  // Fetch Protocol Metadata
  const fetchProtocolMetadata = useCallback(async () => {
    if (!selectedBlockchain || !selectedProtocol) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/get_protocol_metadata`, {
        params: { 
          blockchain: selectedBlockchain, 
          protocol: selectedProtocol.protocol
        }
      });
      const metadata = Array.isArray(response.data) ? response.data : [];
      console.log(metadata);
      setProtocolPairs(metadata);
      setSelectedPair(metadata[0]?.pair_address || '');
      // setSelectedToken0(metadata[0]?.token0_symbol || '');
      // setSelectedToken1(metadata[0]?.token1_symbol || '');
    } catch (err) {
      // setError('Failed to fetch protocol metadata');
      setProtocolPairs([]);
    }
  }, [selectedBlockchain, selectedProtocol]);

  // Fetch Pool Metrics
  const fetchPoolMetrics = useCallback(async () => {
    if (!selectedBlockchain || !selectedPair) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/get_dex_pool_metrics`, {
        params: { 
          blockchain: selectedBlockchain, 
          pair_address: selectedPair 
        }
      });
      
      const metrics = response.data.data[0];
      // console.log(response.data.data)
      setPoolMetrics(metrics);

      // Generate Price History Data
      const priceHistoryData = [
        { 
          period: 'Token0 Price', 
          value: metrics.token0_price,
          color: '#10B981' 
        },
        { 
          period: 'Token1 Price', 
          value: metrics.token1_price,
          color: '#3B82F6' 
        }
      ];
      setTokenPriceHistory(priceHistoryData);
      console.log(protocolPairs);
      console.log(metrics);
      // Liquidity Distribution
      const liquidityData = [
        { 
          name: metrics.token0_symbol || 'Token 0', 
          value: metrics.token0_tvl,
          color: '#10B981' 
        },
        { 
          name: metrics.token1_symbol || 'Token 1', 
          value: metrics.token1_tvl,
          color: '#3B82F6' 
        }
      ];
      setLiquidityDistribution(liquidityData);

      // Transaction Trends
      const transactionData = [
        { 
          period: '24h', 
          transactions: metrics.transactions_24hrs,
          color: '#8B5CF6' 
        },
        { 
          period: '7d', 
          transactions: metrics.transactions_7d,
          color: '#EC4899' 
        },
        { 
          period: '30d', 
          transactions: metrics.transactions_30d,
          color: '#F43F5E' 
        }
      ];
      setTransactionTrends(transactionData);

    } catch (err) {
      // setError('Failed to fetch pool metrics');
      setPoolMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [selectedBlockchain, selectedPair]);

  // Side Effects
  useEffect(() => {
    fetchProtocols();
  }, [selectedBlockchain, fetchProtocols]);

  useEffect(() => {
    fetchProtocolMetadata();
  }, [selectedBlockchain, selectedProtocol, fetchProtocolMetadata]);

  useEffect(() => {
    fetchPoolMetrics();
  }, [selectedPair, fetchPoolMetrics]);

  const renderMetricCard = (icon, label, value) => (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 p-4 rounded-lg flex items-center space-x-4"
    >
      {icon}
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-xl font-bold text-violet-400">{value}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black p-20 mt-1">
      {/* Gradient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
            DeFi Protocol Analytics
          </h1>
          <p className="text-gray-400">Explore real-time insights across blockchain ecosystems</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <select 
            value={selectedBlockchain}
            onChange={(e) => setSelectedBlockchain(e.target.value)}
            className="bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 text-white p-3 rounded-lg"
          >
            {blockchains.map(blockchain => (
              <option key={blockchain} value={blockchain}>
                {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)}
              </option>
            ))}
          </select>

          <select 
            value={selectedProtocol?.protocol || ''}
            onChange={(e) => {
              const selected = protocols.find(p => p.protocol === e.target.value);
              setSelectedProtocol(selected);
            }}
            className="bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 text-white p-3 rounded-lg"
            disabled={protocols.length === 0}
          >
            {protocols.map((protocol) => (
              <option key={protocol.protocol} value={protocol.protocol}>
                {protocol.protocol}
              </option>
            ))}
          </select>

          <select 
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 text-white p-3 rounded-lg"
            disabled={protocolPairs.length === 0}
          >
            {protocolPairs.map(pair => (
              <option 
                key={pair.pair_address} 
                value={pair.pair_address}
              >
                {pair.token0_symbol && pair.token1_symbol 
                  ? `${pair.token0_symbol}/${pair.token1_symbol}` 
                  : 'Select Pair'}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Error & Loading States */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-600/20 text-red-400 p-4 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        {loading && (
          <div className="text-center text-violet-400 p-8">
            Loading analytics...
          </div>
        )}

        {/* Metrics & Charts */}
        {poolMetrics && !loading && (
          <>
            {/* Key Metrics Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-4 mb-8"
            >
              {[
                { 
                  icon: <Database className="text-violet-500" />, 
                  label: 'Total Value Locked in Million', 
                  value: formatCurrency(poolMetrics.total_tvl)
                },
                { 
                  icon: <TrendingUp className="text-green-500" />, 
                  label: 'All-Time Volume', 
                  value: formatCurrency(poolMetrics.volume_all) 
                },
                { 
                  icon: <ShieldCheck className="text-blue-500" />, 
                  label: 'Total Transactions', 
                  value: poolMetrics.transactions_all || 0 
                },
                { 
                  icon: <Activity className="text-pink-500" />, 
                  label: '30d Volume', 
                  value: formatCurrency(poolMetrics.volume_30d) 
                }
              ].map((metric, index) => (
                renderMetricCard(metric.icon, metric.label, metric.value)
              ))}
            </motion.div>

            {/* Advanced Charts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-8"
            >
              {/* Token Prices */}
              <Card glowing className="p-6">
                <h3 className="text-xl font-bold mb-4 text-violet-400">Token Prices</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tokenPriceHistory}>
                    <XAxis dataKey="period" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Bar dataKey="value" fill={(entry) => entry.color}>
                      {tokenPriceHistory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Liquidity Distribution */}
              <Card glowing className="p-6">
                <h3 className="text-xl font-bold mb-4 text-violet-400">Liquidity Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={liquidityDistribution} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      label
                    >
                      {liquidityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Transaction Trends */}
              <Card glowing className="p-6">
                <h3 className="text-xl font-bold mb-4 text-violet-400">Transaction Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={transactionTrends}>
                    <XAxis dataKey="period" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Bar dataKey="transactions" fill={(entry) => entry.color}>
                      {transactionTrends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Additional Token Details */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="grid grid-cols-2 gap-8 mt-8"
>
  <Card glowing className="p-6">
    <h3 className="text-xl font-bold mb-4 text-violet-400">Token 0: Details</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-400">Token Symbol</span>
        <span className="font-semibold">{poolMetrics.token0_symbol || 'Token 0'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Current Price</span>
        <span className="font-semibold">{formatCurrency(poolMetrics.token0_price)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Reserve</span>
        <span className="font-semibold">{poolMetrics.token0_reserve.toFixed(6)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Share</span>
        <span className="font-semibold">{formatPercentage(poolMetrics.token0_share)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Total Value Locked</span>
        <span className="font-semibold">{formatCurrency(poolMetrics.token0_tvl)}</span>
      </div>
    </div>
  </Card>

  <Card glowing className="p-6">
    <h3 className="text-xl font-bold mb-4 text-violet-400">Token 1: Details</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-400">Token Symbol</span>
        <span className="font-semibold">{poolMetrics.token1_symbol || 'Token 1'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Current Price</span>
        <span className="font-semibold">{formatCurrency(poolMetrics.token1_price)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Reserve</span>
        <span className="font-semibold">{poolMetrics.token1_reserve.toFixed(6)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Share</span>
        <span className="font-semibold">{formatPercentage(poolMetrics.token1_share)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Total Value Locked</span>
        <span className="font-semibold">{formatCurrency(poolMetrics.token1_tvl)}</span>
      </div>
    </div>
  </Card>
</motion.div>
</>
)}
</div>
</div>
);
};

export default ProtocolDashboard;
            