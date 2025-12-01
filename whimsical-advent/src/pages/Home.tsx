import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Heart, Eye, Gift, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDays, createDay } from '@/services/database';
import { adventDaysData } from '@/data/seedData';

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;

  // Only show advent calendar in December
  const isDecember = currentMonth === 12;
  const isValidDay = currentDay >= 1 && currentDay <= 31;

  // TEMPORARY: Force December mode for testing - set to false for production
  const forceDecember = false; // Set to false to disable testing mode
  const effectiveIsDecember = forceDecember || isDecember;

  // Get all advent days for hidden gifts section
  const { data: allDays = [] } = useQuery({
    queryKey: ['allDays'],
    queryFn: getAllDays,
    enabled: effectiveIsDecember,
  });

  // Filter accessible days (in December and up to current day, or all if not December for testing)
  const accessibleDays = allDays.filter(day =>
    !effectiveIsDecember || day.day <= currentDay
  );

  console.log('Home Debug - Current Date:', currentDate.toISOString());
  console.log('Home Debug - currentDay:', currentDay, 'currentMonth:', currentMonth);
  console.log('Home Debug - isDecember:', isDecember, 'effectiveIsDecember:', effectiveIsDecember);
  console.log('Home Debug - allDays length:', allDays.length, 'accessibleDays length:', accessibleDays.length);

  // Mutation to seed database
  const seedMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting database seeding...');
      console.log('adventDaysData length:', adventDaysData.length);
      for (const dayData of adventDaysData) {
        console.log(`Creating day ${dayData.day}...`);
        const result = await createDay({
          ...dayData,
          isActive: false
        });
        console.log(`Created day ${dayData.day} with ID:`, result.id);
      }
      console.log('Database seeding completed!');
      return true;
    },
    onSuccess: () => {
      console.log('Mutation onSuccess - invalidating cache...');
      // Invalidate and refetch all days query
      queryClient.invalidateQueries({ queryKey: ['allDays'] });
    },
    onError: (error) => {
      console.error('Error seeding database:', error);
    }
  });

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
              {allDays.length === 0 ? (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">🌱</div>
                  <h2 className="text-3xl font-semibold text-white mb-4">
                    Preparing the Magical Realm
                  </h2>
                  <p className="text-lg text-white/90 leading-relaxed mb-6">
                    The advent calendar needs to be seeded with magical content before we can begin our journey.
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => seedMutation.mutate()}
                      disabled={seedMutation.isPending}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
                    >
                      {seedMutation.isPending ? '🌱 Seeding Database...' : '🌟 Seed Database'}
                    </Button>

                    {allDays.length > 0 && (
                      <Button
                        onClick={() => navigate('/day/1')}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
                      >
                        🧪 Test Day 1 (Data exists: {allDays.length} days)
                      </Button>
                    )}
                  </div>
                  {seedMutation.isError && (
                    <p className="text-red-400 text-sm mt-2">
                      Error seeding database. Please try again.
                    </p>
                  )}
                </div>
              ) : effectiveIsDecember && isValidDay ? (
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

                  <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                    <p className="text-white/80 text-center">
                      <span className="text-yellow-400 font-semibold">Today is December {currentDay}</span>
                      <br />
                      <span className="text-sm text-white/60">Your magical revelation awaits...</span>
                    </p>
                  </div>

                  {/* View Today's Message Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mb-6"
                  >
                    <Button
                      onClick={() => navigate(`/day/${currentDay}`)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      View Today's Message (Day {currentDay})
                    </Button>
                    <p className="text-sm text-white/60 mt-2">
                      Can't wait for the email? See today's magical revelation now!
                    </p>
                  </motion.div>

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

                  {/* Hidden Gifts Section */}
                  {accessibleDays.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="mt-8"
                    >
                      <Card className="bg-white/5 backdrop-blur-sm border-white/20">
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-2xl text-white flex items-center justify-center">
                            <Gift className="w-6 h-6 mr-2 text-pink-400" />
                            Hidden Gifts Discovered
                          </CardTitle>
                          <p className="text-white/70 text-sm">
                            Magical treasures you've uncovered so far
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {accessibleDays.map((day, index) => (
                              <motion.div
                                key={day.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                                onClick={() => navigate(`/day/${day.day}`)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center text-yellow-400">
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    <span className="font-semibold">Day {day.day}</span>
                                  </div>
                                  <MapPin className="w-4 h-4 text-red-400" />
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed">
                                  {day.clue}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <div className="text-center mt-6">
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
