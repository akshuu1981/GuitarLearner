import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react-native';
import { metronomeAudio } from '../../utils/metronomeAudio';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate,
  withSequence,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

const HEADER_HEIGHT = 140;

const tempoPresets = [
  { name: 'Largo', bpm: 60, description: 'Very slow' },
  { name: 'Adagio', bpm: 80, description: 'Slow' },
  { name: 'Andante', bpm: 100, description: 'Walking pace' },
  { name: 'Moderato', bpm: 120, description: 'Moderate' },
  { name: 'Allegro', bpm: 140, description: 'Fast' },
  { name: 'Presto', bpm: 180, description: 'Very fast' },
];

const timeSignatures = [
  { name: '4/4', beats: 4, description: 'Common time' },
  { name: '3/4', beats: 3, description: 'Waltz time' },
  { name: '2/4', beats: 2, description: 'March time' },
  { name: '6/8', beats: 6, description: 'Compound time' },
];

// Custom Slider component using React Native components
const CustomSlider = ({ 
  value, 
  onValueChange, 
  minimumValue, 
  maximumValue, 
  step = 1,
  style,
  minimumTrackTintColor = '#dc2626',
  maximumTrackTintColor = '#334155'
}: any) => {
  const [sliderWidth, setSliderWidth] = useState(200);
  const [isDragging, setIsDragging] = useState(false);

  const handleLayout = (event: any) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  const handlePanGesture = (event: any) => {
    const { translationX, x } = event.nativeEvent;
    // Prevent division by zero by ensuring sliderWidth is not 0
    const safeSliderWidth = sliderWidth || 1;
    const percentage = Math.max(0, Math.min(1, x / safeSliderWidth));
    const newValue = minimumValue + (percentage * (maximumValue - minimumValue));
    const steppedValue = Math.round(newValue / step) * step;
    onValueChange(Math.max(minimumValue, Math.min(maximumValue, steppedValue)));
  };

  const handlePress = (event: any) => {
    const { locationX } = event.nativeEvent;
    // Prevent division by zero by ensuring sliderWidth is not 0
    const safeSliderWidth = sliderWidth || 1;
    const percentage = Math.max(0, Math.min(1, locationX / safeSliderWidth));
    const newValue = minimumValue + (percentage * (maximumValue - minimumValue));
    const steppedValue = Math.round(newValue / step) * step;
    onValueChange(Math.max(minimumValue, Math.min(maximumValue, steppedValue)));
  };

  // Prevent NaN in thumbPosition calculation
  const safeSliderWidth = sliderWidth || 1;
  const thumbPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * safeSliderWidth;

  return (
    <View style={[{ flex: 1, height: 40, justifyContent: 'center' }, style]}>
      <TouchableOpacity
        style={styles.sliderTrack}
        onLayout={handleLayout}
        onPress={handlePress}
        activeOpacity={1}
      >
        {/* Track background */}
        <View style={[styles.sliderTrackBackground, { backgroundColor: maximumTrackTintColor }]} />
        
        {/* Active track */}
        <View 
          style={[
            styles.sliderActiveTrack, 
            { 
              backgroundColor: minimumTrackTintColor,
              width: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`
            }
          ]} 
        />
        
        {/* Thumb */}
        <PanGestureHandler
          onGestureEvent={handlePanGesture}
          onHandlerStateChange={(event) => {
            if (event.nativeEvent.state === 4) { // BEGAN
              setIsDragging(true);
            } else if (event.nativeEvent.state === 5) { // END
              setIsDragging(false);
            }
          }}
        >
          <Animated.View
            style={[
              styles.sliderThumb,
              {
                backgroundColor: minimumTrackTintColor,
                left: thumbPosition - 12,
                transform: [{ scale: isDragging ? 1.2 : 1 }]
              }
            ]}
          />
        </PanGestureHandler>
      </TouchableOpacity>
    </View>
  );
};

export default function MetronomeTab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [timeSignature, setTimeSignature] = useState(timeSignatures[0]);
  const [volume, setVolume] = useState(0.7);
  const scrollY = useSharedValue(0);
  const beatAnimation = useSharedValue(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Callback to trigger beat animation from JS thread
  const triggerBeatAnimation = useCallback(() => {
    beatAnimation.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );
  }, [beatAnimation]);

  useEffect(() => {
    // Check if audio is available and update state accordingly
    setAudioEnabled(metronomeAudio.isAudioAvailable());
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      metronomeAudio.dispose();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const beatDuration = 60 / tempo * 1000; // Convert BPM to milliseconds
      
      intervalRef.current = setInterval(() => {
        setCurrentBeat((prev) => {
          const nextBeat = (prev + 1) % timeSignature.beats;
          
          // Trigger beat animation
          triggerBeatAnimation();
          
          // Play metronome sound
          if (audioEnabled && metronomeAudio.isAudioAvailable()) {
            try {
              metronomeAudio.playBeat(nextBeat === 0, volume);
            } catch (error) {
              console.error('Error playing metronome beat:', error);
            }
          }
          
          return nextBeat;
        });
      }, beatDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, tempo, timeSignature.beats, audioEnabled, volume, triggerBeatAnimation]);

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

  const beatAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: beatAnimation.value }],
    };
  });

  const togglePlay = async () => {
    if (!audioEnabled) {
      Alert.alert(
        'Audio Not Available', 
        'Audio playback is not supported in this environment. This feature requires a modern web browser with Web Audio API support.'
      );
      return;
    }

    try {
      if (!isPlaying) {
        // Test audio context before starting
        await metronomeAudio.playBeat(true, volume);
        setCurrentBeat(0);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error starting metronome:', error);
      Alert.alert(
        'Audio Error', 
        'Unable to start metronome. This feature requires a modern web browser with Web Audio API support.'
      );
    }
  };

  const toggleAudio = () => {
    if (!metronomeAudio.isAudioAvailable()) {
      Alert.alert(
        'Audio Not Supported',
        'Audio playback is not available in this environment. This feature requires a modern web browser with Web Audio API support.'
      );
      return;
    }
    
    if (audioEnabled && isPlaying) {
      setIsPlaying(false);
    }
    setAudioEnabled(!audioEnabled);
  };

  const resetMetronome = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
    setTempo(120);
    setTimeSignature(timeSignatures[0]);
  };

  const getTempoDescription = (bpm: number) => {
    if (bpm <= 60) return 'Very Slow';
    if (bpm <= 80) return 'Slow';
    if (bpm <= 100) return 'Moderate';
    if (bpm <= 120) return 'Medium';
    if (bpm <= 140) return 'Fast';
    if (bpm <= 160) return 'Very Fast';
    return 'Extremely Fast';
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <LinearGradient
          colors={['#dc2626', '#b91c1c']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Metronome</Text>
              <Text style={styles.headerSubtitle}>Keep perfect time</Text>
            </View>
            <TouchableOpacity 
              style={styles.audioToggle}
              onPress={toggleAudio}
            >
              {audioEnabled && metronomeAudio.isAudioAvailable() ? (
                <Volume2 size={24} color="#ffffff" />
              ) : (
                <VolumeX size={24} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {!metronomeAudio.isAudioAvailable() && (
          <View style={styles.audioWarning}>
            <Text style={styles.audioWarningText}>
              ⚠️ Audio playback is not available in this environment. For the best experience, please use a modern web browser.
            </Text>
          </View>
        )}

        {/* Main Metronome Display */}
        <View style={styles.metronomeDisplay}>
          <Animated.View style={[styles.tempoCircle, beatAnimatedStyle]}>
            <Text style={styles.tempoNumber}>{tempo}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </Animated.View>
          
          <Text style={styles.tempoDescription}>{getTempoDescription(tempo)}</Text>
          
          {/* Beat Indicator */}
          <View style={styles.beatIndicator}>
            {Array.from({ length: timeSignature.beats }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.beatDot,
                  index === currentBeat && isPlaying && styles.activeBeatDot,
                  index === 0 && styles.accentBeatDot
                ]}
              />
            ))}
          </View>
          
          <Text style={styles.timeSignatureLabel}>{timeSignature.name} - {timeSignature.description}</Text>
        </View>

        {/* Tempo Slider */}
        <View style={styles.tempoSliderSection}>
          <Text style={styles.sectionTitle}>Tempo</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>40</Text>
            <CustomSlider
              style={styles.slider}
              minimumValue={40}
              maximumValue={200}
              value={tempo}
              onValueChange={setTempo}
              step={1}
              minimumTrackTintColor="#dc2626"
              maximumTrackTintColor="#334155"
            />
            <Text style={styles.sliderLabel}>200</Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={[
              styles.playButton, 
              isPlaying && styles.playingButton,
              !metronomeAudio.isAudioAvailable() && styles.disabledButton
            ]}
            onPress={togglePlay}
            disabled={!metronomeAudio.isAudioAvailable()}
          >
            {isPlaying ? (
              <Pause size={32} color="#ffffff" />
            ) : (
              <Play size={32} color={!metronomeAudio.isAudioAvailable() ? "#64748b" : "#ffffff"} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={resetMetronome}>
            <RotateCcw size={20} color="#64748b" />
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Tempo Presets */}
        <View style={styles.presetsSection}>
          <Text style={styles.sectionTitle}>Tempo Presets</Text>
          <View style={styles.presetGrid}>
            {tempoPresets.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetCard,
                  Math.abs(tempo - preset.bpm) <= 5 && styles.activePresetCard
                ]}
                onPress={() => setTempo(preset.bpm)}
              >
                <Text style={[
                  styles.presetName,
                  Math.abs(tempo - preset.bpm) <= 5 && styles.activePresetText
                ]}>
                  {preset.name}
                </Text>
                <Text style={[
                  styles.presetBpm,
                  Math.abs(tempo - preset.bpm) <= 5 && styles.activePresetText
                ]}>
                  {preset.bpm} BPM
                </Text>
                <Text style={styles.presetDescription}>{preset.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Signatures */}
        <View style={styles.timeSignatureSection}>
          <Text style={styles.sectionTitle}>Time Signature</Text>
          <View style={styles.timeSignatureGrid}>
            {timeSignatures.map((sig, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSignatureCard,
                  timeSignature.name === sig.name && styles.activeTimeSignatureCard
                ]}
                onPress={() => setTimeSignature(sig)}
              >
                <Text style={[
                  styles.timeSignatureName,
                  timeSignature.name === sig.name && styles.activeTimeSignatureText
                ]}>
                  {sig.name}
                </Text>
                <Text style={styles.timeSignatureDescription}>{sig.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Volume Control */}
        {audioEnabled && metronomeAudio.isAudioAvailable() && (
          <View style={styles.volumeSection}>
            <Text style={styles.sectionTitle}>Volume</Text>
            <View style={styles.sliderContainer}>
              <Volume2 size={16} color="#64748b" />
              <CustomSlider
                style={styles.slider}
                minimumValue={0.1}
                maximumValue={1.0}
                value={volume}
                onValueChange={setVolume}
                step={0.1}
                minimumTrackTintColor="#dc2626"
                maximumTrackTintColor="#334155"
              />
              <Text style={styles.volumeLabel}>{Math.round(volume * 100)}%</Text>
            </View>
          </View>
        )}

        {/* Practice Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Practice Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🎯</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Start Slow</Text>
                <Text style={styles.tipText}>Begin at a comfortable tempo and gradually increase speed</Text>
              </View>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>👂</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Listen Carefully</Text>
                <Text style={styles.tipText}>Focus on staying exactly with the click, not ahead or behind</Text>
              </View>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🔄</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Practice Regularly</Text>
                <Text style={styles.tipText}>Use the metronome for scales, chords, and strumming patterns</Text>
              </View>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💪</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Build Consistency</Text>
                <Text style={styles.tipText}>Consistent timing is more important than speed</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </GestureHandlerRootView>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
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
  audioToggle: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  audioWarning: {
    backgroundColor: '#7c2d12',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ea580c',
  },
  audioWarningText: {
    fontSize: 14,
    color: '#fed7aa',
    textAlign: 'center',
    fontWeight: '500',
  },
  metronomeDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  tempoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1e293b',
    borderWidth: 4,
    borderColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  tempoNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bpmLabel: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  tempoDescription: {
    fontSize: 18,
    color: '#dc2626',
    fontWeight: '600',
    marginBottom: 20,
  },
  beatIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  beatDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#334155',
    marginHorizontal: 6,
  },
  activeBeatDot: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  accentBeatDot: {
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  timeSignatureLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  tempoSliderSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 16,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: 'transparent',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderTrackBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
  },
  sliderActiveTrack: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playingButton: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  disabledButton: {
    backgroundColor: '#374151',
    shadowColor: '#374151',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  controlButtonText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    fontWeight: '600',
  },
  presetsSection: {
    marginBottom: 32,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  activePresetCard: {
    borderColor: '#dc2626',
    backgroundColor: '#dc262610',
  },
  presetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  presetBpm: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  activePresetText: {
    color: '#dc2626',
  },
  timeSignatureSection: {
    marginBottom: 32,
  },
  timeSignatureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSignatureCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  activeTimeSignatureCard: {
    borderColor: '#dc2626',
    backgroundColor: '#dc262610',
  },
  timeSignatureName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  timeSignatureDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  activeTimeSignatureText: {
    color: '#dc2626',
  },
  volumeSection: {
    marginBottom: 32,
  },
  volumeLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  tipsSection: {
    marginBottom: 32,
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