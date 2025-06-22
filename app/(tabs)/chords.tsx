import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Music, Play, BookOpen } from 'lucide-react-native';

const chordCategories = [
  { id: 'basic', name: 'Basic Chords', color: '#10b981' },
  { id: 'barre', name: 'Barre Chords', color: '#f59e0b' },
  { id: 'seventh', name: '7th Chords', color: '#8b5cf6' },
  { id: 'sus', name: 'Sus Chords', color: '#ef4444' },
];

const basicChords = [
  { name: 'C Major', difficulty: 'Easy', fingers: [0, 3, 2, 0, 1, 0] }, // Fixed: 3rd fret A string, 2nd fret D string, 1st fret B string
  { name: 'G Major', difficulty: 'Easy', fingers: [3, 2, 0, 0, 3, 3] },
  { name: 'D Major', difficulty: 'Easy', fingers: [0, 0, 0, 2, 3, 2] },
  { name: 'A Major', difficulty: 'Easy', fingers: [0, 0, 2, 2, 2, 0] },
  { name: 'E Major', difficulty: 'Easy', fingers: [0, 2, 2, 1, 0, 0] },
  { name: 'F Major', difficulty: 'Hard', fingers: [1, 3, 3, 2, 1, 1] },
  { name: 'Am', difficulty: 'Easy', fingers: [0, 0, 2, 2, 1, 0] },
  { name: 'Em', difficulty: 'Easy', fingers: [0, 2, 2, 0, 0, 0] },
  { name: 'Dm', difficulty: 'Medium', fingers: [0, 0, 0, 2, 3, 1] },
];

const barreChords = [
  { name: 'F Major', difficulty: 'Hard', fingers: [1, 3, 3, 2, 1, 1], barre: 1 },
  { name: 'B Major', difficulty: 'Hard', fingers: [2, 4, 4, 3, 2, 2], barre: 2 },
  { name: 'Bb Major', difficulty: 'Hard', fingers: [1, 3, 3, 2, 1, 1], barre: 1 },
  { name: 'F# Major', difficulty: 'Hard', fingers: [2, 4, 4, 3, 2, 2], barre: 2 },
  { name: 'Bm', difficulty: 'Hard', fingers: [2, 3, 4, 4, 2, 2], barre: 2 },
  { name: 'Fm', difficulty: 'Hard', fingers: [1, 3, 3, 1, 1, 1], barre: 1 },
  { name: 'C#m', difficulty: 'Hard', fingers: [4, 6, 6, 4, 4, 4], barre: 4 },
  { name: 'Gm', difficulty: 'Hard', fingers: [3, 5, 5, 3, 3, 3], barre: 3 },
];

const seventhChords = [
  { name: 'C7', difficulty: 'Medium', fingers: [0, 1, 3, 2, 3, 1] },
  { name: 'G7', difficulty: 'Medium', fingers: [3, 2, 0, 0, 0, 1] },
  { name: 'D7', difficulty: 'Medium', fingers: [0, 0, 0, 2, 1, 2] },
  { name: 'A7', difficulty: 'Medium', fingers: [0, 0, 2, 0, 2, 0] },
  { name: 'E7', difficulty: 'Medium', fingers: [0, 2, 0, 1, 0, 0] },
  { name: 'B7', difficulty: 'Medium', fingers: [0, 2, 1, 2, 0, 2] },
  { name: 'Am7', difficulty: 'Easy', fingers: [0, 0, 2, 0, 1, 0] },
  { name: 'Em7', difficulty: 'Easy', fingers: [0, 2, 0, 0, 0, 0] },
  { name: 'Dm7', difficulty: 'Medium', fingers: [0, 0, 0, 2, 1, 1] },
];

const susChords = [
  { name: 'Csus2', difficulty: 'Medium', fingers: [0, 3, 0, 0, 3, 3] },
  { name: 'Csus4', difficulty: 'Medium', fingers: [0, 3, 3, 0, 1, 1] },
  { name: 'Dsus2', difficulty: 'Medium', fingers: [0, 0, 0, 2, 3, 0] },
  { name: 'Dsus4', difficulty: 'Medium', fingers: [0, 0, 0, 2, 3, 3] },
  { name: 'Esus2', difficulty: 'Medium', fingers: [0, 2, 4, 4, 0, 0] },
  { name: 'Esus4', difficulty: 'Medium', fingers: [0, 2, 2, 2, 0, 0] },
  { name: 'Asus2', difficulty: 'Easy', fingers: [0, 0, 2, 2, 0, 0] },
  { name: 'Asus4', difficulty: 'Easy', fingers: [0, 0, 2, 2, 3, 0] },
  { name: 'Gsus4', difficulty: 'Medium', fingers: [3, 3, 0, 0, 3, 3] },
];

const ChordDiagram = ({ chord }: { chord: { name: string; fingers: number[]; difficulty: string; barre?: number } }) => {
  const frets = 5;
  const strings = 6;
  
  return (
    <View style={styles.chordDiagram}>
      <Text style={styles.chordName}>{chord.name}</Text>
      <View style={styles.fretboard}>
        {/* Nut */}
        <View style={styles.nut} />
        
        {/* Barre indicator if present */}
        {chord.barre && (
          <View style={[styles.barreIndicator, { top: chord.barre * 18 + 5 }]}>
            <View style={styles.barreLine} />
            <Text style={styles.barreText}>Barre {chord.barre}</Text>
          </View>
        )}
        
        {/* Frets */}
        {Array.from({ length: frets }).map((_, fretIndex) => (
          <View key={fretIndex} style={styles.fret}>
            {Array.from({ length: strings }).map((_, stringIndex) => {
              const fingerPosition = chord.fingers[stringIndex];
              const isPressed = fingerPosition === fretIndex + 1;
              const isBarre = chord.barre && chord.barre === fretIndex + 1;
              
              return (
                <View key={stringIndex} style={styles.stringPosition}>
                  <View style={styles.string} />
                  {isPressed && (
                    <View style={[
                      styles.finger,
                      isBarre && styles.barreFinger
                    ]} />
                  )}
                  {fingerPosition === 0 && fretIndex === 0 && (
                    <View style={styles.openString}>
                      <Text style={styles.openStringText}>○</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <Text style={[
        styles.chordDifficulty,
        chord.difficulty === 'Easy' && styles.easyDifficulty,
        chord.difficulty === 'Medium' && styles.mediumDifficulty,
        chord.difficulty === 'Hard' && styles.hardDifficulty,
      ]}>
        {chord.difficulty}
      </Text>
    </View>
  );
};

export default function ChordsTab() {
  const [selectedCategory, setSelectedCategory] = useState('basic');

  const getCurrentChords = () => {
    switch (selectedCategory) {
      case 'basic':
        return basicChords;
      case 'barre':
        return barreChords;
      case 'seventh':
        return seventhChords;
      case 'sus':
        return susChords;
      default:
        return basicChords;
    }
  };

  const getCategoryDescription = () => {
    switch (selectedCategory) {
      case 'basic':
        return 'Essential open chords every guitarist should know';
      case 'barre':
        return 'Moveable chord shapes using barre technique';
      case 'seventh':
        return 'Add color and sophistication with 7th chords';
      case 'sus':
        return 'Suspended chords for tension and resolution';
      default:
        return 'Essential open chords every guitarist should know';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7c3aed', '#3730a3']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Chord Library</Text>
        <Text style={styles.headerSubtitle}>Master essential guitar chords</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
            {chordCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && { backgroundColor: category.color }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.categoryDescription}>
            {getCategoryDescription()}
          </Text>
        </View>

        <View style={styles.chordsGrid}>
          {getCurrentChords().map((chord, index) => (
            <View key={index} style={styles.chordCard}>
              <ChordDiagram chord={chord} />
              <View style={styles.chordActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Play size={16} color="#f97316" />
                  <Text style={styles.actionText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <BookOpen size={16} color="#f97316" />
                  <Text style={styles.actionText}>Learn</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {selectedCategory === 'basic' && (
          <View style={styles.tipSection}>
            <Text style={styles.tipTitle}>🎸 Basic Chord Tips</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                • Press down firmly just behind the fret wire{'\n'}
                • Keep your thumb behind the neck for support{'\n'}
                • Curve your fingers to avoid touching other strings{'\n'}
                • Practice chord changes slowly at first{'\n'}
                • Strum each string individually to check clarity
              </Text>
            </View>
          </View>
        )}

        {selectedCategory === 'barre' && (
          <View style={styles.tipSection}>
            <Text style={styles.tipTitle}>💡 Barre Chord Tips</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                • Use the side of your index finger, not the pad{'\n'}
                • Apply pressure close to the fret wire{'\n'}
                • Keep your thumb behind the neck for support{'\n'}
                • Practice partial barres before full barres{'\n'}
                • Build finger strength gradually
              </Text>
            </View>
          </View>
        )}

        {selectedCategory === 'seventh' && (
          <View style={styles.tipSection}>
            <Text style={styles.tipTitle}>🎵 7th Chord Theory</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                • Dominant 7th chords create tension that resolves{'\n'}
                • Major 7th chords have a jazzy, sophisticated sound{'\n'}
                • Minor 7th chords are mellow and bluesy{'\n'}
                • Try substituting 7th chords for basic triads{'\n'}
                • Common in blues, jazz, and funk music
              </Text>
            </View>
          </View>
        )}

        {selectedCategory === 'sus' && (
          <View style={styles.tipSection}>
            <Text style={styles.tipTitle}>🎯 Suspended Chord Usage</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                • Sus2 chords replace the 3rd with the 2nd{'\n'}
                • Sus4 chords replace the 3rd with the 4th{'\n'}
                • Create anticipation before resolving to major{'\n'}
                • Great for creating movement in progressions{'\n'}
                • Popular in rock and pop music
              </Text>
            </View>
          </View>
        )}
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
  categoriesSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  categories: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  chordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  chordCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chordDiagram: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chordName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  fretboard: {
    width: 80,
    height: 100,
    position: 'relative',
  },
  nut: {
    height: 3,
    backgroundColor: '#f97316',
    marginBottom: 2,
  },
  fret: {
    height: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#64748b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  stringPosition: {
    width: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  string: {
    width: 1,
    height: '100%',
    backgroundColor: '#94a3b8',
  },
  finger: {
    width: 10,
    height: 10,
    backgroundColor: '#f97316',
    borderRadius: 5,
    position: 'absolute',
  },
  barreFinger: {
    backgroundColor: '#f59e0b',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  barreIndicator: {
    position: 'absolute',
    left: -15,
    right: -15,
    alignItems: 'center',
  },
  barreLine: {
    height: 2,
    backgroundColor: '#f59e0b',
    width: '100%',
    opacity: 0.6,
  },
  barreText: {
    fontSize: 8,
    color: '#f59e0b',
    fontWeight: 'bold',
    marginTop: 2,
  },
  openString: {
    position: 'absolute',
    top: -15,
  },
  openStringText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chordDifficulty: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  easyDifficulty: {
    color: '#10b981',
  },
  mediumDifficulty: {
    color: '#f59e0b',
  },
  hardDifficulty: {
    color: '#ef4444',
  },
  chordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9731620',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 0.48,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#f97316',
    marginLeft: 4,
    fontWeight: '600',
  },
  tipSection: {
    marginBottom: 100,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
});