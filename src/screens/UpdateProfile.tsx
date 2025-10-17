// UpdateProfile.tsx

import { StackScreenProps } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FileText, Hash, MessageSquare, User } from 'react-native-feather';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/colors';
import styles from '../styles/UpdateProfileStyles';
import { RootStackParamList } from '../types/navigation';

// Navigasyon prop'larının tip tanımını yapar.
type UpdateProfileProps = StackScreenProps<RootStackParamList, 'UpdateProfile'>;

// Form state'i için veri yapısını tanımlar.
interface FormData {
  name: string;
  surname: string;
  username: string;
  age: string;
  bio: string;
}

/**
 * Kullanıcının ad, soyad, yaş gibi kişisel profil bilgilerini güncellemesini sağlayan ekran.
 */
const UpdateProfile: FC<UpdateProfileProps> = ({ navigation }) => {
  // Formdaki input alanlarının güncel değerlerini tutar.
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    username: '',
    age: '',
    bio: '',
  });
  // İlk veri yükleme durumunu yönetir.
  const [loading, setLoading] = useState(true);
  // Güncelleme işlemi sırasındaki yükleme durumunu yönetir.
  const [isUpdating, setIsUpdating] = useState(false);

  // Bileşen yüklendiğinde mevcut kullanıcının verilerini Firestore'dan çeker.
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Hata', 'Oturum açmış bir kullanıcı bulunamadı.');
      navigation.goBack();
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data?.name || '',
            surname: data?.surname || '',
            username: data?.username || '',
            age: data?.age || '',
            bio: data?.bio || '',
          });
        }
      } catch (error: any) {
        console.error('Kullanıcı Verisi Çekme Hatası:', error);
        Alert.alert('Hata', 'Kullanıcı verileri getirilirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  // Formdaki herhangi bir input alanı değiştiğinde formData state'ini günceller.
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Form verilerini doğrular ve Firebase Auth ile Firestore üzerinde güncellemeyi gerçekleştirir.
  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Hata', 'Güncelleme için kullanıcı oturumu bulunamadı.');
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert('Geçersiz Değer', 'Ad alanı boş bırakılamaz.');
      return;
    }

    setIsUpdating(true);
    try {
      const displayName = `${formData.name} ${formData.surname}`.trim();
      await updateProfile(user, { displayName });

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, formData, { merge: true });

      Alert.alert('Başarılı', 'Profiliniz başarıyla güncellendi.');
      navigation.goBack();
    } catch (error: any) {
      console.error('Profil Güncelleme Hatası:', error);
      Alert.alert('Hata', `Profil güncellenirken bir hata oluştu: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Veriler yüklenirken gösterilecek yükleme animasyonu.
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={styles.title}>Profili Düzenle</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ad</Text>
            <View style={styles.inputWrapper}>
              <User style={styles.icon} color={COLORS.textSecondary} width={20} />
              <TextInput style={styles.input} value={formData.name} onChangeText={(v) => handleInputChange('name', v)} placeholder="Adınızı girin" />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Soyad</Text>
            <View style={styles.inputWrapper}>
              <User style={styles.icon} color={COLORS.textSecondary} width={20} />
              <TextInput style={styles.input} value={formData.surname} onChangeText={(v) => handleInputChange('surname', v)} placeholder="Soyadınızı girin" />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Kullanıcı Adı</Text>
            <View style={styles.inputWrapper}>
              <Hash style={styles.icon} color={COLORS.textSecondary} width={20} />
              <TextInput style={styles.input} value={formData.username} onChangeText={(v) => handleInputChange('username', v)} placeholder="@kullaniciadiniz" autoCapitalize="none" />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Yaş</Text>
            <View style={styles.inputWrapper}>
              <FileText style={styles.icon} color={COLORS.textSecondary} width={20} />
              <TextInput style={styles.input} value={formData.age} onChangeText={(v) => handleInputChange('age', v)} placeholder="Yaşınızı girin" keyboardType="numeric" />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <View style={styles.inputWrapper}>
              <MessageSquare style={styles.icon} color={COLORS.textSecondary} width={20} />
              <TextInput style={[styles.input, styles.textArea]} value={formData.bio} onChangeText={(v) => handleInputChange('bio', v)} placeholder="Kendinizden bahsedin..." multiline />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isUpdating} activeOpacity={0.8}>
            <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.buttonGradient}>
              {isUpdating ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Değişiklikleri Kaydet</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfile;