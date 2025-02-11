// toastMessage.ts
import Toast from 'react-native-toast-message';
import { Vibration } from 'react-native';

/**
 * Displays a toast message with optional vibration on errors.
 * @param message - The message to display.
 * @param type - The type of toast to show ("success" by default).
 */
const showToast = (message: string, type: "success" | "error" = "error"): void => {
  const vibrationPattern = [0, 50, 80, 50];

  if (type === "error") {
    Vibration.vibrate(vibrationPattern);
  }

  Toast.show({
    type,
    text1: message,
    visibilityTime: 2000,
    autoHide: true,
  });
};

export default showToast;
