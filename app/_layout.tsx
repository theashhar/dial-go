import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import DialPadIcon from '@/components/DialPadIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { persistor, RootState, store } from '@/reduxStore';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setTheme } from '@/reduxStore/slices/themeSlice';
// import { setTheme } from '@/reduxStore/themeSlice'; // Import your theme slice actions

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function ThemeWrapper({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector((state : RootState) => state.theme.theme); // Get theme from Redux
  const colorScheme = useColorScheme(); // Get system color scheme

  // Update theme when system theme changes
  useEffect(() => {
    if (theme === 'system') {
      dispatch(setTheme(colorScheme)); // Set theme to system theme
    }
  }, [colorScheme]);

  // Determine the theme to pass to ThemeProvider
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={navigationTheme}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeWrapper>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="auto" />
            <Toast />
          </ThemeWrapper>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}