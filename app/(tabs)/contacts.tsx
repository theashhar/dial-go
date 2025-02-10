import { StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ContactsScreen() {
  return (
    <SafeAreaView>
      <ThemedText type='subtitle'>Contacts Tab</ThemedText>
      <TouchableOpacity onPress={() => router.push('/(main)/file')}>
      <ThemedText>file</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

