import { StyleSheet, Image, Platform, View, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

export default function DialPad() {
    const colorScheme = useColorScheme();
    return (
        <TouchableOpacity activeOpacity={0.7}
            className='absolute bottom-20 right-7 z-20 bg-emerald-500 p-4 rounded-2xl'
            style={{
                //    Shadow for iOS
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 8,
                shadowColor: Colors[colorScheme ?? 'light'].invert,
                // Shadow for Android
                elevation: 4,
            }}
            onPress={() => {router.push('/(main)/dialPad')}}

        >
            <Entypo name="dial-pad" size={28} color={Colors[colorScheme ?? 'light'].same} />
        </TouchableOpacity>
    );
}

