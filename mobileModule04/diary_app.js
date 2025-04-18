import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EntryDetailsPage from './screens/EntryDetailsPage';

import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from './tokenCache';

import LoginPage from './screens/LoginPage';
import AuthPage from './screens/AuthPage';
import MainTabs from './screens/MainTabs';
import NewEntryPage from './screens/NewEntryPage';
import AgendaPage from './screens/AgendaPage';

const Stack = createStackNavigator();
const CLERK_PUBLISHABLE_KEY = Constants.expoConfig.extra.clerkPublishableKey;

export default function App() {
  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="Auth" component={AuthPage} options={{ title: 'Escolha seu login' }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="NewEntry" component={NewEntryPage} options={{ title: 'Nova Entrada de Diário' }} />
            <Stack.Screen name="EntryDetails" component={EntryDetailsPage} options={{ title: 'Entrada do Diário' }} />
            <Stack.Screen name="Agenda" component={AgendaPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
