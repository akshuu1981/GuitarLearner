import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react-native';

const strummingPatterns = [
  {
    id: 1,
    name: 'Basic Down Strums',
    level: 'Beginner',
    tempo: '60 BPM',
    pattern: ['D', 'D', 'D', 'D'],
    description: 'Start with simple downward strums on each beat',
  },
  {
    id: 2,
    name: 'Down-Up Pattern',
    level: 'Beginner',
    tempo: '80 BPM',
    pattern: ['D', 'U', 'D', 'U'],
    description: 'Alternate between down and up strums',
  },
  {
    id: 3,
    name: 'Folk Strum',
    level: 'Intermediate',
    tempo: '120 BPM',
    pattern: ['D', 'D', 'U', 'U', 'D', 'U'],
    description: 'Common pattern used in folk and country music',
  },
  {
    id: 4,
    name: 'Pop Rock Pattern',
    level: 'Intermediate',
    tempo: '110 BPM',
    pattern: ['D', '', 'D', 'U', '', 'U', 'D', 'U'],
    description: 'Popular pattern with syncopated rhythm',
  },
  {
    id: 5,
    name: 'Reggae Skank',
    level: 'Intermediate',
    tempo: '90 BPM',
    pattern: ['', 'U', '', 'U'],
    description: 'Classic reggae upstroke pattern',
  },
  {
    id: 6,
    name: 'Ballad Pattern',
    level: 'Beginner',
    tempo: '70 BPM',
    pattern: ['D', '', '', 'D', '', 'U', 'D', 'U'],
    description: 'Gentle pattern perfect for slow songs',
  },
];

const PatternVisualizer = ({ pattern }: { pattern: string[] }) => {
  return (
    <View style={styles.patternContainer}>
      {pattern.map((stroke, index) => (
        <View key={index} style={styles.beatContainer}>
          <View style={[
            styles.beatIndicator,
            stroke === 'D' && styles.downBeat,
            stroke === 'U' && styles.upBeat,
            stroke === '' && styles.restBeat,
          ]}>
            {stroke === 'D' && <Text style={styles.strokeText}>↓</Text>}
            {stroke === 'U' && <Text style={styles.strokeText}>↑</Text>}
            {stroke === '' && <Text style={styles.strokeText}>•</Text>}
          </View>
          <Text style={styles.beatNumber}>{index + 1}</Text>
        </View>
      ))}
    </View>
  );
};

export default function StrummingTab() {
  const [playingPattern, setPlayingPattern] = useState<number | null>(null);

  const togglePlay = (patternId: number) => {
    if (playingPattern === patternId) {
      setPlayingPattern(null);
    } else {
      setPlayingPattern(patternId);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Strumming Patterns</Text>
        <Text style={styles.headerSubtitle}>Master rhythm and timing</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>
            Start slow and focus on consistent timing. Use a metronome and gradually increase the tempo as you get comfortable.
          </Text>
        </View>

        <View style={styles.patternsSection}>
          <Text style={styles.sectionTitle}>Popular Patterns</Text>
          {strummingPatterns.map((pattern) => (
            <View key={pattern.id} style={styles.patternCard}>
              <View style={styles.patternHeader}>
                <View style={styles.patternInfo}>
                  <Text style={styles.patternName}>{pattern.name}</Text>
                  <View style={styles.patternMeta}>
                    <View style={[styles.levelBadge, 
                      pattern.level === 'Beginner' && styles.beginnerBadge,
                      pattern.level === 'Intermediate' && styles.intermediateBadge
                    ]}>
                      <Text style={styles.levelText}>{pattern.level}</Text>
                    </View>
                    <Text style={styles.tempoText}>{pattern.tempo}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => togglePlay(pattern.id)}
                >
                  {playingPattern === pattern.id ? (
                    <Pause size={20} color="#ffffff" />
                  ) : (
                    <Play size={20} color="#ffffff" />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.patternDescription}>{pattern.description}</Text>
              
              <PatternVisualizer pattern={pattern.pattern} />

              <View style={styles.patternControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <RotateCcw size={16} color="#64748b" />
                  <Text style={styles.controlText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Volume2 size={16} color="#64748b" />
                  <Text style={styles.controlText}>Audio</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.practiceSection}>
          <Text style={styles.sectionTitle}>Practice Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>1</Text>
              <Text style={styles.tipContent}>Keep your wrist relaxed and let it do the work</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>2</Text>
              <Text style={styles.tipContent}>Practice with a metronome to develop timing</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>3</Text>
              <Text style={styles.tipContent}>Focus on consistent volume and tone</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>4</Text>
              <Text style={styles.tipContent}>Start slow and gradually increase tempo</Text>
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
  tipCard: {
    backgroundColor: '#065f46',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#047857',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#d1fae5',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  patternsSection: {
    marginBottom: 32,
  },
  patternCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patternInfo: {
    flex: 1,
  },
  patternName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  patternMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
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
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  tempoText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  playButton: {
    width: 48,
    height: 48,
    backgroundColor: '#059669',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
    lineHeight: 20,
  },
  patternContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  beatContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  beatIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  downBeat: {
    backgroundColor: '#f97316',
  },
  upBeat: {
    backgroundColor: '#8b5cf6',
  },
  restBeat: {
    backgroundColor: '#374151',
  },
  strokeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  beatNumber: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  patternControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controlText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500',
  },
  practiceSection: {
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
  tipNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#059669',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
});