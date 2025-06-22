import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppIcon from '@/components/AppIcon';
import IconExporter from '@/components/IconExporter';

export default function IconPreview() {
  return (
    <LinearGradient
      colors={['#0f0f23', '#1e1b4b', '#312e81']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Guitar Hero Style App Icon</Text>
        <Text style={styles.subtitle}>Production-Ready Icon Design</Text>
        
        {/* Large Preview */}
        <View style={styles.iconContainer}>
          <AppIcon size={300} />
          <Text style={styles.iconLabel}>300x300 - Large Preview</Text>
        </View>
        
        {/* Export Section */}
        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Export Icons</Text>
          <Text style={styles.exportDescription}>
            Click the buttons below to download PNG files at different sizes
          </Text>
          
          <View style={styles.exportGrid}>
            <IconExporter size={1024} filename="guitar-hero-icon-appstore" />
            <IconExporter size={512} filename="guitar-hero-icon-large" />
            <IconExporter size={256} filename="guitar-hero-icon-medium" />
            <IconExporter size={128} filename="guitar-hero-icon-small" />
          </View>
        </View>
        
        {/* Different Sizes */}
        <View style={styles.sizesContainer}>
          <Text style={styles.sectionTitle}>Icon Sizes</Text>
          
          <View style={styles.sizeRow}>
            <View style={styles.sizeItem}>
              <AppIcon size={120} />
              <Text style={styles.sizeLabel}>120x120</Text>
            </View>
            
            <View style={styles.sizeItem}>
              <AppIcon size={80} />
              <Text style={styles.sizeLabel}>80x80</Text>
            </View>
            
            <View style={styles.sizeItem}>
              <AppIcon size={60} />
              <Text style={styles.sizeLabel}>60x60</Text>
            </View>
            
            <View style={styles.sizeItem}>
              <AppIcon size={40} />
              <Text style={styles.sizeLabel}>40x40</Text>
            </View>
          </View>
        </View>
        
        {/* Design Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Design Features</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎸</Text>
              <Text style={styles.featureText}>Detailed acoustic guitar with realistic proportions</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎵</Text>
              <Text style={styles.featureText}>Guitar Hero style colored note buttons</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={styles.featureText}>Glowing effects and sparkle animations</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎨</Text>
              <Text style={styles.featureText}>Rich gradients and professional shadows</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Scalable vector graphics for all screen sizes</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌟</Text>
              <Text style={styles.featureText}>Gaming aesthetic with musical elements</Text>
            </View>
          </View>
        </View>
        
        {/* Color Palette */}
        <View style={styles.paletteContainer}>
          <Text style={styles.sectionTitle}>Color Palette</Text>
          
          <View style={styles.colorGrid}>
            <View style={styles.colorItem}>
              <View style={[styles.colorSwatch, { backgroundColor: '#10b981' }]} />
              <Text style={styles.colorLabel}>Green Note</Text>
            </View>
            
            <View style={styles.colorItem}>
              <View style={[styles.colorSwatch, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.colorLabel}>Red Note</Text>
            </View>
            
            <View style={styles.colorItem}>
              <View style={[styles.colorSwatch, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.colorLabel}>Yellow Note</Text>
            </View>
            
            <View style={styles.colorItem}>
              <View style={[styles.colorSwatch, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.colorLabel}>Blue Note</Text>
            </View>
            
            <View style={styles.colorItem}>
              <View style={[styles.colorSwatch, { backgroundColor: '#f97316' }]} />
              <Text style={styles.colorLabel}>Orange Note</Text>
            </View>
            
            <View style={styles.colorItem}>
              <View style={[styles.colorSwatch, { backgroundColor: '#d97706' }]} />
              <Text style={styles.colorLabel}>Guitar Body</Text>
            </View>
          </View>
        </View>
        
        {/* Usage Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Usage Instructions</Text>
          
          <View style={styles.instructionsList}>
            <Text style={styles.instruction}>
              1. Use the export buttons above to download PNG files
            </Text>
            <Text style={styles.instruction}>
              2. 1024x1024 is perfect for app store submission
            </Text>
            <Text style={styles.instruction}>
              3. 512x512 works great for high-resolution displays
            </Text>
            <Text style={styles.instruction}>
              4. Test visibility on both light and dark backgrounds
            </Text>
            <Text style={styles.instruction}>
              5. Ensure the icon remains recognizable at small sizes
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 16,
    fontWeight: '500',
  },
  exportSection: {
    width: '100%',
    marginBottom: 40,
  },
  exportDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  exportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sizesContainer: {
    width: '100%',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sizeItem: {
    alignItems: 'center',
  },
  sizeLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    fontWeight: '500',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featuresList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#e2e8f0',
    flex: 1,
    lineHeight: 24,
  },
  paletteContainer: {
    width: '100%',
    marginBottom: 40,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 16,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  colorLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  instructionsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instruction: {
    fontSize: 16,
    color: '#e2e8f0',
    lineHeight: 24,
    marginBottom: 12,
  },
});