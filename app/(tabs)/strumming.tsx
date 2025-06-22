import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react-native';
import { strummingAudio } from '@/utils/strummingAudio';

const strummingPatterns = [
  {
    id: 1,
    name: 'Basic Down Strums',
    level: 'Beginner',
    tempo: 60,
    pattern: ['D', 'D', 'D', 'D'],
    description: 'Start with simple downward strums on each beat',
  },
  {
    id: 2,
    name: 'Down-Up Pattern',
    level: 'Beginner',
    tempo: 80,
    pattern: ['D', 'U', 'D', 'U'],
    description: 'Alternate between down and up strums',
  },
  {
    id: 3,
    name: 'Folk Strum',
    level: 'Intermediate',
    tempo: 120,
    pattern: ['D', 'D', 'U', 'U', 'D', 'U'],
    description: 'Common pattern used in folk and country music',
  },
  {
    id: 4,
    name: 'Pop Rock Pattern',
    level: 'Intermediate',
    tempo: 110,
    pattern: ['D', '', 'D', 'U', '', 'U', 'D', 'U'],
    description: 'Popular pattern with syncopated rhythm',
  },
  {
    id: 5,
    name: 'Reggae Skank',
    level: 'Intermediate',
    tempo: 90,
    pattern: ['', 'U', '', 'U'],
    description: 'Classic reggae upstroke pattern',
  },
  {
    id: 6,
    name: 'Ballad Pattern',
    level: 'Beginner',
    tempo: 70,
    pattern: ['D', '', '', 'D', '', 'U', 'D', 'U'],
    description: 'Gentle pattern perfect for slow songs',
  },
  {
    id: 7,
    name: 'Punk Rock',
    level: 'Intermediate',
    tempo: 140,
    pattern: ['D', 'D', 'D', 'D'],
    description: 'Fast, aggressive downstrokes for punk energy',
  },
  {
    id: 8,
    name: 'Country Shuffle',
    level: 'Advanced',
    tempo: 100,
    pattern: ['D', 'U', '', 'U', 'D', 'U', '', 'U'],
    description: 'Syncopated country rhythm with swing feel',
  },
];

const PatternVisualizer = ({ 
  pattern, 
  currentBeat, 
  isPlaying 
}: { 
  pattern: string[]; 
  currentBeat: number;
  isPlaying: boolean;
}) => {
  return (
    <View style={styles.patternContainer}>
      {pattern.map((stroke, index) => (
        <View key={index} style={styles.beatContainer}>
          <View style={[
            styles.beatIndicator,
            stroke === 'D' && styles.downBeat,
            stroke === 'U' && styles.upBeat,
            stroke === '' && styles.restBeat,
            isPlaying && currentBeat === index && styles.activeBeat,
          ]}>
            {stroke === 'D' && <Text style={styles.strokeText}>↓</Text>}
            {stroke === 'U' && <Text style={styles.strokeText}>↑</Text>}
            {stroke === '' && <Text style={styles.strokeText}>•</Text>}
          </View>
          <Text style={[
            styles.beatNumber,
            isPlaying && currentBeat === index && styles.activeBeatNumber
          ]}>
            {index + 1}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default function StrummingTab() {
  const [playingPattern, setPlayingPattern] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentBeat, setCurrentBeat] = useState(0);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      strummingAudio.dispose();
    };
  }, []);

  // Monitor playing state and update beat indicator
  useEffect(() => {
    const interval = setInterval(() => {
      if (strummingAudio.isCurrentlyPlaying()) {
        const currentPattern = strummingAudio.getCurrentPattern();
        if (currentPattern) {
          // Calculate current beat based on tempo
          const beatDuration = 60 / currentPattern.tempo * 1000; // in milliseconds
          const elapsed = Date.now() % (currentPattern.pattern.length * beatDuration);
          const beat = Math.floor(elapsed / beatDuration);
          setCurrentBeat(beat);
        }
      } else {
        setCurrentBeat(0);
        if (playingPattern !== null) {
          setPlayingPattern(null);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [playingPattern]);

  const togglePlay = async (pattern: any) => {
    if (!audioEnabled) {
      Alert.alert('Audio Disabled', 'Enable audio to hear strumming patterns');
      return;
    }

    if (playingPattern === pattern.id) {
      // Stop current pattern
      strummingAudio.stopPattern();
      setPlayingPattern(null);
      setCurrentBeat(0);
    } else {
      // Stop any current pattern and start new one
      strummingAudio.stopPattern();
      
      try {
        setPlayingPattern(pattern.id);
        await strummingAudio.playStrummingPattern(pattern.pattern, pattern.tempo, pattern.name);
      } catch (error) {
        console.error('Error playing strumming pattern:', error);
        Alert.alert('Audio Error', 'Unable to play strumming pattern. Please check your audio settings.');
        setPlayingPattern(null);
      }
    }
  };

  const toggleAudio = () => {
    if (audioEnabled && strummingAudio.isCurrentlyPlaying()) {
      strummingAudio.stopPattern();
      setPlayingPattern(null);
    }
    setAudioEnabled(!audioEnabled);
  };

  const resetPattern = () => {
    strummingAudio.stopPattern();
    setPlayingPattern(null);
    setCurrentBeat(0);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Strumming Patterns</Text>
            <Text style={styles.headerSubtitle}>Master rhythm and timing</Text>
          </View>
          <TouchableOpacity 
            style={styles.audioToggle}
            onPress={toggleAudio}
          >
            {audioEnabled ? (
              <Volume2 size={24} color="#ffffff" />
            ) : (
              <VolumeX size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>
            Start slow and focus on consistent timing. Use a metronome and gradually increase the tempo as you get comfortable.
          </Text>
        </View>

        {audioEnabled && (
          <View style={styles.audioInfo}>
            <Text style={styles.audioInfoText}>
              🎵 Tap "Play" to hear strumming patterns with realistic guitar sounds
            </Text>
          </View>
        )}

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
                      pattern.level === 'Intermediate' && styles.intermediateBadge,
                      pattern.level === 'Advanced' && styles.advancedBadge
                    ]}>
                      <Text style={[styles.levelText,
                        pattern.level === 'Beginner' && styles.beginnerText,
                        pattern.level === 'Intermediate' && styles.intermediateText,
                        pattern.level === 'Advanced' && styles.advancedText
                      ]}>
                        {pattern.level}
                      </Text>
                    </View>
                    <Text style={styles.tempoText}>{pattern.tempo} BPM</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.playButton,
                    playingPattern === pattern.id && styles.playingButton
                  ]}
                  onPress={() => togglePlay(pattern)}
                >
                  {playingPattern === pattern.id ? (
                    <Pause size={20} color="#ffffff" />
                  ) : (
                    <Play size={20} color="#ffffff" />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.patternDescription}>{pattern.description}</Text>
              
              <PatternVisualizer 
                pattern={pattern.pattern} 
                currentBeat={playingPattern === pattern.id ? currentBeat : -1}
                isPlaying={playingPattern === pattern.id}
              />

              <View style={styles.patternControls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={resetPattern}
                >
                  <RotateCcw size={16} color="#64748b" />
                  <Text style={styles.controlText}>Reset</Text>
                </TouchableOpacity>
                <View style={styles.tempoDisplay}>
                  <Text style={styles.tempoLabel}>Tempo: {pattern.tempo} BPM</Text>
                </View>
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
              <Text style={styles.tipContent}>Practice with audio patterns to develop timing</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>3</Text>
              <Text style={styles.tipContent}>Focus on consistent volume and tone</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>4</Text>
              <Text style={styles.tipContent}>Start slow and gradually increase tempo</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>5</Text>
              <Text style={styles.tipContent}>Listen to the audio patterns and try to match them</Text>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
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
  audioToggle: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  audioInfo: {
    backgroundColor: '#065f46',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#047857',
  },
  audioInfoText: {
    fontSize: 14,
    color: '#d1fae5',
    textAlign: 'center',
    fontWeight: '500',
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
  advancedBadge: {
    backgroundColor: '#ef444420',
  },
  levelText: {
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
  playingButton: {
    backgroundColor: '#dc2626',
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
    flexWrap: 'wrap',
  },
  beatContainer: {
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 4,
  },
  beatIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
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
  activeBeat: {
    borderColor: '#ffffff',
    transform: [{ scale: 1.1 }],
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
  activeBeatNumber: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  patternControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tempoDisplay: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tempoLabel: {
    fontSize: 14,
    color: '#94a3b8',
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