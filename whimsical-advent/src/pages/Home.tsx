import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Calendar, Heart } from 'lucide-react';

const Home = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;

  // Only show advent calendar in December
  const isDecember = currentMonth === 12;
  const isValidDay = currentDay >= 1 && currentDay <= 31;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl mx-auto px-4"
      >
        {/* Magical Header */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            December Quest
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light italic">
            A Magical Adventure Awaits
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              {isDecember && isValidDay ? (
                <div className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <Calendar className="w-12 h-12 text-blue-400" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                    Welcome, Dear Wanderer
                  </h2>

                  <p className="text-lg text-white/90 leading-relaxed mb-6">
                    The ancient December spirits have prepared a magical quest just for you.
                    Each morning, a mysterious email will arrive with an enchanted QR code
                    that unlocks today's hidden treasure.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm"
                    >
                      <div className="text-2xl mb-2">📧</div>
                      <h3 className="text-lg font-semibold text-white mb-2">Daily Emails</h3>
                      <p className="text-sm text-white/70">Receive magical messages every morning</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm"
                    >
                      <div className="text-2xl mb-2">🔮</div>
                      <h3 className="text-lg font-semibold text-white mb-2">QR Codes</h3>
                      <p className="text-sm text-white/70">Scan to unlock daily revelations</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm"
                    >
                      <div className="text-2xl mb-2">🎁</div>
                      <h3 className="text-lg font-semibold text-white mb-2">Hidden Gifts</h3>
                      <p className="text-sm text-white/70">Follow clues to find your treasures</p>
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <p className="text-white/80 mb-4">
                      Your quest begins tomorrow. The first magical email will arrive soon...
                    </p>
                    <div className="flex justify-center items-center space-x-2 text-pink-400">
                      <Heart className="w-5 h-5 animate-pulse" />
                      <span className="text-sm font-medium">With love and magic</span>
                      <Heart className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">⏰</div>
                  <h2 className="text-3xl font-semibold text-white mb-4">
                    The Magic Hasn't Begun Yet
                  </h2>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Dear adventurer, the December quest begins on the 1st of December.
                    Please return then to start your magical journey through the month.
                  </p>
                  <div className="text-white/60 text-sm">
                    Current date: {currentDate.toLocaleDateString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Floating magical elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 text-yellow-400/30 text-4xl"
        >
          ✨
        </motion.div>

        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 text-pink-400/30 text-4xl"
        >
          🌟
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
