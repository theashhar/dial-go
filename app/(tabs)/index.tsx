import { Image, StyleSheet, Platform, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { verifyInstallation } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  verifyInstallation();

  return (
    <SafeAreaView>
      <ThemedText type='subtitle'>Recent Tab</ThemedText>
    </SafeAreaView>
  );
}

