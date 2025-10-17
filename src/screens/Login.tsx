// Login.tsx

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { auth } from '../config/firebase';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import styles from '../styles/LoginStyles';
import { RootStackParamList } from '../types/navigation';

// Navigasyon prop'larının tip tanımını yapar.
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
  navigation: LoginScreenNavigationProp;
}

/**
 * Kullanıcının e-posta ve şifre ile oturum açmasını sağlayan giriş ekranı.
 */
const Login: React.FC<LoginProps> = ({ navigation }) => {
  // E-posta input alanının durumunu tutar.
  const [email, setEmail] = useState('');
  // Şifre input alanının durumunu tutar.
  const [password, setPassword] = useState('');
  // Şifrenin görünür olup olmadığını yönetir.
  const [showPassword, setShowPassword] = useState(false);
  // Asenkron işlemler sırasında yükleme durumunu yönetir.
  const [loading, setLoading] = useState(false);
  // Hata mesajlarını kullanıcıya göstermek için kullanılır.
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Butonlara basıldığında animasyonlu ölçek efekti için paylaşılan değer.
  const scale = useSharedValue(1);
  // Ölçek değerine bağlı olarak animasyon stilini oluşturur.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Girilen e-posta adresinin formatını doğrular.
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Form verilerini doğrular ve Firebase ile kullanıcı girişi yapmayı dener.
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      let msg = 'E-posta veya şifre yanlış. Lütfen kontrol edin ve tekrar deneyin.';
      if (error?.message?.includes('api-key')) {
        msg = 'Firebase API anahtarınız geçersiz. Lütfen config/firebase.ts dosyasını gerçek bilgilerle doldurun.';
      }
      setErrorMsg(msg);
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Google ile giriş fonksiyonunu tetikler (şu an için Expo yönetilen projelerde pasif).
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      throw new Error('Google Sign-In not implemented in Expo-managed app. Use expo-auth-session.');
    } catch (error: any) {
      Alert.alert('Hata', 'Google ile giriş başarısız. Lütfen tekrar deneyin.');
      console.error('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının e-posta adresine şifre sıfırlama bağlantısı gönderir.
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert('Başarılı', 'Şifre sıfırlama bağlantısı e-postanıza gönderildi.');
    } catch (error: any) {
      Alert.alert('Hata', 'Şifre sıfırlama e-postası gönderilemedi. Lütfen e-postanızı kontrol edin.');
      console.error('Password Reset Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, { padding: 24, backgroundColor: '#f7f8fa', borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }]}> 
          <Image source={require('../assets/health.png')} style={{ width: 80, height: 80, alignSelf: 'center', marginBottom: 12 }} resizeMode="contain" />
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4, textAlign: 'center' }}>Sağlık Günlüğü</Text>
          <Text style={{ fontSize: 15, color: '#555', marginBottom: 24, textAlign: 'center' }}>Günlük aktivitelerinizi, beslenmenizi ve uyku düzeninizi kolayca izleyin.</Text>
          <TextInput
            style={[styles.input, { borderRadius: 12, borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 12, backgroundColor: '#fff', fontSize: 16 }]}
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={{ position: 'relative', marginBottom: 20 }}>
            <TextInput
              style={[styles.input, { borderRadius: 12, borderWidth: 1, borderColor: '#ddd', padding: 12, backgroundColor: '#fff', fontSize: 16, paddingRight: 44 }]}
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 12, top: 12, padding: 4 }}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Text style={{ fontSize: 22 }}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>
          {errorMsg && (
            <View style={{ backgroundColor: '#ffeaea', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#ffb3b3' }}>
              <Text style={{ color: '#d32f2f', fontWeight: '500', textAlign: 'center' }}>{errorMsg}</Text>
            </View>
          )}
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
          ) : (
            <>
              <Animated.View style={animatedStyle}>
                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, marginBottom: 16, shadowColor: COLORS.primary, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 }]}
                  onPress={() => {
                    scale.value = withSpring(0.95);
                    setTimeout(() => {
                      scale.value = withSpring(1);
                      handleLogin();
                    }, 100);
                  }}
                >
                  <Text style={[styles.loginButtonText, { color: '#fff', fontWeight: '600', fontSize: 16 }]}>Giriş Yap</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={animatedStyle}>
                <TouchableOpacity
                  style={[styles.registerButton, { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
                  onPress={() => {
                    scale.value = withSpring(0.95);
                    setTimeout(() => {
                      scale.value = withSpring(1);
                      navigation.navigate(ROUTES.CREATE);
                    }, 100);
                  }}
                >
                  <Text style={[styles.registerButtonText, { color: COLORS.primary, fontWeight: '600', fontSize: 16 }]}>Kayıt Ol</Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;