import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDayByNumber } from '@/services/database';
import { ArrowLeft, Sparkles, MapPin, Gift } from 'lucide-react';

const DayPage = () => {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();

  const day = dayNumber ? parseInt(dayNumber) : null;

  const { data: adventDay, isLoading, error } = useQuery({
    queryKey: ['day', day],
    queryFn: () => day ? getDayByNumber(day) : null,
    enabled: !!day && day >= 1 && day <= 31,
  });

  // Check if it's December and the day is valid
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDayOfMonth = currentDate.getDate();
  const isDecember = currentMonth === 12;

  // Allow access if it's December and the day is today or earlier, or if it's not December (for testing)
  const isAccessible = !isDecember || (day && day <= currentDayOfMonth);

  if (!day || day < 1 || day > 31) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl text-white mb-4">Invalid Quest Day</h2>
            <p className="text-white/80 mb-6">The day you're seeking doesn't exist in this magical realm.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  if (error || !adventDay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl text-white mb-4">Quest Not Found</h2>
            <p className="text-white/80 mb-6">This day's magic hasn't been prepared yet.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAccessible) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl max-w-md">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl text-white mb-4">The Magic is Locked</h2>
              <p className="text-white/80 mb-6">
                This quest hasn't been unlocked yet. The December spirits will reveal it in due time.
              </p>
              <div className="text-sm text-white/60 mb-4">
                Available on December {day}
              </div>
              <Button onClick={() => navigate('/')} variant="outline">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-yellow-400">
              <Sparkles className="w-6 h-6" />
              <span className="text-2xl font-bold">Day {adventDay.day}</span>
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-white/60 text-sm">December {adventDay.day}</p>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {/* Main Quest Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl overflow-hidden">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  🌟
                </motion.div>
              </div>
              <CardTitle className="text-3xl md:text-4xl text-white font-bold">
                Your Daily Quest
              </CardTitle>
              <p className="text-white/80 text-lg italic">
                December {adventDay.day} Revelation
              </p>
            </CardHeader>

            <CardContent className="space-y-8 p-8">
              {/* Magical Message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-white/10"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  Magical Message
                </h3>
                <p className="text-white/90 leading-relaxed text-lg italic">
                  {adventDay.message}
                </p>
              </motion.div>

              {/* Treasure Clue */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-6 border border-white/10"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-400" />
                  Treasure Clue
                </h3>
                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <p className="text-white/90 leading-relaxed text-lg font-medium">
                    {adventDay.clue}
                  </p>
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <Gift className="w-12 h-12 text-pink-400 animate-bounce" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Your Quest Begins Now!
                </h3>
                <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                  Follow this mystical clue to find your hidden gift. May the December spirits
                  guide your steps and fill your heart with wonder and joy.
                </p>
                <div className="flex justify-center space-x-4 text-yellow-400">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    🌟
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    ✨
                  </motion.span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-8 text-white/60"
        >
          <p>December Quest • A magical journey of love and discovery</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DayPage;
