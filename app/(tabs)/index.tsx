import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import { Play, Clock, Target, Award } from 'lucide-react-native';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';

const learningTopics = [
  {
    id: 1,
    title: 'Holding the Guitar',
    description: 'Learn proper posture and guitar positioning',
    duration: '5 min',
    difficulty: 'Beginner',
    icon: <Target size={24} color="#f97316" />,
  },
  {
    id: 2,
    title: 'Reading Chord Diagrams',
    description: 'Understand fret positions and finger placement',
    duration: '8 min',
    difficulty: 'Beginner',
    icon: <Play size={24} color="#f97316" />,
  },
  {
    id: 3,
    title: 'Tuning Your Guitar',
    description: 'Standard tuning and using a tuner',
    duration: '6 min',
    difficulty: 'Beginner',
    icon: <Clock size={24} color="#f97316" />,
  },
  {
    id: 4,
    title: 'Basic Picking Technique',
    description: 'Develop proper pick holding and motion',
    duration: '10 min',
    difficulty: 'Beginner',
    icon: <Award size={24} color="#f97316" />,
  },
  {
    id: 5,
    title: 'Fretting Hand Position',
    description: 'Proper thumb placement and finger curvature',
    duration: '7 min',
    difficulty: 'Beginner',
    icon: <Target size={24} color="#f97316" />,
  },
  {
    id: 6,
    title: 'String Names & Numbers',
    description: 'Learn the six strings from low E to high E',
    duration: '4 min',
    difficulty: 'Beginner',
    icon: <Play size={24} color="#f97316" />,
  },
];

const HEADER_HEIGHT = 120;

export default function LearnTab() {
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

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <LinearGradient
          colors={['#1e3a8a', '#3730a3']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Guitar Basics</Text>
          <Text style={styles.headerSubtitle}>Master the fundamentals</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView 
        style={[styles.scrollView, contentAnimatedStyle]}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>Beginner Level</Text>
                <Text style={styles.progressSubtext}>3 of 6 lessons completed</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '50%' }]} />
              </View>
            </View>
          </View>

          <View style={styles.lessonsSection}>
            <Text style={styles.sectionTitle}>Learning Path</Text>
            {learningTopics.map((topic, index) => (
              <TouchableOpacity key={topic.id} style={styles.lessonCard}>
                <View style={styles.lessonIcon}>
                  {topic.icon}
                </View>
                <View style={styles.lessonContent}>
                  <Text style={styles.lessonTitle}>{topic.title}</Text>
                  <Text style={styles.lessonDescription}>{topic.description}</Text>
                  <View style={styles.lessonMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={14} color="#64748b" />
                      <Text style={styles.metaText}>{topic.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Award size={14} color="#64748b" />
                      <Text style={styles.metaText}>{topic.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
    paddingTop: HEADER_HEIGHT,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 20,
  },
  progressSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressInfo: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
    borderRadius: 4,
  },
  lessonsSection: {
    marginBottom: 32,
  },
  lessonCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f9731620',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
    lineHeight: 20,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});