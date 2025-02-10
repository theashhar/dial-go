import { Image, StyleSheet, Platform, Text, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function AppHeader({ Screen }: { Screen: string }) {
  const colorScheme = useColorScheme();

  return (<>
    <View className='flex flex-row justify-between items-center py-2 px-2 '>
      <MaterialCommunityIcons name="chevron-left" size={28} color={Colors[colorScheme ?? 'light'].tint} onPress={() => router.back()} />
      <ThemedText type='title'>{Screen}</ThemedText>
      <MaterialCommunityIcons name="cog" size={25} className='mr-2' color={Colors[colorScheme ?? 'light'].tint} 
      onPress={() => {
        console.log('Navigating to settings');
        router.push('/(main)/settings');
      }} />
    </View>
      <View className='h-[1px] bg-neutral-300 dark:bg-neutral-700 ' />
  </>);
}

