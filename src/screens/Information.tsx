// Information.tsx

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import styles from '../styles/InformationStyles';
import { RootStackParamList } from '../types/navigation';

// Navigasyon prop'larının tip tanımını yapar.
type InformationNavigationProp = StackNavigationProp<RootStackParamList, 'Information'>;

/**
 * Kullanıcının e-posta ile kayıt olmak için gerekli kişisel bilgilerini girdiği form ekranı.
 */
const Information = () => {
  // Navigasyon fonksiyonlarına erişim sağlar.
  const navigation = useNavigation<InformationNavigationProp>();
  // Formdaki tüm input alanlarının durumunu tek bir state nesnesinde yönetir.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    username: '',
    age: '',
    bio: '',
  });
  // Şifre alanının görünürlüğünü yönetir.
  const [showPassword, setShowPassword] = useState(false);
  // Şifre onayı alanının görünürlüğünü yönetir.
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Kayıt işlemi sırasındaki yükleme durumunu yönetir.
  const [loading, setLoading] = useState(false);

  // Butonlara basıldığında animasyonlu ölçek efekti için paylaşılan değer.
  const scale = useSharedValue(1);
  // Ölçek değerine bağlı olarak animasyon stilini oluşturur.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Formdaki herhangi bir input alanı değiştiğinde formData state'ini günceller.
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Girilen e-posta adresinin formatını doğrular.
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Form verilerini doğrular, Firebase ile kullanıcı oluşturur ve Firestore'a kaydeder.
  const handleSignUp = async () => {
    const { name, surname, username, email, password, confirmPassword, age, bio } = formData;
    if (!name || !surname || !username || !email || !password || !age || !bio) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (Number(age) < 1 || Number(age) > 120) {
      Alert.alert('Hata', 'Yaş 1 ile 120 arasında olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await db.collection('users').doc(user.uid).set({
          name,
          surname,
          username,
          email,
          age,
          bio,
          createdAt: new Date().toISOString(),
        });

        Alert.alert('Başarılı', 'Hesabınız başarıyla oluşturuldu!', [
          { text: 'Tamam', onPress: () => navigation.navigate(ROUTES.LOGIN) },
        ]);
      } else {
        throw new Error("Kullanıcı oluşturulamadı.");
      }
    } catch (error: any) {
      console.error('SignUp Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Hata', 'Bu e-posta adresi zaten kullanılıyor.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Hata', 'Şifreniz en az 6 karakter olmalıdır.');
      } else {
        Alert.alert('Hata', `Kayıt olurken bir hata oluştu: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Butona basıldığında animasyon uygular ve ardından kayıt işlemini başlatır.
  const handlePress = () => {
    scale.value = withSpring(0.95);
    setTimeout(() => {
      scale.value = withSpring(1);
      handleSignUp();
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.CREATE)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Bilgilerini Gir</Text>
          <Text style={styles.description}>Hesabını oluşturmak için formu doldur.</Text>

          <TextInput style={styles.input} placeholder="İsim" value={formData.name} onChangeText={v => handleInputChange('name', v)} />
          <TextInput style={styles.input} placeholder="Soyisim" value={formData.surname} onChangeText={v => handleInputChange('surname', v)} />
          <TextInput style={styles.input} placeholder="Kullanıcı Adı" value={formData.username} onChangeText={v => handleInputChange('username', v)} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="E-posta" value={formData.email} onChangeText={v => handleInputChange('email', v)} keyboardType="email-address" autoCapitalize="none" />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Şifre"
              value={formData.password}
              onChangeText={v => handleInputChange('password', v)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
              <Text>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Şifreyi Onayla"
              value={formData.confirmPassword}
              onChangeText={v => handleInputChange('confirmPassword', v)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.showPasswordButton}>
              <Text>{showConfirmPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} placeholder="Yaş" value={formData.age} onChangeText={v => handleInputChange('age', v)} keyboardType="numeric" />
          <TextInput style={[styles.input, styles.bioInput]} placeholder="Bio" value={formData.bio} onChangeText={v => handleInputChange('bio', v)} multiline numberOfLines={3} />

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
          ) : (
            <Animated.View style={animatedStyle}>
              <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>Hesabı Oluştur</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Information;