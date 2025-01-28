import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, 
  RefreshCw, 
  Terminal, 
  Trash2,
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Loader
} from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

// Loading states for better UX
const LOADING_STATES = [
  { message: "Processing your prompt...", duration: 1000 },
  { message: "Feeding prompt to Cohere RAG model...", duration: 1500 },
  { message: "Analyzing DeFi protocols...", duration: 2000 },
  { message: "Generating comprehensive response...", duration: 1500 }
];

const DeFiResponseRenderer = ({ response }) => {
  const data = typeof response === 'string' ? JSON.parse(response) : response;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-white space-y-4 p-4 bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 rounded-lg"
    >
      {/* Protocol Header */}
      <div className="flex items-center space-x-3 border-b border-violet-500/30 pb-3">
        <CheckCircle className="w-6 h-6 text-violet-500" />
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
            {data.protocol_name} Cross-Chain Transfer Guide
          </h2>
          <p className="text-sm text-gray-300">{data.protocol_description}</p>
        </div>
        {data.protocol_link && (
          <a 
            href={data.protocol_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-auto hover:bg-violet-500/20 p-2 rounded-full transition"
          >
            <ExternalLink className="w-5 h-5 text-violet-400" />
          </a>
        )}
      </div>

      {/* Step-by-Step Guide */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-violet-300">
          📍 Step-by-Step Transfer Process
        </h3>
        {data.protocol_steps.map((step, index) => (
          <motion.div 
            key={step.step_number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/60 backdrop-blur-sm p-3 rounded-lg border border-violet-500/20"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-violet-500 text-white px-2 py-1 rounded-full text-xs">
                Step {step.step_number}
              </span>
              <span className="text-sm text-gray-400">
                ⏱️ {step.estimated_time}
              </span>
            </div>
            <p className="text-gray-100">{step.description}</p>
            {step.potential_fees && (
              <div className="mt-2 text-sm text-violet-300">
                💸 Potential Fees: {step.potential_fees}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 p-3 rounded-lg"
        >
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-violet-500" />
            <h4 className="font-semibold text-violet-300">Benefits</h4>
          </div>
          <p className="text-gray-100">{data.overall_benefit}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 p-3 rounded-lg"
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-violet-500" />
            <h4 className="font-semibold text-violet-300">Risks</h4>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-100">
            {data.risks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Additional Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 p-3 rounded-lg"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-5 h-5 text-violet-500" />
          <h4 className="font-semibold text-violet-300">Additional Information</h4>
        </div>
        <div className="space-y-2">
          <p className="text-gray-100">{data.estimated_slippage}</p>
          <div className="mt-2">
            <h5 className="text-violet-300 mb-1">Alternative Protocols:</h5>
            <ul className="list-disc list-inside text-gray-100">
              {data.alternative_protocols.map((protocol, index) => (
                <li key={index}>{protocol}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DeFiChatTerminal = () => {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'Welcome to DeFi Optimizer Chat. Ask me anything about DeFi protocols and cross-chain transfers!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Loading state animation
  useEffect(() => {
    let timeout;
    if (loading && loadingState < LOADING_STATES.length - 1) {
      timeout = setTimeout(() => {
        setLoadingState(prev => prev + 1);
      }, LOADING_STATES[loadingState].duration);
    }
    return () => clearTimeout(timeout);
  }, [loading, loadingState]);

  const handleClearChat = () => {
    setMessages([{
      type: 'system',
      content: 'Chat cleared. Ask me anything about DeFi protocols and cross-chain transfers!'
    }]);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setLoadingState(0);

    try {
      const response = await axios.post('http://localhost:8000/stream_rag_output', {
        prompt: input
      });

      let formattedResponse;
      if (typeof response.data === 'string') {
        const cleanedData = response.data
          .replace(/^```json\s*/, '')
          .replace(/```\s*$/, '')
          .trim();
        
        try {
          formattedResponse = JSON.parse(cleanedData);
        } catch (parseError) {
          formattedResponse = {
            protocol_name: "Error parsing response",
            protocol_description: "Unable to parse the API response",
            protocol_steps: [],
            risks: ["Response parsing failed"],
            alternative_protocols: []
          };
        }
      } else {
        formattedResponse = response.data;
      }
      
      setMessages(prev => [...prev, { type: 'ai', content: formattedResponse }]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { type: 'error', content: error.message || 'Something went wrong' }
      ]);
    } finally {
      setLoading(false);
      setLoadingState(0);
    }
  };

  const renderMessage = (message) => {
    switch (message.type) {
      case 'system':
        return (
          <div className="text-violet-400 italic bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg border border-violet-500/20">
            🤖 {message.content}
          </div>
        );
      case 'user':
        return (
          <div className="bg-violet-500/10 p-4 rounded-lg border border-violet-500/20">
            <span className="text-violet-300 font-semibold">You: </span>
            <span className="text-gray-100">{message.content}</span>
          </div>
        );
      case 'ai':
        return <DeFiResponseRenderer response={message.content} />;
      case 'error':
        return (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
            ❌ {message.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black p-20 mt-1">
      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Terminal className="w-6 h-6 mr-2 text-violet-500" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
              DeFi Optimizer Terminal
            </h2>
          </div>
          <Button
            onClick={handleClearChat}
            className="bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 text-violet-400 hover:bg-violet-500/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto mb-4 bg-gray-900/50 backdrop-blur-sm border border-violet-500/20 rounded-lg p-4 space-y-4 min-h-[600px] max-h-[600px]">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderMessage(message)}
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg border border-violet-500/20"
              >
                <div className="flex items-center space-x-3">
                  <Loader className="w-5 h-5 text-violet-500 animate-spin" />
                  <span className="text-violet-400">
                    {LOADING_STATES[loadingState].message}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about DeFi protocols..."
            className="flex-grow bg-gray-800/60 backdrop-blur-sm border border-violet-500/20 text-violet-100 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-violet-400/50"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-violet-500 hover:bg-violet-600 text-white p-4 rounded-lg"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DeFiChatTerminal;