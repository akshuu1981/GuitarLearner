import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Clock, Award, Target, Music, Zap, ChartBar as BarChart3, Trophy, Star } from 'lucide-react-native';
import { useUserStats, usePracticeHistory, useProgress } from '@/hooks/useProgress';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';

const HEADER_HEIGHT = 140;

const StatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}) => (
  <View style={styles.statCard}>
    <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
      {icon}
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
);

const ProgressBar = ({ 
  progress, 
  color, 
  height = 8 
}: { 
  progress: number;
  color: string;
  height?: number;
}) => (
  <View style={[styles.progressBarContainer, { height }]}>
    <View 
      style={[
        styles.progressBarFill, 
        { 
          width: `${Math.min(100, Math.max(0, progress))}%`,
          backgroundColor: color,
          height
        }
      ]} 
    />
  </View>
);

const CategoryProgress = ({ 
  category, 
  icon, 
  color, 
  completed, 
  total 
}: {
  category: string;
  icon: React.ReactNode;
  color: string;
  completed: number;
  total: number;
}) => {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: `${color}20` }]}>
          {icon}
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <Text style={styles.categoryStats}>{completed} of {total} completed</Text>
        </View>
        <Text style={[styles.categoryPercentage, { color }]}>
          {Math.round(progress)}%
        </Text>
      </View>
      <ProgressBar progress={progress} color={color} />
    </View>
  );
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  
  return date.toLocaleDateString();
};

export default function ProgressTab() {
  const { stats, loading: statsLoading } = useUserStats();
  const { history, loading: historyLoading } = usePracticeHistory(7);
  const { progress: chordsProgress } = useProgress('chords');
  const { progress: scalesProgress } = useProgress('scales');
  const { progress: exercisesProgress } = useProgress('exercises');
  const { progress: lessonsProgress } = useProgress('lessons');
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // Calculate category totals (these would normally come from your data)
  const categoryTotals = {
    chords: 20, // Total number of chords to learn
    scales: 16, // Total number of scales
    exercises: 12, // Total number of exercises
    lessons: 10 // Total number of lessons
  };

  const completedCounts = {
    chords: chordsProgress.filter(p => p.completed).length,
    scales: scalesProgress.filter(p => p.completed).length,
    exercises: exercisesProgress.filter(p => p.completed).length,
    lessons: lessonsProgress.filter(p => p.completed).length
  };

  // Calculate weekly practice data
  const weeklyPracticeData = history.reduce((acc, session) => {
    const date = new Date(session.date).toDateString();
    acc[date] = (acc[date] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);

  const thisWeekTotal = Object.values(weeklyPracticeData).reduce((sum, duration) => sum + duration, 0);

  if (statsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <LinearGradient
          colors={['#7c3aed', '#3730a3']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>Track your guitar learning journey</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Level and Experience */}
        <View style={styles.levelSection}>
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View style={styles.levelBadge}>
                <Star size={24} color="#fbbf24" />
                <Text style={styles.levelNumber}>Level {stats?.level || 1}</Text>
              </View>
              <Text style={styles.experienceText}>
                {stats?.experience || 0} XP
              </Text>
            </View>
            <View style={styles.experienceBar}>
              <ProgressBar 
                progress={((stats?.experience || 0) % 1000) / 10} 
                color="#fbbf24" 
                height={12}
              />
              <Text style={styles.experienceLabel}>
                {(stats?.experience || 0) % 1000} / 1000 XP to next level
              </Text>
            </View>
          </View>
        </View>

        {/* Key Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Clock size={24} color="#3b82f6" />}
              title="Practice Time"
              value={formatTime(stats?.totalPracticeTime || 0)}
              subtitle="Total"
              color="#3b82f6"
            />
            <StatCard
              icon={<Calendar size={24} color="#10b981" />}
              title="Current Streak"
              value={stats?.currentStreak || 0}
              subtitle="Days"
              color="#10b981"
            />
            <StatCard
              icon={<Trophy size={24} color="#f59e0b" />}
              title="Best Streak"
              value={stats?.longestStreak || 0}
              subtitle="Days"
              color="#f59e0b"
            />
            <StatCard
              icon={<TrendingUp size={24} color="#8b5cf6" />}
              title="This Week"
              value={formatTime(thisWeekTotal)}
              subtitle="Practice"
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* Category Progress */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.categoriesList}>
            <CategoryProgress
              category="Chords"
              icon={<Music size={20} color="#f97316" />}
              color="#f97316"
              completed={completedCounts.chords}
              total={categoryTotals.chords}
            />
            <CategoryProgress
              category="Scales"
              icon={<BarChart3 size={20} color="#3b82f6" />}
              color="#3b82f6"
              completed={completedCounts.scales}
              total={categoryTotals.scales}
            />
            <CategoryProgress
              category="Exercises"
              icon={<Zap size={20} color="#dc2626" />}
              color="#dc2626"
              completed={completedCounts.exercises}
              total={categoryTotals.exercises}
            />
            <CategoryProgress
              category="Lessons"
              icon={<Target size={20} color="#7c3aed" />}
              color="#7c3aed"
              completed={completedCounts.lessons}
              total={categoryTotals.lessons}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {history.length > 0 ? (
            <View style={styles.activityList}>
              {history.slice(0, 5).map((session, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    {session.category === 'chords' && <Music size={16} color="#f97316" />}
                    {session.category === 'scales' && <BarChart3 size={16} color="#3b82f6" />}
                    {session.category === 'exercises' && <Zap size={16} color="#dc2626" />}
                    {session.category === 'lessons' && <Target size={16} color="#7c3aed" />}
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{session.itemName}</Text>
                    <Text style={styles.activitySubtitle}>
                      {formatTime(session.duration)} • {formatDate(session.date)}
                    </Text>
                  </View>
                  <View style={styles.activityBadge}>
                    <Text style={styles.activityCategory}>
                      {session.category.charAt(0).toUpperCase() + session.category.slice(1)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No practice sessions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start practicing to see your activity here
              </Text>
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={[
              styles.achievementCard,
              (stats?.currentStreak || 0) >= 7 && styles.achievementUnlocked
            ]}>
              <Award size={24} color={(stats?.currentStreak || 0) >= 7 ? "#fbbf24" : "#64748b"} />
              <Text style={[
                styles.achievementTitle,
                (stats?.currentStreak || 0) >= 7 && styles.achievementTitleUnlocked
              ]}>
                Week Warrior
              </Text>
              <Text style={styles.achievementDescription}>
                Practice for 7 days in a row
              </Text>
            </View>
            
            <View style={[
              styles.achievementCard,
              (stats?.totalPracticeTime || 0) >= 3600 && styles.achievementUnlocked
            ]}>
              <Clock size={24} color={(stats?.totalPracticeTime || 0) >= 3600 ? "#fbbf24" : "#64748b"} />
              <Text style={[
                styles.achievementTitle,
                (stats?.totalPracticeTime || 0) >= 3600 && styles.achievementTitleUnlocked
              ]}>
                Hour Master
              </Text>
              <Text style={styles.achievementDescription}>
                Practice for 1 hour total
              </Text>
            </View>
            
            <View style={[
              styles.achievementCard,
              completedCounts.chords >= 5 && styles.achievementUnlocked
            ]}>
              <Music size={24} color={completedCounts.chords >= 5 ? "#fbbf24" : "#64748b"} />
              <Text style={[
                styles.achievementTitle,
                completedCounts.chords >= 5 && styles.achievementTitleUnlocked
              ]}>
                Chord Champion
              </Text>
              <Text style={styles.achievementDescription}>
                Learn 5 different chords
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: HEADER_HEIGHT,
  },
  header: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  levelSection: {
    marginBottom: 32,
  },
  levelCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf2420',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginLeft: 8,
  },
  experienceText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  experienceBar: {
    marginTop: 8,
  },
  experienceLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesList: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryStats: {
    fontSize: 14,
    color: '#94a3b8',
  },
  categoryPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    borderRadius: 4,
  },
  activitySection: {
    marginBottom: 32,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  activityBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityCategory: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyState: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  achievementUnlocked: {
    borderColor: '#fbbf24',
    backgroundColor: '#fbbf2410',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementTitleUnlocked: {
    color: '#ffffff',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});