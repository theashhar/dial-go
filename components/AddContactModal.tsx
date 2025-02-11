import React, { useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import * as Contacts from "expo-contacts";
import showToast from "@/utils/toastMessage";
import { setLoading, setContacts } from "@/reduxStore/slices/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reduxStore";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";

interface ContactModalProps {
    contactNumber?: string;
    onSaveSuccess?: () => void; // Callback to notify parent of successful save
}

export default function AddContactModal({ contactNumber = "", onSaveSuccess }: ContactModalProps) {
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();
    const { contacts, loading, error } = useSelector((state: RootState) => state.contacts);

    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState(contactNumber);

    const saveContact = async () => {
        if (!contactName.trim()) {
            showToast("Please enter a valid name.");
            return;
        }
        if (!contactPhone.trim()) {
            showToast("Please enter a valid phone number.");
            return;
        }

        try {
            dispatch(setLoading(true));
            // Request contact permissions
            const { status: readStatus } = await Contacts.requestPermissionsAsync();
            const { status: writeStatus } = await Contacts.requestPermissionsAsync("android.permission.WRITE_CONTACTS");

            if (readStatus !== "granted" || writeStatus !== "granted") {
                showToast("Permission to access contacts was denied.");
                return;
            }

            // Prepare the contact data
            const contact = {
                [Contacts.Fields.FirstName]: contactName,
                [Contacts.Fields.PhoneNumbers]: [{ number: contactPhone }],
            };
            console.log("contact", contact);
            // Create the contact
            await Contacts.addContactAsync(contact);
            showToast("Contact added successfully!", "success");

            // Fetch the updated list of contacts
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.FirstName, Contacts.Fields.PhoneNumbers],
            });

            // Update the Redux state with the new list of contacts
            dispatch(setContacts(data));

            // Notify parent of successful save
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.error("Failed to add contact:", error);
            showToast("Failed to add contact.");
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
                <ThemedText type="defaultSemiBold" className="text-center mb-4">
                    Add New Contact
                </ThemedText>
                <TextInput
                    className="w-full p-3 px-4 mb-4 border color-neutral-800 dark:color-neutral-200 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg"
                    placeholder="Enter Name"
                    placeholderTextColor={Colors[colorScheme ?? "light"].invertLight}
                    value={contactName}
                    onChangeText={setContactName}
                />
                <TextInput
                    className="w-full p-3 px-4 mb-4 border color-neutral-800 dark:color-neutral-200 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg"
                    placeholder="Enter Phone Number"
                    placeholderTextColor={Colors[colorScheme ?? "light"].invertLight}
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    keyboardType="phone-pad"
                />
                <TouchableOpacity
                    className="w-full p-4 bg-emerald-500 dark:bg-emerald-800 rounded-full justify-center items-center shadow-lg"
                    onPress={saveContact}
                >
                    <ThemedText type="defaultSemiBold" className="">
                        Save Contact
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </TouchableOpacity>
    );
}