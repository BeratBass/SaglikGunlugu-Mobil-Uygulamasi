import { StackNavigationProp } from '@react-navigation/stack';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { firebase } from '../config/firebase';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import styles from '../styles/CreateStyles';
import { RootStackParamList } from '../types/navigation';

// Expo Auth Session'ın web tabanlı kimlik doğrulama akışını tamamlamasını sağlar.
WebBrowser.maybeCompleteAuthSession();

// Dokunma animasyonları için temel TouchableOpacity bileşenini sarmalar.
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Navigasyon prop'larının tip tanımını yapar.
type CreateScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Create'>;

interface CreateProps {
  navigation: CreateScreenNavigationProp;
}

/**
 * Kullanıcının e-posta veya Google ile yeni bir hesap oluşturmasını sağlayan ekran.
 */
const Create: React.FC<CreateProps> = ({ navigation }) => {
  // Asenkron işlemler sırasında yükleme durumunu yönetir.
  const [loading, setLoading] = useState(false);

  // Google kimlik doğrulaması için gerekli olan istemci ID'leri.
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
  const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_GOOGLE_ANDROID_CLIENT_ID_HERE';
  const GOOGLE_IOS_CLIENT_ID = 'YOUR_GOOGLE_IOS_CLIENT_ID_HERE';

  // Google kimlik doğrulama isteğini, yanıtını ve tetikleyici fonksiyonu yöneten hook.
  const [request, response, promptAsync] = useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
  });

  // Butonlara basıldığında animasyonlu ölçek efekti için paylaşılan değer.
  const scale = useSharedValue(1);
  // Ölçek değerine bağlı olarak animasyon stilini oluşturur.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Google kimlik doğrulama akışından gelen yanıtı işler.
  useEffect(() => {
    if (response?.type === 'success') {
      setLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      firebase.auth().signInWithCredential(credential)
        .then(() => {
          Alert.alert('Başarılı', 'Google ile giriş başarılı!');
          navigation.navigate(ROUTES.INFORMATION);
        })
        .catch((error: unknown) => {
          Alert.alert('Hata', 'Google ile giriş sırasında bir hata oluştu.');
          console.error('Google Sign-In Error:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (response?.type === 'error' || response?.type === 'cancel') {
      Alert.alert('Hata', 'Google ile giriş başarısız veya iptal edildi.');
      setLoading(false);
    }
  }, [response, navigation]);

  // Kullanıcıyı e-posta ile kayıt olacağı bilgi formuna yönlendirir.
  const handleEmailSignUp = () => {
    navigation.navigate(ROUTES.INFORMATION);
  };

  // Butonlara basıldığında yaylanma (spring) animasyonu uygular.
  const handlePress = (action: () => void) => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    action();
  };

  return (
    <View style={styles.container}>
      {/* Kullanıcıyı bir önceki ekrana (Login) döndüren buton */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(ROUTES.LOGIN)}
      >
        <Text style={styles.backButtonText}>⟵</Text>
      </TouchableOpacity>

      {/* Ekran başlıkları */}
      <Text style={styles.title}>Hesap Oluştur</Text>
      <Text style={styles.description}>Sağlık yolculuğunuza başlamak için kaydolun.</Text>

      {/* E-posta ile kayıt olma butonu */}
      <AnimatedTouchableOpacity
        style={[styles.customButton, animatedStyle]}
        onPress={() => handlePress(handleEmailSignUp)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>E-posta ile Kaydol</Text>
      </AnimatedTouchableOpacity>

      <Text style={styles.divider}>veya</Text>

      {/* Yükleme durumuna göre Google butonu veya yükleme göstergesini render eder */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
      ) : (
        <AnimatedTouchableOpacity
          style={[styles.googleButton, animatedStyle]}
          onPress={() => handlePress(() => promptAsync())}
          disabled={!request || loading}
        >
          <Image source={require('../assets/google-logo.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Google ile Devam Et</Text>
        </AnimatedTouchableOpacity>
      )}

      {/* Kullanım şartları ve gizlilik politikasını belirten metin */}
      <Text style={styles.footerText}>
        Devam ederek <Text style={{ color: COLORS.primary }}>Kullanım Şartları</Text> ve <Text style={{ color: COLORS.primary }}>Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
      </Text>
    </View>
  );
};

export default Create;