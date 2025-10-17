// AppNavigator.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BottomNav from '../components/BottomNav';
import { auth } from '../config/firebase';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import ChartScreen from '../screens/ChartScreen';
import Create from '../screens/Create';
import DailyLog from '../screens/DailyLog';
import EditLog from '../screens/EditLog';
import HealthTracker from '../screens/HealthTracker';
import Information from '../screens/Information';
import Login from '../screens/Login';
import ProfileScreen from '../screens/ProfileScreen';
import UpdateProfile from '../screens/UpdateProfile';
import { RootStackParamList, TabParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// --- ANA UYGULAMA EKRANLARI (Giriş yapıldıktan sonra) ---
const MainAppStack = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomNav {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name={ROUTES.DAILY_LOG} component={DailyLog} />
    <Tab.Screen name={ROUTES.HEALTH_TRACKER} component={HealthTracker} />
    <Tab.Screen name={ROUTES.CHART_SCREEN} component={ChartScreen} />
    <Tab.Screen name={ROUTES.PROFILE_SCREEN} component={ProfileScreen} />
  </Tab.Navigator>
);

// --- GİRİŞ/KAYIT EKRANLARI ---
const AuthStack = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.LOGIN}
    screenOptions={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen name={ROUTES.LOGIN} component={Login} />
    <Stack.Screen name={ROUTES.CREATE} component={Create} />
    <Stack.Screen name={ROUTES.INFORMATION} component={Information} />
  </Stack.Navigator>
);


const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Oturum durumundaki değişiklikleri dinle
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((_user) => {
      setUser(_user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  // Oturum durumu kontrol edilirken bir yüklenme ekranı göster
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // Kullanıcı giriş yapmışsa ana uygulama ekranlarını ve onlara bağlı diğer ekranları göster
            <>
              <Stack.Screen name={ROUTES.TAB_NAVIGATOR} component={MainAppStack} />
              <Stack.Screen
                name={ROUTES.EDIT_LOG}
                component={EditLog}
                options={{ title: 'Kayıt Düzenle', headerShown: true, headerBackTitle: 'Geri' }}
              />
              <Stack.Screen
                name={ROUTES.UPDATE_PROFILE}
                component={UpdateProfile}
                options={{ title: 'Profili Güncelle', headerShown: true, headerBackTitle: 'Geri' }}
              />
            </>
          ) : (
            // Kullanıcı giriş yapmamışsa sadece giriş/kayıt ekranlarını göster
            <Stack.Screen name="Auth" component={AuthStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;