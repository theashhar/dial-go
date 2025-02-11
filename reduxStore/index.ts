import { configureStore, combineReducers } from '@reduxjs/toolkit';
import contactsReducer from './slices/contactSlice';
import themeReducer from './slices/themeSlice'; // Import your theme slice
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';


const persistConfig = {
  key: 'root', 
  storage: AsyncStorage, 
  whitelist: ['contacts', 'theme'], // slices to persist
};

const rootReducer = combineReducers({
  contacts: contactsReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;