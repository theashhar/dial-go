import { Image, StyleSheet, Platform, Text, TouchableOpacity, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { verifyInstallation } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/components/AppHeader';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import DialPadIcon from '@/components/DialPadIcon'; 

export default function HomeScreen() {
  verifyInstallation();
  const colorScheme = useColorScheme();

  return (<>
      <DialPadIcon />
    <SafeAreaView className='bg-white dark:bg-emerald-950'>
      <AppHeader Screen='Call History' />
      </SafeAreaView>
      <View className='flex-1 bg-white dark:bg-neutral-900'>
        {/* <TouchableOpacity onPress={() => router.push('/(main)/file')}> */}
        <ThemedText className='w-full p-12 text-center' >Call History Error due to expo managed work flow</ThemedText>
        {/* </TouchableOpacity> */}

      </View>
</>);
}

