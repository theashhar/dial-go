import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme.web"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useState } from "react"
import { Modal, TouchableOpacity } from "react-native"
import AddContactModal from "./AddContactModal"

const AddContactIcon = () => {
    const colorScheme = useColorScheme()
    const [isAddContactVisible, setIsAddContactVisible] = useState(false);

    return (<>
        <TouchableOpacity
            activeOpacity={0.7}
            className='absolute bottom-10 right-7 z-20 bg-emerald-500 p-4 rounded-2xl'
            style={{
                // Shadow for iOS
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 8,
                shadowColor: Colors[colorScheme ?? 'light'].invert,
                // Shadow for Android
                elevation: 4,
            }}
            onPress={() => setIsAddContactVisible(true)}
        >
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddContactVisible}
                onRequestClose={() => setIsAddContactVisible(false)}
            >
                <TouchableOpacity
                    className="flex-1 justify-end bg-black/50"
                    activeOpacity={1}
                    onPress={() => setIsAddContactVisible(false)}
                >

                    <AddContactModal />
                </TouchableOpacity>
            </Modal>
            <MaterialCommunityIcons name="phone-plus" size={28} color={Colors[colorScheme ?? 'light'].same} />
        </TouchableOpacity>
    </>)
}
export default AddContactIcon