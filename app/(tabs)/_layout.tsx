import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (<>
    {/* <DialPadIcon /> */}
  
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].theme,
        // tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].bgSecondary,
        // backgroundColor: 'transparent',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            // backgroundColor: Colors[colorScheme ?? 'light'].bgSecondary, paddingBottom: 15
          },
          // android: {backgroundColor: Colors[colorScheme ?? 'light'].bgSecondary},
        }),
        // tabBarLabelStyle: {
        //   // fontSize: 12,
        //   // fontWeight: "bold",
        //   paddingBottom: 10,
        //   },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={ 
            focused
            ? "account-clock"
            : "account-clock-outline"}
            color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'contacts',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={ 
            focused
            ? "clipboard-account"
            : "clipboard-account-outline"} color={color} />,
        }}
      />
    </Tabs>
    </>);
}
