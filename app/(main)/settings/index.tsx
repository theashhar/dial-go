import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/reduxStore/slices/themeSlice';
import { RootState } from '@/reduxStore';
import { TouchableOpacity } from 'react-native';

export default function Settings() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
    <SafeAreaView>
      <ThemedView className="p-4">
        <ThemedText type="title" className="w-full text-center">
          Settings
        </ThemedText>

        {/* Theme Picker */}
        <ThemedView className="mt-4">
          <ThemedText type="default">Select Theme</ThemedText>
          <ThemedView className="flex-row mt-2 justify-around">
            {/* Light Theme Tab */}
            <TouchableOpacity
              className={`py-1 rounded-lg border items-center px-5 ${
                theme === 'light'
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-transparent'
              }`}
              onPress={() => dispatch(setTheme('light'))}
            >
              <ThemedText
                className={`${
                  theme === 'light'
                    ? 'text-emerald-700 dark:text-emerald-200'
                    : 'text-neutral-700 dark:text-neutral-200'
                }`}
              >
                Light
              </ThemedText>
            </TouchableOpacity>

            {/* Dark Theme Tab */}
            <TouchableOpacity
              className={`py-1 rounded-lg border items-center px-5 ${
                theme === 'dark'
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-transparent'
              }`}
              onPress={() => dispatch(setTheme('dark'))}
            >
              <ThemedText
                className={`${
                  theme === 'dark'
                    ? 'text-emerald-700 dark:text-emerald-200'
                    : 'text-neutral-700 dark:text-neutral-200'
                }`}
              >
                Dark
              </ThemedText>
            </TouchableOpacity>

            {/* System Theme Tab */}
            <TouchableOpacity
              className={`py-1 rounded-lg border items-center px-5 ${
                theme === 'system'
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-transparent'
              }`}
              onPress={() => dispatch(setTheme('system'))}
            >
              <ThemedText
                className={`${
                  theme === 'system'
                    ? 'text-emerald-700 dark:text-emerald-200'
                    : 'text-neutral-700 dark:text-neutral-200'
                }`}
              >
                System
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}