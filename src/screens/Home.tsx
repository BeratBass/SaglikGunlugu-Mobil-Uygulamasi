// Home.tsx

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { firebase } from '../config/firebase';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import styles from '../styles/HomeStyles';
import { RootStackParamList } from '../types/navigation';

// Navigasyon prop'larının tip tanımını yapar.
type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

/**
 * Uygulamanın başlangıç (splash) ekranı. Animasyon gösterir ve oturum durumuna göre yönlendirme yapar.
 */
const Home = () => {
  // Navigasyon fonksiyonlarına erişim sağlar.
  const navigation = useNavigation<HomeNavigationProp>();
  // Giriş animasyonu için opaklık değerini yöneten paylaşılan değer.
  const opacity = useSharedValue(0);

  // Opaklık değerine bağlı olarak animasyon stilini oluşturur.
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Bileşen yüklendiğinde animasyonu başlatır ve kullanıcının oturum durumunu kontrol eder.
  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 1200 }),
      withTiming(0, { duration: 1200 })
    );

    const unsubscribe = firebase.auth().onAuthStateChanged((user: unknown) => {
      setTimeout(() => {
        if (user) {
          navigation.replace(ROUTES.TAB_NAVIGATOR, {
            screen: ROUTES.DAILY_LOG,
          });
        } else {
          navigation.replace(ROUTES.LOGIN);
        }
      }, 2500);
    });

    return () => unsubscribe();
  }, [navigation, opacity]);

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Animated.View style={animatedStyle}>
          <Image
            source={require('../assets/sagliklogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Sağlık Günlüğü</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default Home;