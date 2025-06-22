import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Play, Pause, Timer, Target, TrendingUp } from 'lucide-react-native';

const exercises = [
  {
    id: 1,
    name: 'Spider Crawl Basic',
    difficulty: 'Beginner',
    duration: '5 min',
    description: 'Classic finger independence exercise',
    instructions: [
      'Place fingers 1-2-3-4 on frets 1-2-3-4 of the low E string',
      'Play each note cleanly, one at a time',
      'Move to the next string and repeat',
      'Keep all fingers close to the fretboard'
    ],
    pattern: '1-2-3-4',
    tempo: '60 BPM',
  },
  {
    id: 2,
    name: 'Spider Crawl Reverse',
    difficulty: 'Beginner',
    duration: '5 min',
    description: 'Backward spider crawl for coordination',
    instructions: [
      'Start with fingers 4-3-2-1 on frets 4-3-2-1',
      'Play each note descending',
      'Focus on clean note separation',
      'Maintain steady tempo'
    ],
    pattern: '4-3-2-1',
    tempo: '60 BPM',
  },
  {
    id: 3,
    name: 'Spider Crawl Skip',
    difficulty: 'Intermediate',
    duration: '7 min',
    description: 'Advanced pattern with finger skipping',
    instructions: [
      'Play pattern 1-3-2-4 on each string',
      'Focus on smooth finger transitions',
      'Keep unused fingers close to fretboard',
      'Gradually increase tempo'
    ],
    pattern: '1-3-2-4',
    tempo: '80 BPM',
  },
  {
    id: 4,
    name: 'Chromatic Scale Run',
    difficulty: 'Intermediate',
    duration: '8 min',
    description: 'Full chromatic scale exercise',
    instructions: [
      'Play chromatically up the neck: 1-2-3-4 on each string',
      'Start at 1st fret, move up to 12th fret',
      'Descend back down using same pattern',
      'Focus on even timing and clean notes'
    ],
    pattern: 'Chromatic',
    tempo: '100 BPM',
  },
  {
    id: 5,
    name: 'Finger Trill Exercise',
    difficulty: 'Advanced',
    duration: '6 min',
    description: 'Rapid alternation between two fingers',
    instructions: [
      'Place finger 1 on 5th fret, finger 3 on 7th fret',
      'Rapidly alternate between the two notes',
      'Keep both fingers close to strings',
      'Practice on all strings'
    ],
    pattern: '1-3 Trill',
    tempo: '120 BPM',
  },
  {
    id: 6,
    name: 'Scale Practice: Major',
    difficulty: 'Intermediate',
    duration: '10 min',
    description: 'Practice major scales for technique',
    instructions: [
      'Play C major scale in first position',
      'Use proper fingering: 1-3-0-1-3-0-2-0',
      'Focus on smooth transitions',
      'Play ascending and descending'
    ],
    pattern: 'Major Scale',
    tempo: '90 BPM',
  },
];

const ExerciseCard = ({ exercise, isActive, onToggle }: any) => {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={styles.exerciseMeta}>
            <View style={[styles.difficultyBadge, 
              exercise.difficulty === 'Beginner' && styles.beginnerBadge,
              exercise.difficulty === 'Intermediate' && styles.intermediateBadge,
              exercise.difficulty === 'Advanced' && styles.advancedBadge
            ]}>
              <Text style={[styles.difficultyText, 
                exercise.difficulty === 'Beginner' && styles.beginnerText,
                exercise.difficulty === 'Intermediate' && styles.intermediateText,
                exercise.difficulty === 'Advanced' && styles.advancedText
              ]}>
                {exercise.difficulty}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Timer size={14} color="#64748b" />
              <Text style={styles.metaText}>{exercise.duration}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => onToggle(exercise.id)}
        >
          {isActive ? (
            <Pause size={20} color="#ffffff" />
          ) : (
            <Play size={20} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.exerciseDescription}>{exercise.description}</Text>

      <View style={styles.exerciseDetails}>
        <View style={styles.patternInfo}>
          <Text style={styles.patternLabel}>Pattern:</Text>
          <Text style={styles.patternText}>{exercise.pattern}</Text>
        </View>
        <View style={styles.tempoInfo}>
          <Text style={styles.tempoLabel}>Tempo:</Text>
          <Text style={styles.tempoText}>{exercise.tempo}</Text>
        </View>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instructions:</Text>
        {exercise.instructions.map((instruction: string, index: number) => (
          <View key={index} style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>{index + 1}</Text>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function ExercisesTab() {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);

  const toggleExercise = (exerciseId: number) => {
    if (activeExercise === exerciseId) {
      setActiveExercise(null);
    } else {
      setActiveExercise(exerciseId);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#dc2626', '#b91c1c']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Guitar Exercises</Text>
        <Text style={styles.headerSubtitle}>Build technique and finger strength</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Target size={24} color="#dc2626" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Exercises\nCompleted</Text>
            </View>
            <View style={styles.statCard}>
              <Timer size={24} color="#dc2626" />
              <Text style={styles.statNumber}>45m</Text>
              <Text style={styles.statLabel}>Practice\nTime</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#dc2626" />
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Day\nStreak</Text>
            </View>
          </View>
        </View>

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Technique Builders</Text>
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isActive={activeExercise === exercise.id}
              onToggle={toggleExercise}
            />
          ))}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Exercise Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>⏱️</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Start Slow</Text>
                <Text style={styles.tipText}>Begin at a comfortable tempo and gradually increase speed</Text>
              </View>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🎯</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Focus on Accuracy</Text>
                <Text style={styles.tipText}>Clean, precise notes are more important than speed</Text>
              </View>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💪</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Regular Practice</Text>
                <Text style={styles.tipText}>15-20 minutes daily is better than long irregular sessions</Text>
              </View>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🤲</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Relax Your Hands</Text>
                <Text style={styles.tipText}>Tension will slow you down and cause fatigue</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 0.3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  exercisesSection: {
    marginBottom: 32,
  },
  exerciseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  beginnerBadge: {
    backgroundColor: '#10b98120',
  },
  intermediateBadge: {
    backgroundColor: '#f59e0b20',
  },
  advancedBadge: {
    backgroundColor: '#ef444420',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  beginnerText: {
    color: '#10b981',
  },
  intermediateText: {
    color: '#f59e0b',
  },
  advancedText: {
    color: '#ef4444',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  playButton: {
    width: 48,
    height: 48,
    backgroundColor: '#dc2626',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#334155',
    borderRadius: 12,
  },
  patternInfo: {
    alignItems: 'center',
  },
  patternLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  patternText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tempoInfo: {
    alignItems: 'center',
  },
  tempoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  tempoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  instructionsContainer: {
    marginTop: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  instructionNumber: {
    width: 20,
    height: 20,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 100,
  },
  tipsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
});