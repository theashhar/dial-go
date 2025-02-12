import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  PermissionsAndroid, 
  TouchableOpacity, 
  Linking, 
  ToastAndroid
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CallLogs from 'react-native-call-log';
import AppHeader from '@/components/AppHeader';
import DialPadIcon from '@/components/DialPadIcon';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import showToast from '@/utils/toastMessage';

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    requestCallLogPermission();
  }, []);

  const requestCallLogPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Log Permission',
          message: 'This app needs access to your call logs.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
        fetchCallLogs();
      } else {
        console.log('Call Log permission denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const fetchCallLogs = async () => {
    try {
      const logs = await CallLogs.load(10); // Fetch last 10 call logs
      setCallHistory(logs);
    } catch (error) {
      console.error('Error fetching call logs:', error);
    }
  };

  const getCallType = (type: string) => {
    switch (type) {
      case '1':
        return { label: 'Incoming', icon: 'phone-incoming', color: Colors[colorScheme ?? 'light'].invertLight };
      case '2':
        return { label: 'Outgoing', icon: 'phone-outgoing', color: Colors[colorScheme ?? 'light'].invertLight };
      case '3':
        return { label: 'Missed', icon: 'phone-missed', color: 'red' };
      default:
        return { label: 'Unknown', icon: 'help-circle', color: 'gray' };
    }
  };

  // const showToast = (message: string) => {
  //   ToastAndroid.show(message, ToastAndroid.SHORT);
  // };

  const handleCall = (number: string | undefined) => {
    if (!number) {
      showToast('Invalid Number');
      return;
    }

    const phoneNumber = `tel:${number}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          showToast("Your device doesn't support phone calls.");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.error('Failed to make call:', err));
  };

  return (
    <>
      <DialPadIcon />
      <SafeAreaView className="bg-white dark:bg-emerald-950">
        <AppHeader Screen="Call History" />
      </SafeAreaView>

      <View className="flex-1 bg-white dark:bg-neutral-900 p-4">
        {hasPermission ? (
          callHistory.length > 0 ? (
            <FlatList
              data={callHistory}
              keyExtractor={(item) => item.timestamp.toString()}
              renderItem={({ item }) => {
                const { label, icon, color } = getCallType(item.type);
                return (
                  <TouchableOpacity onPress={() => handleCall(item.phoneNumber)}>
                    <View className="border-b border-gray-300 dark:border-gray-700 p-3">
                      {/* Number + Duration Row */}
                      <View className="flex flex-row justify-between items-center">
                        <Text className="text-lg font-bold dark:text-white">
                          {item.name || item.phoneNumber}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                          {item.duration}s
                        </Text>
                      </View>

                      {/* Call Type + Icon Row */}
                      <View className="flex flex-row gap-1 items-center">
                        <Text className={`text-sm ${label === 'Missed' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          {label}
                        </Text>
                        <MaterialCommunityIcons name={icon} size={14} color={color} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <ThemedText className="text-center p-4">No call history available</ThemedText>
          )
        ) : (
          <ThemedText className="text-center p-4 text-red-500">Permission denied! Unable to fetch call logs.</ThemedText>
        )}
      </View>
    </>
  );
}
