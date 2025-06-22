import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { Music, Play, BookOpen, Volume2, VolumeX } from 'lucide-react-native';
import { scaleAudio } from '@/utils/scaleAudio';

const scaleTypes = [
  { id: 'major', name: 'Major Scales', color: '#3b82f6' },
  { id: 'minor', name: 'Minor Scales', color: '#ef4444' },
  { id: 'pentatonic', name: 'Pentatonic', color: '#f59e0b' },
  { id: 'blues', name: 'Blues Scales', color: '#8b5cf6' },
];

const majorScales = [
  {
    name: 'C Major',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    pattern: [2, 2, 1, 2, 2, 2, 1],
    positions: [
      { fret: 8, string: 6 }, { fret: 10, string: 6 }, { fret: 12, string: 6 },
      { fret: 7, string: 5 }, { fret: 9, string: 5 }, { fret: 10, string: 5 },
      { fret: 7, string: 4 }, { fret: 9, string: 4 }, { fret: 10, string: 4 },
      { fret: 7, string: 3 }, { fret: 9, string: 3 }, { fret: 10, string: 3 }
    ]
  },
  {
    name: 'G Major',
    notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    pattern: [2, 2, 1, 2, 2, 2, 1],
    positions: [
      { fret: 3, string: 6 }, { fret: 5, string: 6 }, { fret: 7, string: 6 },
      { fret: 2, string: 5 }, { fret: 4, string: 5 }, { fret: 5, string: 5 },
      { fret: 2, string: 4 }, { fret: 4, string: 4 }, { fret: 5, string: 4 },
      { fret: 2, string: 3 }, { fret: 4, string: 3 }, { fret: 5, string: 3 }
    ]
  },
  {
    name: 'D Major',
    notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    pattern: [2, 2, 1, 2, 2, 2, 1],
    positions: [
      { fret: 10, string: 6 }, { fret: 12, string: 6 }, { fret: 14, string: 6 },
      { fret: 9, string: 5 }, { fret: 11, string: 5 }, { fret: 12, string: 5 },
      { fret: 9, string: 4 }, { fret: 11, string: 4 }, { fret: 12, string: 4 },
      { fret: 9, string: 3 }, { fret: 11, string: 3 }, { fret: 12, string: 3 }
    ]
  },
  {
    name: 'A Major',
    notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    pattern: [2, 2, 1, 2, 2, 2, 1],
    positions: [
      { fret: 5, string: 6 }, { fret: 7, string: 6 }, { fret: 9, string: 6 },
      { fret: 4, string: 5 }, { fret: 6, string: 5 }, { fret: 7, string: 5 },
      { fret: 4, string: 4 }, { fret: 6, string: 4 }, { fret: 7, string: 4 },
      { fret: 4, string: 3 }, { fret: 6, string: 3 }, { fret: 7, string: 3 }
    ]
  },
];

const minorScales = [
  {
    name: 'A Natural Minor',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    pattern: [2, 1, 2, 2, 1, 2, 2],
    positions: [
      { fret: 5, string: 6 }, { fret: 7, string: 6 }, { fret: 8, string: 6 },
      { fret: 5, string: 5 }, { fret: 7, string: 5 }, { fret: 8, string: 5 },
      { fret: 5, string: 4 }, { fret: 7, string: 4 }, { fret: 9, string: 4 },
      { fret: 5, string: 3 }, { fret: 7, string: 3 }, { fret: 8, string: 3 }
    ]
  },
  {
    name: 'E Natural Minor',
    notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
    pattern: [2, 1, 2, 2, 1, 2, 2],
    positions: [
      { fret: 12, string: 6 }, { fret: 14, string: 6 }, { fret: 15, string: 6 },
      { fret: 12, string: 5 }, { fret: 14, string: 5 }, { fret: 15, string: 5 },
      { fret: 12, string: 4 }, { fret: 14, string: 4 }, { fret: 16, string: 4 },
      { fret: 12, string: 3 }, { fret: 14, string: 3 }, { fret: 15, string: 3 }
    ]
  },
  {
    name: 'D Natural Minor',
    notes: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
    pattern: [2, 1, 2, 2, 1, 2, 2],
    positions: [
      { fret: 10, string: 6 }, { fret: 12, string: 6 }, { fret: 13, string: 6 },
      { fret: 10, string: 5 }, { fret: 12, string: 5 }, { fret: 13, string: 5 },
      { fret: 10, string: 4 }, { fret: 12, string: 4 }, { fret: 14, string: 4 },
      { fret: 10, string: 3 }, { fret: 12, string: 3 }, { fret: 13, string: 3 }
    ]
  },
  {
    name: 'B Natural Minor',
    notes: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
    pattern: [2, 1, 2, 2, 1, 2, 2],
    positions: [
      { fret: 7, string: 6 }, { fret: 9, string: 6 }, { fret: 10, string: 6 },
      { fret: 7, string: 5 }, { fret: 9, string: 5 }, { fret: 10, string: 5 },
      { fret: 7, string: 4 }, { fret: 9, string: 4 }, { fret: 11, string: 4 },
      { fret: 7, string: 3 }, { fret: 9, string: 3 }, { fret: 10, string: 3 }
    ]
  },
];

const pentatonicScales = [
  {
    name: 'A Minor Pentatonic',
    notes: ['A', 'C', 'D', 'E', 'G'],
    pattern: [3, 2, 2, 3, 2],
    positions: [
      { fret: 5, string: 6 }, { fret: 8, string: 6 },
      { fret: 5, string: 5 }, { fret: 7, string: 5 },
      { fret: 5, string: 4 }, { fret: 7, string: 4 },
      { fret: 5, string: 3 }, { fret: 7, string: 3 },
      { fret: 5, string: 2 }, { fret: 8, string: 2 },
      { fret: 5, string: 1 }, { fret: 8, string: 1 }
    ]
  },
  {
    name: 'E Minor Pentatonic',
    notes: ['E', 'G', 'A', 'B', 'D'],
    pattern: [3, 2, 2, 3, 2],
    positions: [
      { fret: 12, string: 6 }, { fret: 15, string: 6 },
      { fret: 12, string: 5 }, { fret: 14, string: 5 },
      { fret: 12, string: 4 }, { fret: 14, string: 4 },
      { fret: 12, string: 3 }, { fret: 14, string: 3 },
      { fret: 12, string: 2 }, { fret: 15, string: 2 },
      { fret: 12, string: 1 }, { fret: 15, string: 1 }
    ]
  },
  {
    name: 'G Major Pentatonic',
    notes: ['G', 'A', 'B', 'D', 'E'],
    pattern: [2, 2, 3, 2, 3],
    positions: [
      { fret: 3, string: 6 }, { fret: 5, string: 6 },
      { fret: 2, string: 5 }, { fret: 5, string: 5 },
      { fret: 2, string: 4 }, { fret: 4, string: 4 },
      { fret: 2, string: 3 }, { fret: 4, string: 3 },
      { fret: 3, string: 2 }, { fret: 5, string: 2 },
      { fret: 3, string: 1 }, { fret: 5, string: 1 }
    ]
  },
  {
    name: 'C Major Pentatonic',
    notes: ['C', 'D', 'E', 'G', 'A'],
    pattern: [2, 2, 3, 2, 3],
    positions: [
      { fret: 8, string: 6 }, { fret: 10, string: 6 },
      { fret: 7, string: 5 }, { fret: 10, string: 5 },
      { fret: 7, string: 4 }, { fret: 9, string: 4 },
      { fret: 7, string: 3 }, { fret: 9, string: 3 },
      { fret: 8, string: 2 }, { fret: 10, string: 2 },
      { fret: 8, string: 1 }, { fret: 10, string: 1 }
    ]
  },
];

const bluesScales = [
  {
    name: 'A Blues Scale',
    notes: ['A', 'C', 'D', 'Eb', 'E', 'G'],
    pattern: [3, 2, 1, 1, 3, 2],
    positions: [
      { fret: 5, string: 6 }, { fret: 8, string: 6 },
      { fret: 5, string: 5 }, { fret: 6, string: 5 }, { fret: 7, string: 5 },
      { fret: 5, string: 4 }, { fret: 7, string: 4 },
      { fret: 5, string: 3 }, { fret: 6, string: 3 }, { fret: 7, string: 3 },
      { fret: 5, string: 2 }, { fret: 8, string: 2 },
      { fret: 5, string: 1 }, { fret: 8, string: 1 }
    ]
  },
  {
    name: 'E Blues Scale',
    notes: ['E', 'G', 'A', 'Bb', 'B', 'D'],
    pattern: [3, 2, 1, 1, 3, 2],
    positions: [
      { fret: 12, string: 6 }, { fret: 15, string: 6 },
      { fret: 12, string: 5 }, { fret: 13, string: 5 }, { fret: 14, string: 5 },
      { fret: 12, string: 4 }, { fret: 14, string: 4 },
      { fret: 12, string: 3 }, { fret: 13, string: 3 }, { fret: 14, string: 3 },
      { fret: 12, string: 2 }, { fret: 15, string: 2 },
      { fret: 12, string: 1 }, { fret: 15, string: 1 }
    ]
  },
  {
    name: 'G Blues Scale',
    notes: ['G', 'Bb', 'C', 'Db', 'D', 'F'],
    pattern: [3, 2, 1, 1, 3, 2],
    positions: [
      { fret: 3, string: 6 }, { fret: 6, string: 6 },
      { fret: 3, string: 5 }, { fret: 4, string: 5 }, { fret: 5, string: 5 },
      { fret: 3, string: 4 }, { fret: 5, string: 4 },
      { fret: 3, string: 3 }, { fret: 4, string: 3 }, { fret: 5, string: 3 },
      { fret: 3, string: 2 }, { fret: 6, string: 2 },
      { fret: 3, string: 1 }, { fret: 6, string: 1 }
    ]
  },
];

const ScaleFretboard = ({ scale }: { scale: any }) => {
  const strings = 6;
  const frets = 17;
  
  return (
    <View style={styles.fretboardContainer}>
      <Text style={styles.scaleName}>{scale.name}</Text>
      <View style={styles.fretboard}>
        {/* String labels */}
        <View style={styles.stringLabels}>
          {['E', 'A', 'D', 'G', 'B', 'E'].map((note, index) => (
            <Text key={index} style={styles.stringLabel}>{note}</Text>
          ))}
        </View>
        
        {/* Fretboard grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.fretboardGrid}>
            {Array.from({ length: strings }).map((_, stringIndex) => (
              <View key={stringIndex} style={styles.stringRow}>
                {Array.from({ length: frets }).map((_, fretIndex) => {
                  const hasNote = scale.positions.some((pos: any) => 
                    pos.string === strings - stringIndex && pos.fret === fretIndex + 1
                  );
                  
                  return (
                    <View key={fretIndex} style={styles.fretPosition}>
                      {hasNote && <View style={styles.scaleNote} />}
                      {/* Fret markers */}
                      {stringIndex === 0 && (fretIndex === 2 || fretIndex === 4 || fretIndex === 6 || fretIndex === 8 || fretIndex === 11 || fretIndex === 14 || fretIndex === 16) && (
                        <View style={styles.fretMarker} />
                      )}
                      {stringIndex === 0 && (fretIndex === 11) && (
                        <View style={styles.doubleFretMarker} />
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
        
        {/* Fret numbers */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.fretNumbers}>
            {Array.from({ length: frets }).map((_, index) => (
              <Text key={index} style={styles.fretNumber}>{index + 1}</Text>
            ))}
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.scaleNotes}>
        <Text style={styles.notesLabel}>Notes:</Text>
        <View style={styles.notesList}>
          {scale.notes.map((note: string, index: number) => (
            <View key={index} style={styles.noteChip}>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.patternInfo}>
        <Text style={styles.patternLabel}>Interval Pattern:</Text>
        <View style={styles.patternList}>
          {scale.pattern.map((interval: number, index: number) => (
            <View key={index} style={styles.intervalChip}>
              <Text style={styles.intervalText}>{interval}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default function ScalesTab() {
  const [selectedType, setSelectedType] = useState('major');
  const [playingScale, setPlayingScale] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      scaleAudio.dispose();
    };
  }, []);
  
  const getCurrentScales = () => {
    switch (selectedType) {
      case 'major':
        return majorScales;
      case 'minor':
        return minorScales;
      case 'pentatonic':
        return pentatonicScales;
      case 'blues':
        return bluesScales;
      default:
        return majorScales;
    }
  };

  const getScaleDescription = () => {
    switch (selectedType) {
      case 'major':
        return 'Bright, happy sounding scales - foundation of Western music';
      case 'minor':
        return 'Darker, more emotional scales - perfect for expressive playing';
      case 'pentatonic':
        return 'Five-note scales - versatile and great for improvisation';
      case 'blues':
        return 'Soulful scales with added blue notes for that classic blues sound';
      default:
        return 'Bright, happy sounding scales - foundation of Western music';
    }
  };

  const handlePlayScale = async (scale: any) => {
    if (!audioEnabled) {
      Alert.alert('Audio Disabled', 'Enable audio to hear scale sounds');
      return;
    }

    if (scaleAudio.isCurrentlyPlaying()) {
      return; // Don't play if already playing
    }

    try {
      setPlayingScale(scale.name);
      await scaleAudio.playScale(scale.notes, scale.name);
      
      // Reset playing state after scale finishes
      setTimeout(() => {
        setPlayingScale(null);
      }, (scale.notes.length * 2 * 0.45) * 1000); // Approximate duration
    } catch (error) {
      console.error('Error playing scale:', error);
      Alert.alert('Audio Error', 'Unable to play scale sound. Please check your audio settings.');
      setPlayingScale(null);
    }
  };

  const handlePlayArpeggio = async (scale: any) => {
    if (!audioEnabled) {
      Alert.alert('Audio Disabled', 'Enable audio to hear scale sounds');
      return;
    }

    if (scaleAudio.isCurrentlyPlaying()) {
      return;
    }

    try {
      setPlayingScale(scale.name + '_arp');
      await scaleAudio.playArpeggio(scale.notes, scale.name);
      
      setTimeout(() => {
        setPlayingScale(null);
      }, (scale.notes.length * 0.3 + 0.6) * 1000);
    } catch (error) {
      console.error('Error playing arpeggio:', error);
      Alert.alert('Audio Error', 'Unable to play arpeggio sound. Please check your audio settings.');
      setPlayingScale(null);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#1e3a8a']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Guitar Scales</Text>
            <Text style={styles.headerSubtitle}>Learn scales and improve your technique</Text>
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
        <View style={styles.typesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.types}>
            {scaleTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeChip,
                  selectedType === type.id && { backgroundColor: type.color }
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Text style={[
                  styles.typeText,
                  selectedType === type.id && styles.typeTextActive
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.scaleDescription}>
            {getScaleDescription()}
          </Text>
        </View>

        {audioEnabled && (
          <View style={styles.audioInfo}>
            <Text style={styles.audioInfoText}>
              🎵 Tap "Play Scale" to hear ascending and descending scales, or "Practice" for arpeggios
            </Text>
          </View>
        )}

        <View style={styles.scalesSection}>
          {getCurrentScales().map((scale, index) => (
            <View key={index} style={styles.scaleCard}>
              <ScaleFretboard scale={scale} />
              
              <View style={styles.scaleActions}>
                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    playingScale === scale.name && styles.playingButton
                  ]}
                  onPress={() => handlePlayScale(scale)}
                  disabled={playingScale === scale.name}
                >
                  <Play size={16} color={playingScale === scale.name ? "#ffffff" : "#3b82f6"} />
                  <Text style={[
                    styles.actionText,
                    playingScale === scale.name && styles.playingText
                  ]}>
                    {playingScale === scale.name ? 'Playing...' : 'Play Scale'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    playingScale === scale.name + '_arp' && styles.playingButton
                  ]}
                  onPress={() => handlePlayArpeggio(scale)}
                  disabled={playingScale === scale.name + '_arp'}
                >
                  <Music size={16} color={playingScale === scale.name + '_arp' ? "#ffffff" : "#3b82f6"} />
                  <Text style={[
                    styles.actionText,
                    playingScale === scale.name + '_arp' && styles.playingText
                  ]}>
                    {playingScale === scale.name + '_arp' ? 'Playing...' : 'Practice'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <BookOpen size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.practiceSection}>
          <Text style={styles.sectionTitle}>Practice Tips</Text>
          <View style={styles.tipsCard}>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceTitle}>🎯 Start Slow</Text>
              <Text style={styles.practiceText}>Begin at a comfortable tempo with a metronome</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceTitle}>🎼 Learn Patterns</Text>
              <Text style={styles.practiceText}>Memorize the fretboard patterns for each scale</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceTitle}>🎵 Apply Musically</Text>
              <Text style={styles.practiceText}>Practice scales over chord progressions</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceTitle}>🔄 Practice Variations</Text>
              <Text style={styles.practiceText}>Try different rhythms, sequences, and articulations</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceTitle}>👂 Listen & Learn</Text>
              <Text style={styles.practiceText}>Use the audio playback to train your ear and timing</Text>
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
  typesSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  types: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  typeTextActive: {
    color: '#ffffff',
  },
  scaleDescription: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  audioInfo: {
    backgroundColor: '#1e40af20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  audioInfoText: {
    fontSize: 14,
    color: '#93c5fd',
    textAlign: 'center',
    fontWeight: '500',
  },
  scalesSection: {
    marginBottom: 32,
  },
  scaleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  fretboardContainer: {
    marginBottom: 20,
  },
  scaleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  fretboard: {
    alignItems: 'center',
  },
  stringLabels: {
    flexDirection: 'column',
    position: 'absolute',
    left: -20,
    top: 10,
    zIndex: 2,
  },
  stringLabel: {
    fontSize: 12,
    color: '#64748b',
    height: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  fretboardGrid: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'column',
  },
  stringRow: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
  },
  fretPosition: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#64748b',
    position: 'relative',
  },
  scaleNote: {
    width: 12,
    height: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    zIndex: 1,
  },
  fretMarker: {
    position: 'absolute',
    bottom: -25,
    width: 6,
    height: 6,
    backgroundColor: '#64748b',
    borderRadius: 3,
  },
  doubleFretMarker: {
    position: 'absolute',
    bottom: -30,
    width: 8,
    height: 8,
    backgroundColor: '#64748b',
    borderRadius: 4,
  },
  fretNumbers: {
    flexDirection: 'row',
    marginTop: 8,
    paddingLeft: 8,
  },
  fretNumber: {
    width: 20,
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  scaleNotes: {
    marginTop: 16,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  notesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noteChip: {
    backgroundColor: '#3b82f620',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  patternInfo: {
    marginTop: 8,
  },
  patternLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  patternList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  intervalChip: {
    backgroundColor: '#64748b20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  intervalText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  scaleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f620',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 0.32,
    justifyContent: 'center',
  },
  playingButton: {
    backgroundColor: '#3b82f6',
  },
  actionText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
    fontWeight: '600',
  },
  playingText: {
    color: '#ffffff',
  },
  practiceSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  tipsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  practiceItem: {
    marginBottom: 16,
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  practiceText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
});