import { StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import * as Contacts from 'expo-contacts';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  // Request contacts permission and fetch contacts
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      } else {
        alert('Permission to access contacts was denied.');
      }
    })();
  }, []);
  console.log(contacts)


  return (
    <>
      <SafeAreaView className="bg-white dark:bg-emerald-950">
        <AppHeader Screen="Contacts" />
      </SafeAreaView>

      <ScrollView className="flex-1 p-4 bg-white dark:bg-black">
        {contacts.length > 0 ? (
          contacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              className="p-4 mb-2 bg-gray-100 dark:bg-emerald-950 rounded-lg"
              // onPress={() => {
              //   // Navigate to a contact detail screen or perform an action
              //   router.push({
              //     pathname: '/contactDetail',
              //     params: { contactId: contact.id },
              //   });
              // }}
            >
              <ThemedText className="text-lg font-semibold">
                {contact.name}
              </ThemedText>
              {contact.phoneNumbers && (
                <ThemedText className="text-gray-600 dark:text-gray-400">
                  {contact.phoneNumbers[0]?.number}
                </ThemedText>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <ThemedText className="text-center text-gray-600 dark:text-gray-400">
            No contacts found.
          </ThemedText>
        )}
      </ScrollView>
    </>
  );
}