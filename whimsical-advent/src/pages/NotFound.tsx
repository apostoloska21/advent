import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🌌
            </motion.div>

            <h1 className="text-4xl font-bold text-white mb-4">
              Lost in Magic
            </h1>

            <p className="text-white/80 mb-6 leading-relaxed">
              You've wandered into an unknown realm of the December quest.
              The path you're seeking doesn't exist in this enchanted forest.
            </p>

            <div className="flex justify-center space-x-2 mb-6">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-yellow-400 text-2xl"
              >
                ✨
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="text-pink-400 text-2xl"
              >
                🌟
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                className="text-purple-400 text-2xl"
              >
                ✨
              </motion.span>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to the Quest
            </Button>

            <p className="text-white/60 text-sm mt-4">
              May the December spirits guide you safely home
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
