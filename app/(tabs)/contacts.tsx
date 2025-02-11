import { FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect } from 'react';
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

  const renderContact = ({ item }: { item: Contacts.Contact }) => (
    <TouchableOpacity
      className="p-4 mb-2 bg-gray-100 dark:bg-emerald-950 rounded-lg"
      // Uncomment and customize for navigation:
      // onPress={() => router.push(`/contactDetail?contactId=${item.id}`)}
    >
      <ThemedText className="text-lg font-semibold">{item.name}</ThemedText>
      {item.phoneNumbers && (
        <ThemedText className="text-gray-600 dark:text-gray-400">
          {item.phoneNumbers[0]?.number}
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="bg-white dark:bg-emerald-950 flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </SafeAreaView>
    );
  }

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
      <ThemedView className="p-4 bg-white dark:bg-black flex-1">
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderContact}
          ListEmptyComponent={
            <ThemedText className="text-center text-gray-600 dark:text-gray-400">
              No contacts found.
            </ThemedText>
          }
        />
      </ThemedView>
    </SafeAreaView>
  );
}