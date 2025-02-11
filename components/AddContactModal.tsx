import React, { useState } from 'react';
import { Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import * as Contacts from 'expo-contacts';
import showToast from '@/utils/toastMessage';
import { setLoading, setContacts } from '@/reduxStore/slices/contactSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reduxStore';

interface ContactModalProps {
    contactNumber?: string;
}

export default function AddContactModal({ contactNumber = '' }: ContactModalProps) {
    const dispatch = useDispatch();
    const { contacts, loading, error } = useSelector((state: RootState) => state.contacts);

    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState(contactNumber);

    const saveContact = async () => {
        if (!contactName.trim()) {
            showToast('Please enter a valid name.');
            return;
        }
        if (!contactPhone.trim()) {
            showToast('Please enter a valid phone number.');
            return;
        }

        try {
            dispatch(setLoading(true));
            // Request contact permissions
            const { status: readStatus } = await Contacts.requestPermissionsAsync();
            const { status: writeStatus } = await Contacts.requestPermissionsAsync("android.permission.WRITE_CONTACTS");

            if (readStatus !== 'granted' || writeStatus !== 'granted') {
                showToast('Permission to access contacts was denied.');
                return;
            }

            // Prepare the contact data
            const contact = {
                [Contacts.Fields.FirstName]: contactName,
                [Contacts.Fields.PhoneNumbers]: [{ number: contactPhone }],
            };
            console.log('contact', contact);
            // Create the contact
            await Contacts.addContactAsync(contact);
            showToast('Contact added successfully!', 'success');

            // Fetch the updated list of contacts
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.FirstName, Contacts.Fields.PhoneNumbers],
            });

            // Update the Redux state with the new list of contacts
            dispatch(setContacts(data));

        } catch (error) {
            console.error('Failed to add contact:', error);
            showToast('Failed to add contact.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="w-full"
        >
            <ThemedView className="absolute bottom-0 w-full p-4 bg-white shadow-lg border-t border-neutral-200 dark:border-neutral-600">
                <ThemedText type="title" className="text-center mb-4">Add New Contact</ThemedText>
                <TextInput
                    className="w-full p-2 mb-4 border color-white border-gray-300 rounded-lg"
                    placeholder="Enter Name"
                    value={contactName}
                    onChangeText={setContactName}
                />
                <TextInput
                    className="w-full p-2 mb-4 border color-white border-gray-300 rounded-lg"
                    placeholder="Enter Phone Number"
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    keyboardType="phone-pad"
                />
                <TouchableOpacity
                    className="w-full p-4 bg-green-500 rounded-full justify-center items-center shadow-lg"
                    onPress={saveContact}
                >
                    <ThemedText type="title" className="text-white">Save Contact</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </TouchableOpacity>
    );
}