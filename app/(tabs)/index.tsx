import { Image, StyleSheet, Platform, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native';

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
import CallLogs from 'react-native-call-log'
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  verifyInstallation();
  const colorScheme = useColorScheme();

  const callLogs = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Log Example',
          message:
            'Access your call logs',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true)
        console.log(CallLogs);
        CallLogs.load(5).then((c : any) => console.log(c));
      } else {
        console.log('Call Log permission denied');
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    callLogs();
  }, [])
  
  return (<>
      <DialPadIcon />
    <SafeAreaView className='bg-white dark:bg-emerald-950'>
      <AppHeader Screen='Call History' />
      </SafeAreaView>
      <View className='flex-1 bg-white dark:bg-neutral-900'>
        {/* <TouchableOpacity onPress={() => router.push('/(main)/file')}> */}
        {hasPermission ? (
         <ThemedText className='w-full p-12 text-center' >Call History permission got ✨ </ThemedText> ) : (
        <ThemedText className='w-full p-12 text-center' >Call History Error due to expo managed work flow</ThemedText>
      )}
        {/* </TouchableOpacity> */}

      </View>
</>);
}

