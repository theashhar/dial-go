// OBSOLETE
// OBSOLETE
// OBSOLETE
// OBSOLETE
// OBSOLETE
// OBSOLETE
// OBSOLETE
// OBSOLETE


import { Text, TouchableOpacity, View, Vibration, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Linking, Alert } from 'react-native';

export default function Settings() {
  const colorScheme = useColorScheme();
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialPadVisible, setIsDialPadVisible] = useState(true);

console.log(input)
  // Sample contact data
  const contacts = [
    { name: 'Joko Widarto', obsidiario: '1770', category: 'n' },
    { name: 'Prasajo Suriento', obsidiario: '1070', category: 'n' },
    { name: 'Indah Suprapto', obsidiario: '900', egencia: 'n' },
    { name: 'Yatro Kawaguchi', obsidiario: '700', category: 'n' },
    { name: 'Inem Sulastri', obsidiario: '1083', category: 'n' },
  ];

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle number input
  const handleInput = (digit: string) => {
    setInput((prev) => prev + digit);
    Vibration.vibrate(50); // Add haptic feedback
  };


  // Handle backspace (cut button)
  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
    Vibration.vibrate(50); // Add haptic feedback
  };

  // Handle long press to clear input
  const handleClear = () => {
    setInput('');
    Vibration.vibrate(100); // Add haptic feedback
  };

  // Handle call button press
  const handleCall = () => {
    if (!input) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return;
    }
  
    const phoneNumber = `tel:${input}`;
  
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Your device doesn't support phone calls.");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.error("Failed to make call:", err));
  };
  

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-black">
      {/* Search Bar */}
      <ThemedView className="p-4 shadow-sm">
        <TextInput
          className="w-full p-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg"
          placeholder="Search contacts..."
          value={searchQuery}
          placeholderTextColor={Colors[colorScheme ?? 'light'].invert}
          onChangeText={setSearchQuery}
        />
      </ThemedView>

      {/* Contact List */}
      {/* <ScrollView className="flex-1 p-4">
        <ThemedText className="text-xl font-bold mb-4">Dialer</ThemedText>
        {filteredContacts.map((contact, index) => (
          <ThemedView key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <ThemedText className="text-lg font-semibold">{contact.name}</ThemedText>
            <ThemedText className="text-gray-600">OBSIDIARIO: {contact.obsidiario}</ThemedText>
            <ThemedText className="text-gray-600">Categoria: {contact.category}</ThemedText>
          </ThemedView>
        ))}
      </ScrollView> */}

        {/* Dial Pad Modal */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={isDialPadVisible}
        onRequestClose={() => setIsDialPadVisible(false)}
      >
        <ThemedView className="absolute bottom-0 w-full p-4 bg-white shadow-lg border-t border-neutral-200 dark:border-neutral-600">
          {/* Display Dialed Numbers */}
          <ThemedView className="mb-4 p-4 bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <ThemedText
              type='title'
              selectable
              className="text-center"
              style={{opacity: input ? 1 : 0.4}}
            >
              {input || 'Dial a number'}
            </ThemedText>
          </ThemedView>

          <ThemedView className="mb-4">
            {/* <ThemedText className="text-2xl font-bold mb-8">Dialpad</ThemedText> */}
            <ThemedView className="flex-row justify-around mb-4">
              {['1', '2', '3'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  className="w-20 h-20 rounded-full justify-center items-center bg-gray-200 dark:bg-emerald-950 shadow-sm"
                  onPress={() => handleInput(digit)}
                >
                  <ThemedText type="title">{digit}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
            <ThemedView className="flex-row justify-around mb-4">
              {['4', '5', '6'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  className="w-20 h-20 rounded-full justify-center items-center bg-gray-200 dark:bg-emerald-950 shadow-sm"
                  onPress={() => handleInput(digit)}
                >
                  <ThemedText type="title">{digit}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
            <ThemedView className="flex-row justify-around mb-4">
              {['7', '8', '9'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  className="w-20 h-20 rounded-full justify-center items-center bg-gray-200 dark:bg-emerald-950 shadow-sm"
                  onPress={() => handleInput(digit)}
                >
                  <ThemedText type="title">{digit}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
            <ThemedView className="flex-row justify-around">
              <TouchableOpacity
                className="w-20 h-20 rounded-full justify-center pt-6 items-center bg-gray-200 dark:bg-emerald-950 shadow-sm"
                onPress={() => handleInput('*')}
              >
                <ThemedText type="megaTitle">*</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-20 h-20 rounded-full justify-center items-center bg-gray-200 dark:bg-emerald-950 shadow-sm"
                onPress={() => handleInput('0')}
                onLongPress={() => handleInput('+')}
              >
                <ThemedText type="title">0</ThemedText>
                <ThemedText className='absolute bottom-1' style={{opacity:0.4}} type="small">+</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-20 h-20 rounded-full justify-center items-center bg-gray-200 dark:bg-emerald-950 shadow-sm"
                onPress={() => handleInput('#')}
              >
                <ThemedText type="title">#</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Call and Cut Buttons */}
          <ThemedView className="flex-row justify-between space-x-4">
            <TouchableOpacity
              className="w-24 p-4  justify-center items-center shadow-lg"
              // onPress={toogleDownDialPad}
            >
              <MaterialCommunityIcons name="chevron-down" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 p-4 bg-green-500 rounded-full justify-center items-center shadow-lg"
              onPress={handleCall}
            >
              <MaterialCommunityIcons name="phone" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 p-4  justify-center items-center shadow-lg"
              onPress={handleBackspace}
              onLongPress={handleClear}

            >
              <MaterialCommunityIcons name="backspace" size={25} color="white" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    </SafeAreaView>
  );
}