import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import AppIcon from './AppIcon';

interface IconExporterProps {
  size: number;
  filename?: string;
}

export default function IconExporter({ size, filename = 'guitar-hero-icon' }: IconExporterProps) {
  const iconRef = useRef<View>(null);

  const exportIcon = async () => {
    try {
      if (!iconRef.current) {
        Alert.alert('Error', 'Icon reference not found');
        return;
      }

      const uri = await captureRef(iconRef.current, {
        format: 'png',
        quality: 1.0,
        width: size,
        height: size,
      });

      // For web, create download link
      if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.download = `${filename}-${size}x${size}.png`;
        link.href = uri;
        link.click();
      } else {
        Alert.alert('Success', `Icon exported to: ${uri}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export Failed', 'Unable to export icon. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View ref={iconRef} style={styles.iconContainer}>
        <AppIcon size={size} />
      </View>
      
      <TouchableOpacity style={styles.exportButton} onPress={exportIcon}>
        <Text style={styles.exportButtonText}>
          Export {size}x{size} PNG
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconContainer: {
    backgroundColor: 'transparent',
    padding: 20,
  },
  exportButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});