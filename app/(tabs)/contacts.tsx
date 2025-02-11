import React, { useEffect, useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  Image,
  TextInput,
  Linking,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Contacts from 'expo-contacts';
import AppHeader from '@/components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reduxStore';
import { setContacts, setLoading, setError } from '@/reduxStore/slices/contactSlice';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import showToast from '@/utils/toastMessage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AddContactIcon from '@/components/AddContactIcon';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import { RectButton } from 'react-native-gesture-handler'; // Import RectButton for swipe actions

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

  // Function to handle contact deletion
  const handleDeleteContact = async (contactId: string) => {
    try {
      dispatch(setLoading(true));
      // Delete the contact from the device
      await Contacts.removeContactAsync(contactId);
      showToast('Contact deleted successfully!', 'success');

      // Fetch the updated list of contacts
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      // Update the Redux state with the new list of contacts
      dispatch(setContacts(data));
    } catch (error) {
      console.error('Failed to delete contact:', error);
      showToast('Failed to delete contact.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Function to show delete confirmation alert
  const confirmDelete = (contactId: string, contactName: string) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contactName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDeleteContact(contactId), style: 'destructive' },
      ]
    );
  };

  // Render swipeable delete action
  const renderRightActions = (contactId: string, contactName: string) => {
    return (
      <RectButton
        style={styles.deleteButton}
        onPress={() => confirmDelete(contactId, contactName)}
      >
        <MaterialCommunityIcons name="delete" size={24} color="white" />
      </RectButton>
    );
  };

  const renderContact = ({ item }: { item: Contacts.Contact }) => {
    const firstLetter = item.name ? item.name.charAt(0).toUpperCase() : '';

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
      <Swipeable
        renderRightActions={() => renderRightActions(item.id, item.name)} // Swipe from right to delete
        overshootRight={false} // Disable overshoot effect
      >
        <ThemedView className="p-2 py-4 mb-0 bg-transparent rounded-lg flex-row items-center">
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
            <TouchableOpacity
              className="absolute right-1 top-5"
              onPress={() => handleCall(item.phoneNumbers[0]?.number)}
            >
              <MaterialCommunityIcons name="phone-outgoing" size={20} color={Colors.theme} />
            </TouchableOpacity>
          </View>
        </ThemedView>
        <View className="ml-6 h-[1px] bg-neutral-100 dark:bg-emerald-900" />
      </Swipeable>
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
      <AddContactIcon />
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
            keyExtractor={(item) => item.id || Math.random().toString()}
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

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});