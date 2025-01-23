import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Brain,
  TrendingUp,
  ArrowRight,
  BarChart2,
  Cpu,
  Target,
  PieChart
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const FeatureCard = ({ icon: Icon, title, description, techDetail }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative"
  >
    <Card glowing className="h-full">
      <div className="relative z-10 space-y-4">
        <Icon className="w-8 h-8 text-violet-500" />
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-400">{description}</p>
        <div className="pt-2 border-t border-gray-800">
          <p className="text-sm text-violet-400">{techDetail}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const StatCard = ({ value, label, description }) => (
  <div className="text-center p-6">
    <h4 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text mb-2">
      {value}
    </h4>
    <p className="text-white font-medium mb-2">{label}</p>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze real-time DeFi data to identify optimal investment opportunities and strategies.",
      techDetail: "Neural networks trained on bitsCrunch historical data"
    },
    {
      icon: Target,
      title: "Risk-Adjusted Strategies",
      description: "Personalized investment strategies based on your risk tolerance and market conditions, with automated rebalancing.",
      techDetail: "Dynamic portfolio optimization algorithms"
    },
    {
      icon: BarChart2,
      title: "Real-Time Analytics",
      description: "Comprehensive market analysis with real-time insights from multiple DeFi protocols and liquidity pools.",
      techDetail: "Integration with bitsCrunch's advanced DeFi APIs"
    },
    {
      icon: Cpu,
      title: "Smart Contract Automation",
      description: "Automated strategy execution with secure smart contracts for efficient portfolio management.",
      techDetail: "Audited smart contract infrastructure"
    }
  ];

  const stats = [
    {
      value: "$2.8B",
      label: "Total Value Optimized",
      description: "Assets under optimization"
    },
    {
      value: "+32%",
      label: "Average APY Increase",
      description: "Compared to manual strategies"
    },
    {
      value: "< 0.5%",
      label: "Maximum Drawdown",
      description: "Historical risk management"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative pt-32 pb-20 px-4">
        {/* Gradient Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center items-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-16 h-16 text-violet-500" />
              </motion.div>
            </div>

            <h1 className="text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
                Optimize Your DeFi
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-transparent bg-clip-text">
                With AI Intelligence
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Harness the power of artificial intelligence to maximize your DeFi returns. 
              Our platform analyzes market data in real-time to provide optimized investment 
              strategies tailored to your goals.
            </p>

            <div className="flex justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => navigate('/chat')} className="group">
                  <span>Start Optimizing</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  variant="secondary"
                  className="group border border-violet-500/20 hover:border-violet-500/50"
                >
                  <span>View Protocols</span>
                  <PieChart className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 mb-32"
          >
            <Card glowing className="border border-violet-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 text-center">
                <div>
                  <p className="text-violet-400 font-medium">Real-Time Analysis</p>
                  <p className="text-gray-400 mt-1">Continuous market monitoring</p>
                </div>
                <div>
                  <p className="text-violet-400 font-medium">Smart Automation</p>
                  <p className="text-gray-400 mt-1">Automated strategy execution</p>
                </div>
                <div>
                  <p className="text-violet-400 font-medium">Risk Management</p>
                  <p className="text-gray-400 mt-1">Advanced risk mitigation</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>

          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card glowing className="border border-violet-500/20">
              <h3 className="text-2xl font-bold text-center pt-8 mb-8">
                Platform Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;