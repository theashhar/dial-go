import { FlatList, TouchableOpacity, ActivityIndicator, View, Text, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import * as Contacts from 'expo-contacts';
import AppHeader from '@/components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reduxStore';
import { setContacts, setLoading, setError } from '@/reduxStore/slices/contactSlice';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state: RootState) => state.contacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  useEffect(() => {
    const fetchContacts = async () => {
      dispatch(setLoading(true));
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
          });
          
          if (data.length > 0) {
            dispatch(setContacts(data));
          } else {
            dispatch(setError('No contacts found.'));
          }
        } else {
          dispatch(setError('Permission to access contacts was denied.'));
        }
      } catch (err) {
        dispatch(setError('Failed to fetch contacts.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchContacts();
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const queryLower = searchQuery.toLowerCase();
      const results = contacts.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(queryLower) ||
          contact.phoneNumbers?.some((phone) => phone.number.toLowerCase().includes(queryLower))
      );
      setFilteredContacts(results);
    }
  }, [searchQuery, contacts]);

  const renderContact = ({ item }: { item: Contacts.Contact }) => {
    const firstLetter = item.name ? item.name.charAt(0).toUpperCase() : '';

    return (
      <>
        <TouchableOpacity
          className="p-2 mb-2 bg-transparent rounded-lg flex-row items-center"
          accessible={true}
          accessibilityLabel={`Contact: ${item.name}`}
          accessibilityRole="button"
        >
          {/* Image or Fallback */}
          <View className="w-12 h-12 rounded-full bg-emerald-200 dark:bg-emerald-900 justify-center items-center mr-4">
            {item.image ? (
              <Image
                source={{ uri: item.image.uri ?? '' }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <ThemedText className="text-lg font-semibold text-gray-800 dark:text-white">
                {firstLetter}
              </ThemedText>
            )}
          </View>

          {/* Contact Details */}
          <View className="flex-1">
            <ThemedText className="text-lg font-semibold">{item.name}</ThemedText>
            {item.phoneNumbers && (
              <Text className="text-neutral-600 text-sm dark:text-neutral-400">
                {item.phoneNumbers[0]?.number}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View className='ml-6 h-[1px] bg-neutral-100 dark:bg-emerald-900' />
      </>
    );
  };

  if (error) {
    return (
      <SafeAreaView className="bg-white dark:bg-emerald-950 flex-1 justify-center items-center">
        <ThemedText className="text-red-500 text-center">{error}</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white dark:bg-emerald-950 flex-1">
      <AppHeader Screen="Contacts" />
      <ThemedView className="p-4 my-0 shadow-sm border-b bg-slate-800 border-neutral-200 dark:border-neutral-600">
        <TextInput
          className="w-full p-2 my-0 border color-neutral-800 dark:color-neutral-200 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg"
          placeholder="Search contacts..."
          value={searchQuery}
          placeholderTextColor={Colors[colorScheme ?? 'light'].invertLight}
          onChangeText={setSearchQuery}
        />
      </ThemedView>
      <ThemedView className="p-4 pt-0 bg-white dark:bg-black flex-1">
        {loading ? (
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        ) : (
          <FlatList
            data={filteredContacts as Contacts.Contact[]}
            keyExtractor={(item) => item.id || Math.random().toString() }
            renderItem={renderContact}
            ListEmptyComponent={
              <ThemedText className="text-center text-gray-600 dark:text-gray-400">
                No contacts found.
              </ThemedText>
            }
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
