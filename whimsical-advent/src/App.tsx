import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/pages/Home';
import DayPage from '@/pages/DayPage';
import NotFound from '@/pages/NotFound';
import '@/App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/day/:dayNumber" element={<DayPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
