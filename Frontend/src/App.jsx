import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from "./components/Web3Provider";
import { Landing } from './components/Landing';
import { Navbar } from './components/Navbar';
import { ReputationDashboard } from './components/ReputationDashboard';
import ProtocolDashboard from './components/ProtocolDashboard';
import DeFiChatTerminal from './components/DeFiChatTerminal';

const App = () => {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-background text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/reputation" element={<ReputationDashboard />} />
            <Route path="/dashboard" element={<ProtocolDashboard />} />
            <Route path="/chat" element={<DeFiChatTerminal />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
};

export default App;